import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET(request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const code = url.searchParams.get("code");

  if ((token_hash && type === "email") || code) {
    const supabase = await createClient();
    const { error } = code
      ? await supabase.auth.exchangeCodeForSession(code)
      : await supabase.auth.verifyOtp({ token_hash, type: "email" });

    if (!error) {
      return NextResponse.redirect(new URL("/eventos", url.origin));
    }
  }

  return NextResponse.redirect(new URL("/login?error=enlace", url.origin));
}
