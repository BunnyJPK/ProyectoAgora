"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "../lib/supabase/server";

async function obtenerSesion() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Debes iniciar sesión para gestionar eventos.");
  }

  return { supabase, user };
}

function prepararEvento(evento) {
  return {
    id: evento.id,
    nombre: evento.nombre,
    fecha: evento.fecha,
    hora: evento.hora_inicio?.slice(0, 5) ?? "",
    sede: evento.sede,
    slug: evento.codigo_publico,
    registrados: Number(evento.asistentes?.[0]?.count ?? 0),
    presentes: Number(evento.checkins?.[0]?.count ?? 0),
  };
}

const camposEvento = `
  id, nombre, fecha, hora_inicio, sede, codigo_publico,
  asistentes(count), checkins(count)
`;

// VALIDACIÓN DE EVENTOS
function validarEvento(datos) {
  const nombre = String(datos?.nombre ?? "").trim();
  const fecha = String(datos?.fecha ?? "").trim();
  const hora = String(datos?.hora ?? "").trim();
  const sede = String(datos?.sede ?? "").trim();

  if (!nombre || nombre.length > 120 || !sede || sede.length > 150) {
    throw new Error("Revisa el nombre y la sede del evento.");
  }

  const fechaISO = /^\d{4}-\d{2}-\d{2}$/.test(fecha);
  const fechaReal = fechaISO && !Number.isNaN(Date.parse(`${fecha}T12:00:00Z`)) &&
    new Date(`${fecha}T12:00:00Z`).toISOString().slice(0, 10) === fecha;
  const horaValida = /^([01]\d|2[0-3]):[0-5]\d$/.test(hora);

  if (!fechaReal || !horaValida) {
    throw new Error("Revisa la fecha y la hora del evento.");
  }

  return { nombre, fecha, hora_inicio: hora, sede };
}

// CREACIÓN DE EVENTOS
export async function guardarEvento(datos) {
  const valores = validarEvento(datos);
  const { supabase, user } = await obtenerSesion();

  const { data, error } = await supabase
    .from("eventos")
    .insert({ ...valores, organizador_id: user.id })
    .select("id")
    .single();

  if (error) {
    console.error("Error al crear evento:", error.message);
    throw new Error("No se pudo crear el evento.");
  }

  revalidatePath("/eventos", "layout");
  return { id: data.id };
}

// EDICIÓN DE EVENTOS
export async function actualizarEvento(id, datos) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))) {
    throw new Error("Evento no válido.");
  }

  const valores = validarEvento(datos);
  const { supabase, user } = await obtenerSesion();

  const { data, error } = await supabase
    .from("eventos")
    .update(valores)
    .eq("id", id)
    .eq("organizador_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Error al editar evento:", error.message);
    throw new Error("No se pudieron guardar los cambios.");
  }

  revalidatePath("/eventos", "layout");
  revalidatePath(`/eventos/${id}`);
  return { id: data.id };
}

// CONSULTA DE EVENTOS
export async function listarMisEventos() {
  const { supabase, user } = await obtenerSesion();
  const { data, error } = await supabase
    .from("eventos")
    .select(camposEvento)
    .eq("organizador_id", user.id)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error al consultar eventos:", error.message);
    throw new Error("No se pudieron consultar los eventos.");
  }

  return (data ?? []).map(prepararEvento);
}

export async function buscarMiEvento(id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))) {
    return null;
  }

  const { supabase, user } = await obtenerSesion();
  const { data, error } = await supabase
    .from("eventos")
    .select(camposEvento)
    .eq("id", id)
    .eq("organizador_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Error al consultar evento:", error.message);
    throw new Error("No se pudo consultar el evento.");
  }

  return data ? prepararEvento(data) : null;
}

// ELIMINACIÓN DE EVENTOS
export async function eliminarEvento(id) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(id))) {
    throw new Error("Evento no válido.");
  }

  const { supabase, user } = await obtenerSesion();
  const { data, error } = await supabase
    .from("eventos")
    .delete()
    .eq("id", id)
    .eq("organizador_id", user.id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("Error al eliminar evento:", error.message);
    throw new Error("No se pudo eliminar el evento.");
  }

  revalidatePath("/eventos", "layout");
  return { id: data.id };
}
