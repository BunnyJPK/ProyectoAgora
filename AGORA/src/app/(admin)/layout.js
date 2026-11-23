
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import AdminShell from "../../components/layout/AdminShell";
import { listarMisEventos } from "../../actions/eventos";

export default async function AdminLayout({ children }) {
  const supabase = await createClient();

  // DATOS DEL ORGANIZADOR
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const nombreOrganizador =
    user.user_metadata?.nombre_completo ||
    user.email?.split("@")[0] ||
    "Organizador";

  const eventos = await listarMisEventos();

  return (
    <AdminShell eventos={eventos} nombreOrganizador={nombreOrganizador}>
      {children}
    </AdminShell>
  );
}
