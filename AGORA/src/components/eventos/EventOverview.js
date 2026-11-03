import Link from "next/link";
import CopyLinkButton from "../ui/CopyLinkButton";
import { formatearFecha } from "../../lib/fecha";

export default function EventOverview({ evento }) {
  const fecha = formatearFecha(evento.fecha);

  return (
    <section className="max-w-[1000px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <p className="mb-5 text-xs text-[#9b818b]">
        <Link href="/eventos" className="hover:underline">Mis eventos</Link>
        <span aria-hidden="true"> › </span>
        Resumen
      </p>

      <Link
        href="/eventos"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ciruela hover:underline"
      >
        <i className="icon-left-open-big text-xs" aria-hidden="true" />
        Volver a Mis eventos
      </Link>

      <h1 className="max-w-[850px] font-display text-[clamp(28px,3.1vw,42px)] leading-[1.2] font-extrabold tracking-[-0.6px] text-ciruela">
        {evento.nombre}
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#805d6c]">
        Consulta el registro y controla los accesos de tu evento.
      </p>

      <div className="mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-[#927986]">
        <span className="inline-flex items-start gap-2">
          <i className="icon-calendar mt-0.5" aria-hidden="true" />
          {fecha} · {evento.hora}
        </span>
        <span className="inline-flex items-start gap-2">
          <i className="icon-location mt-0.5" aria-hidden="true" />
          {evento.sede}
        </span>
      </div>


      <div className="mt-8 grid grid-cols-1 gap-5 rounded-[22px] bg-white p-7 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:grid-cols-2 sm:gap-0 sm:p-9">
        <div className="border-b border-[#eee4e8] pb-6 sm:border-r sm:border-b-0 sm:pb-0 sm:pr-9">
          <strong className="block font-display text-[38px] leading-none font-extrabold text-ciruela">
            {evento.registrados}
          </strong>
          <span className="mt-3 block text-sm text-[#927986]">Personas registradas</span>
        </div>
        <div className="pt-1 sm:pt-0 sm:pl-9">
          <strong className="block font-display text-[38px] leading-none font-extrabold text-ciruela">
            {evento.presentes ?? 0}
          </strong>
          <span className="mt-3 block text-sm text-[#927986]">Entradas registradas</span>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <article className="rounded-[22px] bg-white p-6 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-9">
          <h2 className="font-display text-lg font-bold text-ciruela">Registro público</h2>
          <p className="mt-2 text-sm leading-6 text-[#927986]">
            Comparte el formulario de inscripción con tus asistentes.
          </p>
          <div className="mt-7 flex items-center gap-3 overflow-hidden rounded-xl bg-[#f8f4f4] px-4 py-4 text-[#937a86]">
            <i className="icon-link shrink-0" aria-hidden="true" />
            <span className="min-w-0 truncate text-sm leading-6">/registro/{evento.slug}</span>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/registro/${encodeURIComponent(evento.slug)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-coral px-5 text-sm font-semibold text-white transition-colors hover:bg-[#ed5f57]"
            >
              <i className="icon-link" aria-hidden="true" />
              Abrir formulario
            </Link>
            <CopyLinkButton ruta={`/registro/${encodeURIComponent(evento.slug)}`} />
          </div>
        </article>

        <article className="rounded-[22px] bg-white p-6 shadow-[0_11px_28px_rgba(57,5,31,0.045)] sm:p-9">
          <h2 className="font-display text-lg font-bold text-ciruela">Control de acceso</h2>
          <p className="mt-2 text-sm leading-6 text-[#927986]">
            Escanea acreditaciones o prepara el dispositivo para trabajar sin conexión.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={`/eventos/${encodeURIComponent(evento.id)}/acceso`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-coral px-5 text-sm font-semibold text-white transition-colors hover:bg-[#ed5f57] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral"
            >
              <i className="icon-qrcode" aria-hidden="true" />
              Ir a check-in
            </Link>
            <Link
              href={`/eventos/${encodeURIComponent(evento.id)}/offline`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e9dee1] px-5 text-sm font-semibold text-ciruela transition-colors hover:border-coral"
            >
              <i className="icon-wifi" aria-hidden="true" />
              Modo offline
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
