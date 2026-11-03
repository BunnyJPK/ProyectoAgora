"use client";

import Link from "next/link";

import { useState } from "react";
import { listarEventos } from "../../../lib/datos";
import EventCard from "../../../components/eventos/EventCard";

export default function MisEventosPage() {
  const [busqueda, setBusqueda] = useState("");

  const eventos = listarEventos().filter((evento) =>
    evento.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="max-w-[1060px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <p className="mb-[18px] text-xs text-[#9b818b]">ÁGORA › Mis eventos</p>
      <h1 className="font-display text-[clamp(31px,3.5vw,44px)] leading-[1.18] font-extrabold tracking-[-0.8px] text-ciruela">
        MIS EVENTOS
      </h1>
      <p className="mt-2.5 text-sm leading-relaxed text-[#805d6c]">
        Selecciona un evento o crea uno nuevo.
      </p>

      <div className="mt-9 flex flex-wrap items-center gap-3 lg:mt-11 lg:gap-5">
        <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#e9dee1] bg-white px-[18px] text-[#b1a0a7] focus-within:border-coral sm:max-w-[350px]">
          <i className="icon-search" aria-hidden="true" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar evento"
            aria-label="Buscar evento"
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ciruela outline-none placeholder:text-[#ad9ca3]"
          />
        </label>
        <Link
          href="/eventos/nuevo"
          className="inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-coral px-6 text-[13px] font-bold text-white transition-colors hover:bg-[#ed5d52] sm:w-auto"
        >
          <i className="icon-plus" aria-hidden="true" />
          Crear nuevo evento
        </Link>
      </div>

      <div className="mt-10 grid max-w-[780px] grid-cols-1 gap-7 sm:grid-cols-2 lg:mt-14">
        {eventos.map((evento) => (
          <EventCard key={evento.id} evento={evento} />
        ))}

        {eventos.length === 0 && (
          <p className="col-span-full text-sm text-[#805d6c]">
            {busqueda ? "No se encontraron eventos con ese nombre." : "Todavía no hay eventos."}
          </p>
        )}
      </div>
    </section>
  );
}
