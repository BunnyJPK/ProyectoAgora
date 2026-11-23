import { redirect } from "next/navigation";
import AuthLayout from "../../components/auth/AuthLayout";
import LoginForm from "../../components/auth/LoginForm";
import { createClient } from "../../lib/supabase/server";

const mensajes = {
  campos: "Ingresa tu correo y contraseña.",
  credenciales: "Correo o contraseña incorrectos.",
  confirmacion: "Confirma tu correo para iniciar sesión.",
  servidor: "No fue posible iniciar sesión. Inténtalo nuevamente.",
  enlace: "El enlace de confirmación no es válido o ha caducado.",
};

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (data?.claims) redirect("/eventos");

  const parametros = await searchParams;
  const codigo = parametros?.error;
  const mensajeError = Object.hasOwn(mensajes, codigo) ? mensajes[codigo] : "";

  return (
    <AuthLayout>
      <LoginForm mensajeError={mensajeError} />
    </AuthLayout>
  );
}
