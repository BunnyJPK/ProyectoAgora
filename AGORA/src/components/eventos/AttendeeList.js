"use client";

import { useState } from "react";
import EventPageHeader from "./EventPageHeader";
import AlertMessage from "../ui/AlertMessage";
import descargarAcreditacionPNG from "../../lib/descargarAcreditacionPNG";

function EstadoAcceso({ presente }) {
  return presente ? (
    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800">
      <i className="icon-ok-circled" aria-hidden="true" /> Presente
    </span>
  ) : (
    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#f5f0f2] px-3 py-1.5 text-xs font-medium text-[#806876]">
      <i className="icon-clock" aria-hidden="true" /> Sin entrada
    </span>
  );
}

function FilaAsistente({ asistente, evento }) {
  const [error, setError] = useState(false);

  async function descargar() {
    setError(false);
    try {
      await descargarAcreditacionPNG({ evento, acreditacion: asistente });
    } catch {
      setError(true);
    }
  }

  return (
    <details className="group border-b border-[#eee4e8] last:border-b-0">
      <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-5 transition-colors hover:bg-[#fdf9f8] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-coral sm:px-7 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,.8fr)_auto] lg:gap-5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <span className="block truncate text-[13px] font-bold text-ciruela sm:text-sm">
            {asistente.nombre}
          </span>
          <span className="mt-1 block break-all text-xs text-[#907785] lg:hidden">
            {asistente.correo}
          </span>
        </div>
        <span className="hidden min-w-0 break-all text-[13px] text-[#806674] lg:block">
          {asistente.correo}
        </span>
        <div className="col-start-2 row-start-1 lg:col-auto lg:row-auto">
          <EstadoAcceso presente={asistente.presente} />
        </div>
        <span className="col-span-2 inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-xl border border-[#eadde3] px-4 text-xs font-semibold text-ciruela transition-colors group-hover:border-coral lg:col-auto">
          <i className="icon-user" aria-hidden="true" />
          Ver ficha
          <i className="icon-right-open-big text-[10px] transition-transform group-open:rotate-90" aria-hidden="true" />
        </span>
      </summary>

      <div className="border-t border-[#f1e9ec] bg-[#fdfafa] px-5 py-6 sm:px-7">
        <h3 className="font-display text-sm font-bold text-ciruela">Detalles del registro</h3>
        <dl className="mt-4 grid gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="text-xs text-[#997d8b]">Nombre completo</dt>
            <dd className="mt-1 break-words font-medium text-ciruela">{asistente.nombre}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-xs text-[#997d8b]">Correo electrónico</dt>
            <dd className="mt-1 break-all font-medium text-ciruela">{asistente.correo}</dd>
          </div>
          <div>
            <dt className="text-xs text-[#997d8b]">Acceso al evento</dt>
            <dd className="mt-2"><EstadoAcceso presente={asistente.presente} /></dd>
          </div>
        </dl>
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={!asistente.qrDataUrl}
            onClick={descargar}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#eadde3] px-4 text-xs font-semibold text-ciruela hover:border-coral disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i className="icon-download" aria-hidden="true" />
            Descargar acreditación
          </button>
        </div>
        {error && (
          <div className="mt-4">
            <AlertMessage variant="error" title="No se pudo descargar la acreditación">Inténtalo de nuevo.</AlertMessage>
          </div>
        )}
      </div>
    </details>
  );
}

export default function AttendeeList({ evento, asistentes }) {
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const total = asistentes.length;
  const presentes = asistentes.filter((item) => item.presente).length;
  const textoBusqueda = busqueda.trim().toLocaleLowerCase("es-MX");
  const visibles = asistentes.filter((item) => {
    const coincide = `${item.nombre} ${item.correo}`.toLocaleLowerCase("es-MX").includes(textoBusqueda);
    const coincideFiltro = filtro === "todos" ||
      (filtro === "presentes" && item.presente) ||
      (filtro === "sin-entrada" && !item.presente);
    return coincide && coincideFiltro;
  });

  const filtros = [
    { id: "todos", texto: `Todos (${total})` },
    { id: "presentes", texto: `Presentes (${presentes})` },
    { id: "sin-entrada", texto: `Sin entrada (${total - presentes})` },
  ];

  return (
    <section className="max-w-[1060px] motion-safe:animate-[aparecer_0.35s_ease-out_both]">
      <EventPageHeader
        evento={evento}
        titulo="Asistentes"
        descripcion="Busca a las personas registradas y consulta su estado de acceso."
        mostrarDatos={false}
      />

      <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-[#e9dee1] bg-white px-[18px] text-[#a6929d] focus-within:border-coral sm:max-w-[390px]">
          <i className="icon-search" aria-hidden="true" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o correo"
            aria-label="Buscar asistentes por nombre o correo"
            className="h-full min-w-0 flex-1 bg-transparent text-[13px] text-ciruela outline-none placeholder:text-[#ad9ca3]"
          />
        </label>
        <p className="text-xs text-[#8d7380] sm:text-right">
          <strong className="font-bold text-ciruela">{total}</strong> registrados · <strong className="font-bold text-green-800">{presentes}</strong> presentes
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filtrar asistentes por estado">
        {filtros.map((opcion) => (
          <button
            key={opcion.id}
            type="button"
            onClick={() => setFiltro(opcion.id)}
            aria-pressed={filtro === opcion.id}
            className={`min-h-10 rounded-xl border px-4 text-xs font-semibold transition-colors ${
              filtro === opcion.id
                ? "border-ciruela bg-ciruela text-white"
                : "border-[#e8dde1] bg-white text-[#806674] hover:border-[#bda6b1]"
            }`}
          >
            {opcion.texto}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden rounded-[22px] bg-white shadow-[0_11px_28px_rgba(57,5,31,0.045)]">
        <div className="hidden grid-cols-[minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,.8fr)_auto] gap-5 border-b border-[#eee4e8] bg-[#faf6f6] px-7 py-4 text-[11px] font-semibold text-[#967e89] lg:grid">
          <span>Nombre</span><span>Correo</span><span>Estado</span><span>Registro</span>
        </div>

        {visibles.length > 0 ? (
          visibles.map((asistente) => <FilaAsistente key={asistente.id} asistente={asistente} evento={evento} />)
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
            <i className="icon-search text-2xl text-[#b59fab]" aria-hidden="true" />
            <p className="font-display text-sm font-bold text-ciruela">{total === 0 ? "Aún no hay asistentes registrados" : "No se encontraron asistentes"}</p>
            <p className="max-w-[340px] text-xs leading-6 text-[#957b88]">
              {total === 0 ? "Los registros aparecerán aquí." : "Prueba con otro nombre, correo o filtro de estado."}
            </p>
          </div>
        )}

        <div className="border-t border-[#eee4e8] px-5 py-4 text-xs text-[#997f8a] sm:px-7" role="status">
          Mostrando {visibles.length} de {total} asistentes
        </div>
      </div>
    </section>
  );
}
