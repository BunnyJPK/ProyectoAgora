"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { crearClienteAdmin } from "../lib/supabase/admin";
import { createClient } from "../lib/supabase/server";

const codigoValido = /^[0-9a-f]{12}$/i;
const uuidValido = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// CONSULTA PÚBLICA DEL EVENTO
export async function buscarEventoPublico(codigo) {
  if (!codigoValido.test(String(codigo))) return null;

  const supabase = crearClienteAdmin();
  const { data, error } = await supabase
    .from("eventos")
    .select("nombre, fecha, hora_inicio, sede, codigo_publico")
    .eq("codigo_publico", codigo)
    .maybeSingle();

  if (error) {
    console.error("Error al consultar el formulario público:", error.message);
    throw new Error("No se pudo consultar el evento.");
  }

  if (!data) return null;
  return {
    nombre: data.nombre,
    fecha: data.fecha,
    hora: data.hora_inicio?.slice(0, 5) ?? "",
    sede: data.sede,
    slug: data.codigo_publico,
  };
}

// REGISTRO PÚBLICO DE ASISTENTES
export async function registrarAsistente(datos) {
  const codigo = String(datos?.slug ?? "");
  const nombre = String(datos?.nombre ?? "").trim().replace(/\s+/g, " ");
  const correo = String(datos?.correo ?? "").trim().toLowerCase();

  if (!codigoValido.test(codigo) ||
      nombre.length < 2 || nombre.length > 100 ||
      correo.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return { ok: false, mensaje: "Revisa los datos del registro." };
  }

  const supabase = crearClienteAdmin();
  const { data: evento, error: errorEvento } = await supabase
    .from("eventos")
    .select("id")
    .eq("codigo_publico", codigo)
    .maybeSingle();

  if (errorEvento || !evento) {
    return { ok: false, mensaje: "No se encontró el evento." };
  }

  const { data: registro, error } = await supabase
    .from("asistentes")
    .insert({ evento_id: evento.id, nombre_completo: nombre, correo })
    .select("qr_token")
    .single();

  if (error?.code === "23505" && error.message?.includes("asistentes_evento_correo_idx")) {
    return { ok: false, mensaje: "Este correo ya está registrado en el evento." };
  }

  if (error) {
    console.error("Error al registrar asistente:", error.message);
    return { ok: false, mensaje: "No se pudo completar el registro. Inténtalo nuevamente." };
  }

  // ACCESO TEMPORAL A LA ACREDITACIÓN DEL REGISTRANTE
  const cookieStore = await cookies();
  cookieStore.set(`agora_acreditacion_${codigo}`, registro.qr_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: `/registro/${codigo}`,
    maxAge: 60 * 60 * 24,
  });

  revalidatePath("/eventos", "layout");
  return { ok: true };
}

// CONSULTA DE ACREDITACIÓN DEL REGISTRANTE
export async function buscarAcreditacionPublica(codigo) {
  if (!codigoValido.test(String(codigo))) return null;

  const supabase = crearClienteAdmin();
  const { data: evento, error: errorEvento } = await supabase
    .from("eventos")
    .select("id, nombre, fecha, hora_inicio, sede, codigo_publico")
    .eq("codigo_publico", codigo)
    .maybeSingle();

  if (errorEvento) throw new Error("No se pudo consultar el evento.");
  if (!evento) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(`agora_acreditacion_${codigo}`)?.value;
  let acreditacion = null;

  if (uuidValido.test(String(token ?? ""))) {
    const { data: asistente, error } = await supabase
      .from("asistentes")
      .select("nombre_completo, qr_token")
      .eq("evento_id", evento.id)
      .eq("qr_token", token)
      .maybeSingle();

    if (error) throw new Error("No se pudo consultar la acreditación.");
    if (asistente) {
      acreditacion = {
        nombre: asistente.nombre_completo,
        qrToken: asistente.qr_token,
      };
    }
  }

  return {
    evento: {
      nombre: evento.nombre,
      fecha: evento.fecha,
      hora: evento.hora_inicio?.slice(0, 5) ?? "",
      sede: evento.sede,
      slug: evento.codigo_publico,
    },
    acreditacion,
  };
}

// CONSULTA DE ASISTENTES PARA ORGANIZADORES
export async function listarAsistentesDelEvento(eventoId) {
  if (!uuidValido.test(String(eventoId))) return [];

  const supabase = await createClient();
  const { data: { user }, error: errorUsuario } = await supabase.auth.getUser();

  if (errorUsuario || !user) {
    throw new Error("Debes iniciar sesión para consultar asistentes.");
  }

  const { data: evento, error: errorEvento } = await supabase
    .from("eventos")
    .select("id")
    .eq("id", eventoId)
    .eq("organizador_id", user.id)
    .maybeSingle();

  if (errorEvento || !evento) {
    throw new Error("No tienes acceso a este evento.");
  }

  const asistentes = [];
  const checkins = [];
  const tamanoPagina = 500;

  // ASISTENTES DEL EVENTO
  for (let inicio = 0; ; inicio += tamanoPagina) {
    const { data, error } = await supabase
      .from("asistentes")
      .select("id, nombre_completo, correo, qr_token, registrado_en")
      .eq("evento_id", eventoId)
      .order("registrado_en", { ascending: false })
      .order("id", { ascending: false })
      .range(inicio, inicio + tamanoPagina - 1);

    if (error) {
      console.error("Error al consultar asistentes:", error.message);
      throw new Error("No se pudieron consultar los asistentes.");
    }

    asistentes.push(...(data ?? []));
    if (!data || data.length < tamanoPagina) break;
  }

  // ENTRADAS REGISTRADAS EN EL EVENTO
  for (let inicio = 0; ; inicio += tamanoPagina) {
    const { data, error } = await supabase
      .from("checkins")
      .select("asistente_id")
      .eq("evento_id", eventoId)
      .order("asistente_id", { ascending: true })
      .range(inicio, inicio + tamanoPagina - 1);

    if (error) {
      console.error("Error al consultar entradas:", error.message);
      throw new Error("No se pudieron consultar las entradas.");
    }

    checkins.push(...(data ?? []));
    if (!data || data.length < tamanoPagina) break;
  }

  const presentes = new Set(checkins.map((entrada) => entrada.asistente_id));

  return asistentes.map((asistente) => ({
    id: asistente.id,
    nombre: asistente.nombre_completo,
    correo: asistente.correo,
    presente: presentes.has(asistente.id),
    qrToken: asistente.qr_token,
  }));
}
