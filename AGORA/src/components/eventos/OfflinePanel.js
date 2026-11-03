"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EventPageHeader from "./EventPageHeader";

export default function OfflinePanel({ evento }) {
  const [enLinea, setEnLinea] = useState(null);

  useEffect(() => {
    const actualizarConexion = () => setEnLinea(navigator.onLine);

    actualizarConexion();
    window.addEventListener("online", actualizarConexion);
    window.addEventListener("offline", actualizarConexion);

    return () => {
      window.removeEventListener("online", actualizarConexion);
      window.removeEventListener("offline", actualizarConexion);
    };
  }, []);

  const rutaEvento = `/eventos/${encodeURIComponent(evento.id)}`;

  return (
    <section className="max-w-[1060px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <EventPageHeader
        evento={evento}
        titulo="Modo offline"
        descripcion="Prepara el dispositivo para validar acreditaciones sin internet y sincronizar las entradas después."
      />

      <div className="mt-9 rounded-[22px] bg-white p-5 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg font-bold text-ciruela">Estado de conexión</h2>
            <p className="mt-2 text-[13px] leading-6 text-[#927986]">
              Información del dispositivo que estás utilizando.
            </p>
          </div>
          {enLinea === null ? (
            <span role="status" className="inline-flex items-center gap-2 rounded-full bg-[#f7f2f3] px-4 py-2 text-xs font-bold text-[#806674]">
              <i className="icon-spin1" aria-hidden="true" /> Comprobando red
            </span>
          ) : enLinea ? (
            <span role="status" className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-xs font-bold text-green-800">
              <i className="icon-ok-circled" aria-hidden="true" /> Red detectada
            </span>
          ) : (
            <span role="status" className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-900">
              <i className="icon-attention" aria-hidden="true" /> Sin conexión detectada
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <article className="min-w-0 rounded-[22px] bg-white p-5 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#fff0ed] text-2xl text-ciruela" aria-hidden="true">
              <i className="icon-download" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ciruela">Preparar dispositivo</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#927986]">
                Antes del evento, descarga la lista de asistentes y los datos necesarios para verificar sus QR.
              </p>
            </div>
          </div>

          <dl className="mt-7 divide-y divide-[#eee4e8] rounded-xl border border-[#eee4e8] px-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 text-[13px]">
              <dt className="text-[#806674]">Lista local</dt>
              <dd className="font-semibold text-ciruela">Sin preparar</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 text-[13px]">
              <dt className="text-[#806674]">Última preparación</dt>
              <dd className="font-semibold text-[#927986]">—</dd>
            </div>
          </dl>

          <button
            type="button"
            disabled
            className="mt-7 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-coral px-5 text-sm font-semibold text-white opacity-60"
          >
            <i className="icon-download" aria-hidden="true" />
            Preparar este dispositivo
          </button>

        </article>

        <article className="min-w-0 rounded-[22px] bg-white p-5 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-8">
          <div className="flex items-start gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#f7f2f3] text-2xl text-ciruela" aria-hidden="true">
              <i className="icon-arrows-ccw" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-ciruela">Sincronizar entradas</h2>
              <p className="mt-2 text-[13px] leading-6 text-[#927986]">
                Las entradas realizadas sin internet se enviarán cuando el dispositivo recupere la conexión.
              </p>
            </div>
          </div>

          <dl className="mt-7 divide-y divide-[#eee4e8] rounded-xl border border-[#eee4e8] px-4 sm:px-5">
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 text-[13px]">
              <dt className="text-[#806674]">Entradas pendientes</dt>
              <dd className="font-semibold text-[#927986]">—</dd>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4 text-[13px]">
              <dt className="text-[#806674]">Última sincronización</dt>
              <dd className="font-semibold text-[#927986]">—</dd>
            </div>
          </dl>

          <button
            type="button"
            disabled
            className="mt-7 inline-flex min-h-11 w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-[#e9dee1] px-5 text-sm font-semibold text-ciruela opacity-60"
          >
            <i className="icon-arrows-ccw" aria-hidden="true" />
            Sincronizar ahora
          </button>

        </article>
      </div>

      <div className="mt-6 rounded-[22px] border border-[#eee4e8] bg-[#fffaf8] p-5 sm:p-7">
        <h2 className="font-display text-base font-bold text-ciruela">Cómo utilizar el modo offline</h2>
        <ol className="mt-4 grid gap-4 text-[13px] leading-6 text-[#805d6c] sm:grid-cols-3 sm:gap-6">
          <li className="flex items-start gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ciruela text-xs font-bold text-white">1</span>
            Prepara los datos del evento mientras tengas internet.
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ciruela text-xs font-bold text-white">2</span>
            Escanea acreditaciones y guarda las entradas en este dispositivo.
          </li>
          <li className="flex items-start gap-3">
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-ciruela text-xs font-bold text-white">3</span>
            Sincroniza las entradas al recuperar la conexión.
          </li>
        </ol>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-4">
        <Link
          href={`${rutaEvento}/acceso`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-ciruela px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
        >
          <i className="icon-qrcode" aria-hidden="true" />
          Ir a Check-in
        </Link>
      </div>
    </section>
  );
}
