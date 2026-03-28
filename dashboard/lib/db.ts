import { createClient } from "@/lib/supabase-client";

// Types shared with scan engine
export type Severity = "critical" | "warning" | "info";
export type Category = "transparency" | "documentation" | "technical" | "content";

export interface Check {
  id: string;
  name: string;
  category: Category;
  article: string;
  severity: Severity;
  passed: boolean;
  recommendation: string;
}

export interface CategoryScore {
  passed: number;
  total: number;
  score: number;
}

export interface ScanResult {
  url: string;
  score: number;
  grade: string;
  checks: Check[];
  passed: number;
  failed: number;
  total: number;
  categories: Record<Category, CategoryScore>;
  scanned_at: string;
}

const STORAGE_KEY = "neuralflow_scan_history";
const MAX_HISTORY = 20;

function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project")
  );
}

// --- localStorage fallback (demo mode) ---

function loadLocalHistory(): ScanResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalHistory(result: ScanResult) {
  const history = loadLocalHistory();
  const filtered = history.filter((h) => h.url !== result.url);
  const updated = [result, ...filtered].slice(0, MAX_HISTORY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

// --- Supabase persistence ---

async function getOrCreateDomain(userId: string, url: string): Promise<string | null> {
  const supabase = createClient();

  // Try to find existing domain
  const { data: existing } = await supabase
    .from("domains")
    .select("id")
    .eq("user_id", userId)
    .eq("url", url)
    .single();

  if (existing) return existing.id;

  // Create new domain
  const hostname = new URL(url.startsWith("http") ? url : `https://${url}`).hostname;
  const { data: created, error } = await supabase
    .from("domains")
    .insert({ user_id: userId, url, name: hostname })
    .select("id")
    .single();

  if (error) {
    console.error("Domain creation failed:", error.message);
    return null;
  }
  return created.id;
}

// --- Public API ---

export async function saveScan(result: ScanResult): Promise<void> {
  if (!isSupabaseConfigured()) {
    saveLocalHistory(result);
    return;
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Not logged in — use localStorage
    saveLocalHistory(result);
    return;
  }

  const domainId = await getOrCreateDomain(user.id, result.url);
  if (!domainId) {
    // Fallback to localStorage if DB fails
    saveLocalHistory(result);
    return;
  }

  const { error } = await supabase.from("scans").insert({
    user_id: user.id,
    domain_id: domainId,
    url: result.url,
    score: result.score,
    grade: result.grade,
    passed: result.passed,
    failed: result.failed,
    total: result.total,
    categories: result.categories,
    checks: result.checks,
    scanned_at: result.scanned_at,
  });

  if (error) {
    console.error("Scan save failed:", error.message);
    saveLocalHistory(result);
  }
}

export async function loadScans(): Promise<ScanResult[]> {
  if (!isSupabaseConfigured()) {
    return loadLocalHistory();
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return loadLocalHistory();
  }

  const { data, error } = await supabase
    .from("scans")
    .select("*")
    .eq("user_id", user.id)
    .order("scanned_at", { ascending: false })
    .limit(MAX_HISTORY);

  if (error || !data) {
    return loadLocalHistory();
  }

  return data.map((row) => ({
    url: row.url,
    score: Number(row.score),
    grade: row.grade,
    checks: row.checks as Check[],
    passed: row.passed,
    failed: row.failed,
    total: row.total,
    categories: row.categories as Record<Category, CategoryScore>,
    scanned_at: row.scanned_at,
  }));
}

export async function deleteAllScans(): Promise<void> {
  if (!isSupabaseConfigured()) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  await supabase.from("scans").delete().eq("user_id", user.id);
  await supabase.from("domains").delete().eq("user_id", user.id);
}
