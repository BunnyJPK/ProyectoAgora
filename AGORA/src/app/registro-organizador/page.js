import { redirect } from "next/navigation";
import AuthLayout from "../../components/auth/AuthLayout";
import SignUpForm from "../../components/auth/SignUpForm";
import { createClient } from "../../lib/supabase/server";

const errores = {
  campos: "Completa todos los campos.",
  correo: "Introduce un correo electrónico válido.",
  password: "La contraseña debe tener al menos 8 caracteres.",
  confirmacion: "Las contraseñas no coinciden.",
  registro: "No pudimos crear la cuenta. Verifica tus datos e inténtalo nuevamente.",
  deshabilitado: "El registro de cuentas no está disponible en este momento.",
  servidor: "No pudimos conectarnos. Inténtalo nuevamente.",
};

export default async function RegistroOrganizadorPage({ searchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/eventos");

  const parametros = await searchParams;
  const codigo = parametros?.error;
  const mensajeError = Object.hasOwn(errores, codigo) ? errores[codigo] : "";
  const correoEnviado = parametros?.estado === "correo";

  return (
    <AuthLayout>
      <SignUpForm mensajeError={mensajeError} correoEnviado={correoEnviado} />
    </AuthLayout>
  );
}
