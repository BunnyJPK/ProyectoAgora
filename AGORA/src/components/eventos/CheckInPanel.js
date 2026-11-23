"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registrarCheckin } from "../../actions/checkins";
import Link from "next/link";
import AlertMessage from "../ui/AlertMessage";
import EventPageHeader from "./EventPageHeader";
import CameraScanner from "./CameraScanner";

export default function CheckInPanel({ evento, resultadoInicial = null }) {
  const [resultado, setResultado] = useState(resultadoInicial);
  const [codigo, setCodigo] = useState("");
  const [guardando, setGuardando] = useState(false);
  const router = useRouter();

  async function validarCodigo(eventoFormulario) {
    eventoFormulario.preventDefault();
    if (guardando || resultado || !codigo.trim()) return;

    setGuardando(true);

    try {
      const respuesta = await registrarCheckin(evento.id, codigo);
      setResultado(respuesta);
      if (respuesta.estado === "success") router.refresh();
    } catch {
      setResultado({
        estado: "error",
        titulo: "No se pudo validar la entrada",
        descripcion: "Inténtalo nuevamente.",
      });
    } finally {
      setGuardando(false);
    }
  }
  const rutaEvento = `/eventos/${encodeURIComponent(evento.id)}`;

  return (
    <section className="max-w-[1060px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <EventPageHeader
        evento={evento}
        titulo="Check-in"
        descripcion="Valida las acreditaciones de los asistentes para controlar la entrada al evento."
      />

      <div className="mt-9 grid gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)] lg:items-start">
        <article className="min-w-0 rounded-[22px] bg-white p-5 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-8">
          <h2 className="font-display text-lg font-bold text-ciruela">Escáner QR</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#927986]">Escanea la acreditación de cada asistente.</p>

          <CameraScanner pausado={Boolean(resultado)} />

          <details className="mt-5 rounded-xl border border-[#eee4e8] bg-[#fdfafa] px-4 py-4 sm:px-5">
            <summary className="cursor-pointer text-[13px] font-semibold text-ciruela focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral">
              Introducir código de acreditación
            </summary>
            <form onSubmit={validarCodigo} className="mt-4 space-y-3">
              <label htmlFor="codigo-acreditacion" className="block text-xs font-medium text-[#806674]">
                Código de acreditación
              </label>
              <input
                id="codigo-acreditacion"
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Código de la acreditación"
                autoComplete="off"
                spellCheck={false}
                maxLength={36}
                required
                disabled={guardando || Boolean(resultado)}
                className="min-h-11 w-full rounded-xl border border-[#e9dee1] bg-white px-4 text-sm text-ciruela outline-none focus:border-coral disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={guardando || Boolean(resultado) || !codigo.trim()}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ciruela px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <i className={guardando ? "icon-spin1" : "icon-ok-circled"} aria-hidden="true" />
                {guardando ? "Validando…" : "Validar entrada"}
              </button>
            </form>
          </details>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={`${rutaEvento}/asistentes`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e9dee1] px-5 text-sm font-semibold text-ciruela transition-colors hover:border-coral">
              <i className="icon-users" aria-hidden="true" /> Ver asistentes
            </Link>
            <Link href={`${rutaEvento}/offline`} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e9dee1] px-5 text-sm font-semibold text-ciruela transition-colors hover:border-coral">
              <i className="icon-wifi" aria-hidden="true" /> Modo offline
            </Link>
          </div>
        </article>

        <article className="min-w-0 rounded-[22px] bg-white p-5 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-8">
          <h2 className="font-display text-lg font-bold text-ciruela">Resultado del acceso</h2>
          <p className="mt-2 text-[13px] leading-6 text-[#927986]">El resultado permanecerá visible hasta la siguiente lectura.</p>
          <div aria-live="polite" aria-atomic="true" className="mt-6">
            {resultado ? (
              <>
                <AlertMessage variant={resultado.estado} title={resultado.titulo}>{resultado.descripcion}</AlertMessage>
                {resultado.nombre && (
                  <dl className="mt-4 rounded-xl border border-[#eee4e8] px-4 py-4 text-[13px]">
                    <dt className="text-xs text-[#997d8b]">Asistente</dt>
                    <dd className="mt-1 font-semibold text-ciruela">{resultado.nombre}</dd>
                    <dt className="mt-3 text-xs text-[#997d8b]">Correo</dt>
                    <dd className="mt-1 break-all text-[#805d6c]">{resultado.correo}</dd>
                  </dl>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-[#eee4e8] bg-[#faf7f8] px-5 py-8 text-center">
                <i className="icon-qrcode text-3xl text-[#a48b97]" aria-hidden="true" />
                <p className="mt-3 text-sm font-semibold text-ciruela">Esperando lectura</p>
                <p className="mt-1 text-xs leading-6 text-[#927986]">No hay una acreditación escaneada.</p>
              </div>
            )}
          </div>
          <button
            type="button"
            disabled={!resultado}
            onClick={() => { setResultado(null); setCodigo(""); }}
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-ciruela px-5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <i className="icon-arrows-ccw" aria-hidden="true" />
            Escanear siguiente
          </button>
        </article>
      </div>
    </section>
  );
}
