import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@") || email.length < 5) {
      return NextResponse.json(
        { error: "Bitte gib eine gültige E-Mail-Adresse ein." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase env vars:", {
        url: !!supabaseUrl,
        serviceKey: !!supabaseServiceKey,
      });
      return NextResponse.json(
        { error: "Server-Konfiguration unvollständig." },
        { status: 500 }
      );
    }

    // Service-Role-Key bypasses RLS — sicher weil serverseitig (API Route)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabase
      .from("early_access")
      .insert({ email: email.toLowerCase().trim() });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { success: true, message: "Du bist bereits auf der Liste!" },
          { status: 200 }
        );
      }
      console.error("Signup error:", error);
      return NextResponse.json(
        { error: "Fehler beim Speichern. Bitte versuche es später." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Danke! Du bekommst als Erster Zugang." },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}
