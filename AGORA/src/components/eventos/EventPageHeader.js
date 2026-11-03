import Link from "next/link";
import { formatearFecha } from "../../lib/fecha";

export default function EventPageHeader({ evento, titulo, descripcion, mostrarDatos = true }) {
  const ruta = `/eventos/${encodeURIComponent(evento.id)}`;

  return (
    <header>
      <nav aria-label="Ruta de navegación" className="mb-5 text-xs leading-5 text-[#9b818b]">
        <Link href="/eventos" className="hover:underline">Mis eventos</Link>
        <span aria-hidden="true"> › </span>
        <Link href={ruta} className="hover:underline">{evento.nombre}</Link>
        <span aria-hidden="true"> › </span>{titulo}
      </nav>
      <Link href={ruta} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ciruela hover:underline">
        <i className="icon-left-open-big text-xs" aria-hidden="true" />
        Volver al resumen
      </Link>
      <h1 className="font-display text-[clamp(30px,3.5vw,44px)] leading-[1.18] font-extrabold tracking-[-0.8px] text-ciruela">
        {titulo.toLocaleUpperCase("es-MX")}
      </h1>
      {descripcion && <p className="mt-3 max-w-[620px] text-sm leading-7 text-[#805d6c]">{descripcion}</p>}
      {mostrarDatos && (
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#927986]">
          <span className="inline-flex items-center gap-2">
            <i className="icon-calendar" aria-hidden="true" />{formatearFecha(evento.fecha)}
          </span>
          <span className="inline-flex items-center gap-2">
            <i className="icon-location" aria-hidden="true" />{evento.sede}
          </span>
        </div>
      )}
    </header>
  );
}
