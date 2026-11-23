import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AdminShell from "../../components/layout/AdminShell";
import { listarMisEventos } from "../../actions/eventos";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  const eventos = await listarMisEventos();
  return <AdminShell eventos={eventos}>{children}</AdminShell>;
}
