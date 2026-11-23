import { createClient } from "@supabase/supabase-js";

// CLIENTE PRIVILEGIADO: SOLO PARA OPERACIONES DEL SERVIDOR
export function crearClienteAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const clave = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !clave) {
    throw new Error("Falta configurar la clave de servidor de Supabase.");
  }

  return createClient(url, clave, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
