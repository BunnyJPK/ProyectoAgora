"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

const uuidValido = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// REGISTRO DE ENTRADAS
export async function registrarCheckin(eventoId, codigoQR) {
  const id = String(eventoId ?? "").trim();
  const token = String(codigoQR ?? "").trim();

  if (!uuidValido.test(id) || !uuidValido.test(token)) {
    return {
      estado: "error",
      titulo: "Código inválido",
      descripcion: "Revisa el código de la acreditación.",
    };
  }

  const supabase = await createClient();
  const { data: { user }, error: errorSesion } = await supabase.auth.getUser();

  if (errorSesion || !user) {
    return {
      estado: "error",
      titulo: "Sesión no disponible",
      descripcion: "Inicia sesión para registrar entradas.",
    };
  }

  // VERIFICACIÓN DEL EVENTO
  const { data: evento, error: errorEvento } = await supabase
    .from("eventos")
    .select("id")
    .eq("id", id)
    .eq("organizador_id", user.id)
    .maybeSingle();

  if (errorEvento || !evento) {
    return {
      estado: "error",
      titulo: "Acceso denegado",
      descripcion: "No tienes acceso a este evento.",
    };
  }

  const { data: asistente, error: errorAsistente } = await supabase
    .from("asistentes")
    .select("id, nombre_completo, correo")
    .eq("evento_id", id)
    .eq("qr_token", token)
    .maybeSingle();

  if (errorAsistente) {
    console.error("Error al validar acreditación:", errorAsistente.message);
    return {
      estado: "error",
      titulo: "No se pudo validar",
      descripcion: "Inténtalo nuevamente.",
    };
  }

  if (!asistente) {
    return {
      estado: "error",
      titulo: "Acreditación no válida",
      descripcion: "Este código no corresponde al evento seleccionado.",
    };
  }

  // VALIDACIÓN DE ENTRADA PREVIA
  const { data: entrada, error: errorEntrada } = await supabase
    .from("checkins")
    .select("id")
    .eq("asistente_id", asistente.id)
    .maybeSingle();

  if (errorEntrada) {
    console.error("Error al comprobar check-in:", errorEntrada.message);
    return {
      estado: "error",
      titulo: "No se pudo validar",
      descripcion: "Inténtalo nuevamente.",
    };
  }

  if (entrada) {
    return {
      estado: "warning",
      titulo: "Entrada ya registrada",
      descripcion: "Esta acreditación ya fue utilizada.",
      nombre: asistente.nombre_completo,
      correo: asistente.correo,
    };
  }

  const { error: errorGuardar } = await supabase.from("checkins").insert({
    evento_id: id,
    asistente_id: asistente.id,
    operacion_id: randomUUID(),
    registrado_en: new Date().toISOString(),
    origen: "online",
  });

  if (errorGuardar?.code === "23505") {
    return {
      estado: "warning",
      titulo: "Entrada ya registrada",
      descripcion: "Esta acreditación ya fue utilizada.",
      nombre: asistente.nombre_completo,
      correo: asistente.correo,
    };
  }

  if (errorGuardar) {
    console.error("Error al registrar check-in:", errorGuardar.message);
    return {
      estado: "error",
      titulo: "No se pudo registrar la entrada",
      descripcion: "Inténtalo nuevamente.",
    };
  }

  revalidatePath("/eventos", "layout");
  revalidatePath(`/eventos/${id}`);
  revalidatePath(`/eventos/${id}/asistentes`);

  return {
    estado: "success",
    titulo: "Acceso registrado",
    descripcion: "La entrada se registró correctamente.",
    nombre: asistente.nombre_completo,
    correo: asistente.correo,
  };
}
