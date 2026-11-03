"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "../ui/AlertMessage";
import { registrarAsistente } from "../../lib/acciones";

const input = "min-h-13 w-full rounded-xl border border-[#e8dce1] bg-[#fffdfc] px-4 text-[15px] text-ciruela outline-none transition placeholder:text-[#ab9aa2] focus:border-coral focus:ring-2 focus:ring-coral/15";

export default function RegistrationForm({ evento }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nombre = String(datos.get("nombre") || "").trim();
    const correo = String(datos.get("correo") || "").trim();

    if (nombre.length < 2) {
      setError("Ingresa tu nombre completo.");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      const registro = await registrarAsistente({ eventoId: evento.id, nombre, correo });
      router.push(`/registro/${encodeURIComponent(evento.slug)}/acreditacion?registro=${encodeURIComponent(registro.id)}`);
    } catch {
      setError("No se pudo completar tu registro. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <h2 className="font-display text-[23px] font-extrabold leading-tight text-ciruela sm:text-[27px]">Regístrate al evento</h2>
      <p className="mt-2 max-w-[540px] text-sm leading-7 text-[#866e79]">Completa tus datos para obtener tu acreditación.</p>
      <form onSubmit={enviar} className="mt-8 space-y-6">
        <div>
          <label htmlFor="registro-nombre" className="mb-2.5 block text-[13px] font-bold text-ciruela">Nombre completo <span className="text-[#b64352]">*</span></label>
          <input id="registro-nombre" name="nombre" type="text" autoComplete="name" placeholder="Tu nombre y apellidos" maxLength={100} required onChange={() => setError("")} className={input} />
        </div>
        <div>
          <label htmlFor="registro-correo" className="mb-2.5 block text-[13px] font-bold text-ciruela">Correo electrónico <span className="text-[#b64352]">*</span></label>
          <input id="registro-correo" name="correo" type="email" autoComplete="email" placeholder="nombre@ejemplo.com" maxLength={160} required onChange={() => setError("")} className={input} />
        </div>
        <p className="text-xs leading-6 text-[#927986]">Se permite un registro por correo electrónico para este evento.</p>
        {error && <AlertMessage variant="error" title="Revisa tus datos">{error}</AlertMessage>}
        <button type="submit" disabled={enviando} className="flex min-h-13 w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-coral px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#ea6056] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ciruela disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[240px]">
          {enviando ? "Procesando..." : "Completar registro"}
          <i className={enviando ? "icon-spin1" : "icon-right-open-big"} aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
