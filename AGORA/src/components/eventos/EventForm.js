"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AlertMessage from "../ui/AlertMessage";
import { guardarEvento, actualizarEvento } from "../../actions/eventos";

const campo = "h-12 w-full rounded-xl border border-[#e9dee1] bg-white px-4 text-sm text-ciruela outline-none placeholder:text-[#b19ca5] focus:border-coral";

export default function EventForm({ evento }) {
  const router = useRouter();
  const editando = Boolean(evento);
  const [error, setError] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setError(false);

    const datos = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const resultado = editando
        ? await actualizarEvento(evento.id, datos)
        : await guardarEvento(datos);
      router.push(`/eventos/${encodeURIComponent(resultado.id)}`);
    } catch {
      setError(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="mt-10 rounded-2xl bg-white p-6 sm:p-9">
      <h2 className="font-display text-lg font-bold text-ciruela">Información del evento</h2>
      <p className="mt-2 text-sm leading-6 text-[#927986]">Todos los campos son obligatorios.</p>

      <div className="mt-8 space-y-6">
        <div>
          <label htmlFor="nombre" className="mb-2 block text-sm font-semibold text-ciruela">Nombre del evento</label>
          <input id="nombre" name="nombre" type="text" placeholder="Ej. Congreso de Innovación" defaultValue={evento?.nombre ?? ""} maxLength={120} required className={campo} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="fecha" className="mb-2 block text-sm font-semibold text-ciruela">Fecha</label>
            <input id="fecha" name="fecha" type="date" defaultValue={evento?.fecha ?? ""} required className={campo} />
          </div>
          <div>
            <label htmlFor="hora" className="mb-2 block text-sm font-semibold text-ciruela">Hora de inicio</label>
            <input id="hora" name="hora" type="time" defaultValue={evento?.hora ?? ""} required className={campo} />
          </div>
        </div>
        <div>
          <label htmlFor="sede" className="mb-2 block text-sm font-semibold text-ciruela">Sede o lugar</label>
          <input id="sede" name="sede" type="text" placeholder="Ej. Centro de Convenciones" defaultValue={evento?.sede ?? ""} maxLength={150} required className={campo} />
        </div>
      </div>

      {!editando && (
        <p className="mt-7 flex gap-2 text-xs leading-6 text-[#927986]">
          <i className="icon-info-circled-1 mt-0.5" aria-hidden="true" />
          Se generará un enlace de registro público para compartir con tus asistentes.
        </p>
      )}
      {error && (
        <div className="mt-5">
          <AlertMessage variant="error" title={editando ? "No se pudieron guardar los cambios" : "No se pudo crear el evento"}>Inténtalo de nuevo.</AlertMessage>
        </div>
      )}

      <div className="mt-9 flex flex-col-reverse gap-3 border-t border-[#eee4e8] pt-7 sm:flex-row sm:justify-end">
        <Link href={editando ? `/eventos/${encodeURIComponent(evento.id)}` : "/eventos"} className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#e9dee1] px-7 text-sm font-semibold text-ciruela transition-colors hover:bg-hueso">
          Cancelar
        </Link>
        <button type="submit" disabled={enviando} className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-coral px-7 text-sm font-semibold text-white transition-colors hover:bg-[#ed5d52] disabled:cursor-wait disabled:opacity-70">
          <i className={enviando ? "icon-spin1" : editando ? "icon-ok-circled" : "icon-plus"} aria-hidden="true" />
          {enviando ? "Guardando..." : editando ? "Guardar cambios" : "Crear evento"}
        </button>
      </div>
    </form>
  );
}
