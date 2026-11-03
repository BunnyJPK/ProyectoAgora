"use client";

import { useState } from "react";
import Link from "next/link";
import AlertMessage from "../ui/AlertMessage";
import PublicHeader from "./PublicHeader";
import { formatearFecha } from "../../lib/fecha";
import descargarAcreditacionPNG from "../../lib/descargarAcreditacionPNG";

export default function Acreditacion({ evento, acreditacion }) {
  const [descargando, setDescargando] = useState(false);
  const [error, setError] = useState(false);
  const fecha = formatearFecha(evento.fecha);

  async function descargar() {
    setDescargando(true);
    setError(false);
    try {
      await descargarAcreditacionPNG({ evento, acreditacion });
    } catch {
      setError(true);
    } finally {
      setDescargando(false);
    }
  }

  if (!acreditacion) {
    return (
      <main className="min-h-svh bg-hueso text-ciruela">
        <PublicHeader />
        <div className="mx-auto max-w-[620px] px-5 py-20 text-center">
          <i className="icon-info-circled-1 text-4xl text-[#927986]" aria-hidden="true" />
          <h1 className="mt-5 font-display text-2xl font-bold">No encontramos tu acreditación</h1>
          <p className="mt-3 text-sm leading-7 text-[#866e79]">Verifica el enlace de tu registro e inténtalo de nuevo.</p>
          <Link href={`/registro/${encodeURIComponent(evento.slug)}`} className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-ciruela px-6 text-sm font-semibold text-white">
            Volver al registro
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-hueso text-ciruela">
      <PublicHeader />
      <div className="mx-auto max-w-[940px] px-4 pt-9 pb-16 sm:px-6 sm:pt-12">
        <Link
          href={`/registro/${encodeURIComponent(evento.slug)}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-ciruela hover:underline"
        >
          <i className="icon-left-open-big text-xs" aria-hidden="true" />
          Volver al registro
        </Link>

        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#a26b7d]">Acreditación de asistente</p>
          <h1 className="mt-3 font-display text-[clamp(27px,4vw,39px)] leading-tight font-extrabold">Tu acreditación</h1>
          <p className="mt-3 max-w-[710px] text-sm leading-7 text-[#866e79]">
            Guarda tu acreditación y preséntala al ingresar al evento.
          </p>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,410px)_1fr] lg:gap-10">
          <section aria-label="Acreditación" className="overflow-hidden rounded-[22px] bg-white shadow-[0_15px_45px_rgba(57,5,31,0.08)]">
            <div className="bg-ciruela px-7 pt-7 pb-6 text-white sm:px-8">
              <img src="/brand/agora_logo_main.png" alt="ÁGORA" className="w-[155px]" />
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.13em] text-[#f7b6b1]">Acreditación de asistente</p>
            </div>
            <div className="h-1.5 bg-coral" />
            <div className="px-7 pt-7 pb-8 sm:px-8">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#917480]">Nombre del asistente</p>
              <p className="mt-2 break-words font-display text-[25px] leading-snug font-extrabold">
                {acreditacion?.nombre ?? "—"}
              </p>

              <div className="mt-6 border-t border-[#efe5e8] pt-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#917480]">Evento</p>
                <h2 className="mt-2 font-display text-lg font-bold leading-snug">{evento.nombre}</h2>
                <p className="mt-3 flex items-start gap-2 text-[13px] leading-6 text-[#866e79]">
                  <i className="icon-calendar mt-0.5" aria-hidden="true" />{fecha} · {evento.hora} h
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-[13px] leading-6 text-[#866e79]">
                  <i className="icon-location mt-0.5" aria-hidden="true" />{evento.sede}
                </p>
              </div>
              <div className="mt-8 flex justify-center">
                {acreditacion?.qrDataUrl ? (
                  <img src={acreditacion.qrDataUrl} alt="Código QR de acceso" className="aspect-square w-[185px] rounded-xl" />
                ) : (
                  <div aria-hidden="true" className="grid aspect-square w-[185px] place-items-center rounded-xl border border-[#e5d3dc] bg-[#fdf9fa] text-[#9c8190]">
                    <i className="icon-qrcode text-[70px]" />
                  </div>
                )}
              </div>
              <p className="mt-5 text-center text-xs text-[#917480]">Presenta esta acreditación en el acceso.</p>
            </div>
          </section>

          <aside className="rounded-[22px] bg-white p-6 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-8">
            <h2 className="font-display text-xl font-bold">Descarga de acreditación</h2>
            <p className="mt-3 text-sm leading-7 text-[#866e79]">
              Descarga tu acreditación en formato PNG para tenerla a mano el día del evento.
            </p>
            {error && (
              <div className="mt-5">
                <AlertMessage variant="error" title="No se pudo descargar la acreditación">Inténtalo nuevamente.</AlertMessage>
              </div>
            )}
            <button
              type="button"
              onClick={descargar}
              disabled={descargando || !acreditacion?.qrDataUrl}
              className="mt-6 inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-coral px-5 text-sm font-bold text-white transition-colors hover:bg-[#e95f57] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <i className={descargando ? "icon-spin1" : "icon-download"} aria-hidden="true" />
              {descargando ? "Preparando imagen..." : "Descargar acreditación PNG"}
            </button>
          </aside>
        </div>
        <p className="mt-10 text-center text-xs text-[#927986]">Registro y control de acceso con <strong className="text-ciruela">ÁGORA</strong></p>
      </div>
    </main>
  );
}
