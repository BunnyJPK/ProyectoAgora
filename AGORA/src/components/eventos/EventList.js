"use client";

import Link from "next/link";
import { useState } from "react";
import EventCard from "./EventCard";

export default function EventList({ eventos }) {
  const [busqueda, setBusqueda] = useState("");

  const eventosFiltrados = eventos.filter((evento) =>
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

      {eventosFiltrados.length > 0 ? (
        <div className="mt-10 grid max-w-[780px] grid-cols-1 gap-7 sm:grid-cols-2 lg:mt-14">
          {eventosFiltrados.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-10 max-w-[780px] rounded-[22px] border border-[#eadfe3] bg-white px-6 py-12 text-center sm:mt-14 sm:py-16">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-hueso text-2xl text-ciruela">
            <i className={busqueda ? "icon-search" : "icon-calendar"} aria-hidden="true" />
          </div>
          <h2 className="mt-5 font-display text-xl font-bold text-ciruela">
            {busqueda ? "No se encontraron eventos" : "Aún no tienes eventos"}
          </h2>
          <p className="mx-auto mt-3 max-w-[400px] text-sm leading-6 text-[#805d6c]">
            {busqueda
              ? "Prueba con otro nombre para encontrar el evento que buscas."
              : "Crea tu primer evento para comenzar a gestionar registros y accesos."}
          </p>
          {!busqueda && (
            <Link
              href="/eventos/nuevo"
              className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-coral px-6 text-sm font-semibold text-white transition-colors hover:bg-[#ed5d52]"
            >
              <i className="icon-plus" aria-hidden="true" />
              Crear mi primer evento
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
