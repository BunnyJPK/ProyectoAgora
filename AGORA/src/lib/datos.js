import { eventosBase } from "../data/eventos";
import { asistentesBase } from "../data/asistentes";

export function listarAsistentes(eventoId) {
  return asistentesBase.filter((asistente) => asistente.eventoId === eventoId);
}

export function listarEventos() {
  return eventosBase.map((evento) => {
    const asistentes = listarAsistentes(evento.id);
    return {
      ...evento,
      registrados: asistentes.length,
      presentes: asistentes.filter((asistente) => asistente.presente).length,
    };
  });
}

export function buscarEvento(id) {
  return listarEventos().find((evento) => evento.id === id);
}

export function buscarEventoPorSlug(slug) {
  return listarEventos().find((evento) => evento.slug === slug);
}

export function buscarAcreditacion(eventoId, registroId) {
  if (!registroId) return null;
  const asistente = listarAsistentes(eventoId).find((item) => item.id === registroId);
  return asistente ? { nombre: asistente.nombre, correo: asistente.correo, qrDataUrl: null } : null;
}
