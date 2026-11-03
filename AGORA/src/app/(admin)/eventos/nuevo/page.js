import Link from "next/link";
import EventForm from "../../../../components/eventos/EventForm";

export default function CrearEventoPage() {
  return (
    <section className="max-w-[850px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <p className="mb-5 text-xs text-[#9b818b]">
        <Link href="/eventos" className="hover:underline">Mis eventos</Link>
        <span aria-hidden="true"> › </span>
        Crear evento
      </p>

      <h1 className="font-display text-[clamp(30px,3.5vw,44px)] font-extrabold leading-tight text-ciruela">
        CREAR EVENTO
      </h1>
      <p className="mt-3 text-sm leading-7 text-[#805d6c]">
        Ingresa los datos básicos para crear tu evento.
      </p>

      <EventForm />
    </section>
  );
}
