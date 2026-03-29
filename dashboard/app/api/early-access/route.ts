import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const ALLOWED_ORIGINS = [
  "https://neuralflow.mylurch.com",
  "https://dashboard-two-tau-78.vercel.app",
];

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function jsonWithCors(body: object, status: number, origin: string | null) {
  return NextResponse.json(body, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get("origin");
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@") || email.length < 5) {
      return jsonWithCors(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        400, origin
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase env vars:", {
        url: !!supabaseUrl,
        serviceRoleKey: !!supabaseKey,
      });
      return jsonWithCors(
        { error: "Server-Konfiguration unvollständig." },
        500, origin
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase
      .from("early_access")
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === "23505") {
        return jsonWithCors(
          { success: true, message: "Du bist bereits auf der Liste!" },
          200, origin
        );
      }
      console.error("Signup error:", error);
      return jsonWithCors(
        { error: "Fehler beim Speichern. Bitte versuche es später." },
        500, origin
      );
    }

    return jsonWithCors(
      { success: true, message: "Danke! Du bekommst als Erster Zugang." },
      200, origin
    );
  } catch {
    return jsonWithCors(
      { error: "Ungültige Anfrage." },
      400, origin
    );
  }
}
