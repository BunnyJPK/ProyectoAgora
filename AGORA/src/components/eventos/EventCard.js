import Link from "next/link";
import { formatearFecha } from "../../lib/fecha";

export default function EventCard({ evento }) {
  const fecha = formatearFecha(evento.fecha);

  return (
    <article className="min-w-0 overflow-hidden rounded-[21px] bg-white shadow-[0_11px_28px_rgba(57,5,31,0.045)]">
      <div className="flex min-h-[124px] items-center bg-ciruela px-[31px] py-7 max-[500px]:min-h-[108px] max-[500px]:px-6 max-[500px]:py-6">
        <h2 className="max-w-[285px] font-display text-[19px] leading-[1.4] font-bold uppercase text-white">
          {evento.nombre}
        </h2>
      </div>
      <div className="px-[31px] pt-[26px] pb-[29px] max-[500px]:px-6 max-[500px]:py-6">
        <p className="mb-4 flex items-start gap-3 text-xs leading-normal text-[#957c88]">
          <i className="icon-calendar mt-0.5" aria-hidden="true" />
          <span>{fecha} · {evento.hora}</span>
        </p>
        <p className="mb-4 flex items-start gap-3 text-xs leading-normal text-[#957c88]">
          <i className="icon-location mt-0.5" aria-hidden="true" />
          <span>{evento.sede}</span>
        </p>
        <div className="mt-7 flex items-end justify-between gap-3 border-t border-[#eee4e8] pt-6">
          <div>
            <strong className="block font-display text-[28px] leading-none font-extrabold text-ciruela">
              {evento.registrados}
            </strong>
            <span className="mt-1 block text-[11px] text-[#916f7f]">Registros</span>
          </div>
          <Link
            href={`/eventos/${encodeURIComponent(evento.id)}`}
            className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl bg-coral px-5 text-[13px] font-bold text-white transition-colors hover:bg-[#ed5d52]"
          >
            Administrar <i className="icon-right-open-big" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
