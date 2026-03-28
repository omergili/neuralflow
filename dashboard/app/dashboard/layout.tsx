"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setEmail(user.email ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen flex">
      <nav className="w-56 bg-gray-900/50 border-r border-gray-800 p-4 flex flex-col">
        <Link href="/dashboard" className="text-[#4f8ef7] font-bold text-lg mb-8">
          NeuralFlow
        </Link>
        <div className="space-y-1 flex-1">
          <NavLink href="/dashboard" active={pathname === "/dashboard"}>Overview</NavLink>
          <NavLink href="/dashboard/domains" active={pathname === "/dashboard/domains"}>Domains</NavLink>
          <NavLink href="/dashboard/settings" active={pathname === "/dashboard/settings"}>Settings</NavLink>
        </div>
        <div className="border-t border-gray-800 pt-3 mt-3">
          {email ? (
            <div className="space-y-2">
              <p className="text-gray-500 text-xs truncate" title={email}>{email}</p>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-300 text-xs transition"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <p className="text-gray-600 text-xs">Plan: Free</p>
          )}
        </div>
      </nav>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded-md transition text-sm ${
        active
          ? "text-gray-100 bg-gray-800/70"
          : "text-gray-400 hover:text-gray-100 hover:bg-gray-800/50"
      }`}
    >
      {children}
    </Link>
  );
}
