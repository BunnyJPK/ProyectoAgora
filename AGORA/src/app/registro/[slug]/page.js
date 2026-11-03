import { notFound } from "next/navigation";
import RegistrationForm from "../../../components/registro/RegistrationForm";
import { buscarEventoPorSlug } from "../../../lib/datos";
import { formatearFecha } from "../../../lib/fecha";
import PublicHeader from "../../../components/registro/PublicHeader";

export default async function RegistroPage({ params }) {
  const { slug } = await params;
  const evento = buscarEventoPorSlug(slug);

  if (!evento) notFound();

  const fecha = formatearFecha(evento.fecha);

  return (
    <main className="min-h-svh bg-hueso text-ciruela">
      <PublicHeader />

      <div className="mx-auto max-w-[860px] px-4 pt-9 pb-14 sm:px-6 sm:pt-12 sm:pb-20">
        <p className="mb-7 text-sm font-semibold text-[#846575]">Registro de asistentes</p>

        <section className="overflow-hidden rounded-[24px] bg-white shadow-[0_18px_55px_rgba(57,5,31,0.07)] motion-safe:animate-[aparecer_0.4s_ease-out_both]">
          <div className="bg-ciruela px-6 py-8 text-white sm:px-10 sm:py-10">
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-[#f7a9aa]">
              Estás invitado
            </p>
            <h1 className="max-w-[650px] font-display text-[clamp(25px,4vw,38px)] leading-[1.22] font-extrabold">
              {evento.nombre}
            </h1>
            <div className="mt-6 flex flex-col gap-3 text-[13px] leading-6 text-[#f2e5e9] sm:flex-row sm:flex-wrap sm:gap-x-8">
              <span className="inline-flex items-start gap-2">
                <i className="icon-calendar mt-0.5" aria-hidden="true" />
                <span>{fecha} · {evento.hora} h</span>
              </span>
              <span className="inline-flex items-start gap-2">
                <i className="icon-location mt-0.5" aria-hidden="true" />
                <span>{evento.sede}</span>
              </span>
            </div>
          </div>

          <div className="px-6 py-9 sm:px-10 sm:py-11">
            <RegistrationForm evento={evento} />
          </div>
        </section>

        <footer className="mt-7 text-center text-xs leading-6 text-[#927986]">
          Registro gestionado con <span className="font-semibold text-ciruela">ÁGORA</span>
        </footer>
      </div>
    </main>
  );
}
