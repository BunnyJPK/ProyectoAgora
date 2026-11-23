"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

export async function iniciarSesion(formData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    redirect("/login?error=campos");
  }

  let resultado;
  try {
    const supabase = await createClient();
    resultado = await supabase.auth.signInWithPassword({ email, password });
  } catch {
    redirect("/login?error=servidor");
  }

  if (resultado.error) {
    const codigo = resultado.error.code;
    if (codigo === "email_not_confirmed") {
      redirect("/login?error=confirmacion");
    }
    redirect("/login?error=credenciales");
  }

  revalidatePath("/", "layout");
  redirect("/eventos");
}

export async function cerrarSesion() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error("No se pudo cerrar sesión.");
  }

  revalidatePath("/", "layout");
  redirect("/login");
}

export async function registrarOrganizador(formData) {
  const nombre = String(formData.get("nombre") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const confirmacion = String(formData.get("confirmarPassword") || "");

  if (!nombre || !email || !password || !confirmacion) {
    redirect("/registro-organizador?error=campos");
  }
  if (nombre.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    redirect("/registro-organizador?error=correo");
  }
  if (password.length < 8) {
    redirect("/registro-organizador?error=password");
  }
  if (password !== confirmacion) {
    redirect("/registro-organizador?error=confirmacion");
  }

  let resultado;
  try {
    const supabase = await createClient();
    resultado = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre_completo: nombre } },
    });
  } catch {
    redirect("/registro-organizador?error=servidor");
  }

  if (resultado.error) {
    if (resultado.error.code === "signup_disabled") {
      redirect("/registro-organizador?error=deshabilitado");
    }
    redirect("/registro-organizador?error=registro");
  }

  if (resultado.data.session) {
    revalidatePath("/", "layout");
    redirect("/eventos");
  }

  redirect("/registro-organizador?estado=correo");
}
