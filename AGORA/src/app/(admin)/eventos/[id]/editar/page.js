import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarMiEvento } from "../../../../../actions/eventos";
import EventForm from "../../../../../components/eventos/EventForm";

export default async function EditarEventoPage({ params }) {
  const { id } = await params;
  const evento = await buscarMiEvento(id);
  if (!evento) notFound();

  return (
    <section className="max-w-[850px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <p className="mb-5 text-xs text-[#9b818b]">
        <Link href="/eventos" className="hover:underline">Mis eventos</Link>
        <span aria-hidden="true"> › </span>
        <Link href={`/eventos/${encodeURIComponent(id)}`} className="hover:underline">{evento.nombre}</Link>
        <span aria-hidden="true"> › </span>
        Editar evento
      </p>
      <h1 className="font-display text-[clamp(30px,3.5vw,44px)] font-extrabold leading-tight text-ciruela">
        EDITAR EVENTO
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#805d6c]">
        Actualiza la información de tu evento.
      </p>
      <EventForm evento={evento} />
    </section>
  );
}
