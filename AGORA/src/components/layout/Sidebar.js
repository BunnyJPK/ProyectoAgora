"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cerrarSesion } from "../../lib/acciones";
import AlertMessage from "../ui/AlertMessage";
import Link from "next/link";
import { buscarEvento } from "../../lib/datos";

const opcionesGenerales = [
  { href: "/eventos", icono: "icon-right-open-big", texto: "Mis eventos" },
  { href: "/eventos/nuevo", icono: "icon-plus", texto: "Crear evento" },
];

const seccionesEvento = [
  { ruta: "", icono: "icon-right-open-big", texto: "Resumen" },
  { ruta: "/asistentes", icono: "icon-users", texto: "Asistentes" },
  { ruta: "/acceso", icono: "icon-qrcode", texto: "Check-in" },
  { ruta: "/offline", icono: "icon-wifi", texto: "Modo offline" },
];

function EnlaceMenu({ href, icono, texto, activo, alNavegar }) {
  return (
    <Link
      href={href}
      onClick={alNavegar}
      aria-current={activo ? "page" : undefined}
      className={`flex min-h-11 items-center gap-3 text-sm text-white transition-opacity hover:opacity-75 ${activo ? "font-bold" : "font-normal"}`}
    >
      <i className={`${icono} w-4 text-center text-xs`} aria-hidden="true" />
      {texto}
    </Link>
  );
}

export default function Sidebar({ menuAbierto, cerrarMenu, ruta }) {
  const router = useRouter();
  const [errorSesion, setErrorSesion] = useState(false);

  async function salir() {
    setErrorSesion(false);
    try {
      await cerrarSesion();
      router.replace("/login");
    } catch {
      setErrorSesion(true);
    }
  }

  const idEvento = ruta?.match(/^\/eventos\/([^/]+)/)?.[1];
  const evento = idEvento && idEvento !== "nuevo" ? buscarEvento(decodeURIComponent(idEvento)) : null;
  const rutaEvento = evento ? `/eventos/${encodeURIComponent(evento.id)}` : null;

  return (
    <aside
      id="menu-lateral"
      className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(290px,83vw)] flex-col overflow-y-auto bg-ciruela px-8 pt-9 pb-8 text-white transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-[260px] lg:shrink-0 lg:translate-x-0 lg:overflow-y-auto lg:px-10 lg:pt-11 lg:pb-9 ${menuAbierto ? "translate-x-0" : "-translate-x-full"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <Link href="/eventos" onClick={cerrarMenu} aria-label="Ir a Mis eventos">
          <img src="/brand/agora_logo_main.png" alt="ÁGORA" className="block w-[150px]" />
        </Link>
        <button
          type="button"
          onClick={cerrarMenu}
          aria-label="Cerrar menú"
          className="grid h-9 w-9 cursor-pointer place-items-center text-xl lg:hidden"
        >
          <i className="icon-cancel" aria-hidden="true" />
        </button>
      </div>

      <div className="mt-11 mb-11 h-[2px] w-[61px] rounded-full bg-[#f4e4e6]" />
      <p className="mb-5 text-xs text-[#e9d3db]">General</p>
      <nav aria-label="Menú principal" className="flex flex-col gap-2">
        {opcionesGenerales.map((opcion) => (
          <EnlaceMenu key={opcion.href} {...opcion} activo={ruta === opcion.href} alNavegar={cerrarMenu} />
        ))}
      </nav>

      {evento && (
        <div className="mt-9 border-t border-white/20 pt-8">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e9d3db]">Evento seleccionado</p>
          <p className="mt-3 text-sm font-semibold leading-6">{evento.nombre}</p>
          <nav aria-label="Secciones del evento" className="mt-6 flex flex-col gap-2">
            {seccionesEvento.map((opcion) => {
              const href = `${rutaEvento}${opcion.ruta}`;
              return (
                <EnlaceMenu key={href} href={href} icono={opcion.icono} texto={opcion.texto}
                  activo={ruta === href} alNavegar={cerrarMenu} />
              );
            })}
          </nav>
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 pt-12">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-hueso text-lg text-[#9c8a91]" aria-hidden="true">
          <i className="icon-user" />
        </span>
        <div>
          <strong className="block text-[13px]">Organizador</strong>
          <button type="button" onClick={salir} className="mt-1.5 inline-flex cursor-pointer items-center gap-1.5 text-xs text-[#ead5de] hover:text-white">
            <i className="icon-logout" aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      </div>
      {errorSesion && (
        <div className="mt-4">
          <AlertMessage variant="error" title="No se pudo cerrar sesión">Inténtalo de nuevo.</AlertMessage>
        </div>
      )}
    </aside>
  );
}
