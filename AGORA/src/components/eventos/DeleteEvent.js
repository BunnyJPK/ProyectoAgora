"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { eliminarEvento } from "../../actions/eventos";
import AlertMessage from "../ui/AlertMessage";

export default function DeleteEvent({ evento }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [error, setError] = useState(false);

  async function confirmarEliminacion() {
    if (nombre.trim() !== evento.nombre || eliminando) return;

    setEliminando(true);
    setError(false);

    try {
      await eliminarEvento(evento.id);
      router.replace("/eventos");
      router.refresh();
    } catch {
      setError(true);
      setEliminando(false);
    }
  }

  return (
    <section className="mt-8 rounded-2xl border border-red-200 bg-white p-6 sm:p-9">
      <h2 className="font-display text-lg font-bold text-red-800">Eliminar evento</h2>
      <p className="mt-2 text-sm leading-6 text-[#805d6c]">
        Esta acción eliminará permanentemente el evento, sus asistentes y sus registros de acceso.
      </p>

      {!confirmando ? (
        <button
          type="button"
          onClick={() => setConfirmando(true)}
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-red-300 px-5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
        >
          Eliminar evento
        </button>
      ) : (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 sm:p-5">
          <p className="text-sm font-semibold text-red-900">¿Eliminar definitivamente este evento?</p>
          <p className="mt-2 text-sm leading-6 text-red-900">
            Escribe <strong>{evento.nombre}</strong> para confirmar. No podrás recuperar estos datos.
          </p>
          <label htmlFor="confirmar-nombre-evento" className="mt-4 block text-sm font-medium text-red-900">
            Nombre del evento
          </label>
          <input
            id="confirmar-nombre-evento"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            autoComplete="off"
            disabled={eliminando}
            className="mt-2 h-11 w-full rounded-xl border border-red-200 bg-white px-4 text-sm text-ciruela outline-none focus:border-red-500"
          />

          {error && (
            <div className="mt-4">
              <AlertMessage variant="error" title="No se pudo eliminar el evento">
                Inténtalo nuevamente.
              </AlertMessage>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => { setConfirmando(false); setNombre(""); setError(false); }}
              disabled={eliminando}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl border border-[#e9dee1] bg-white px-5 text-sm font-semibold text-ciruela hover:bg-[#fff7f4] disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmarEliminacion}
              disabled={nombre.trim() !== evento.nombre || eliminando}
              className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-red-700 px-5 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {eliminando ? "Eliminando..." : "Eliminar definitivamente"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
