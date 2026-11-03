"use client";

import { useState } from "react";
import AlertMessage from "../ui/AlertMessage";
import { iniciarSesion } from "../../lib/acciones";

export default function LoginForm() {
  const [verPassword, setVerPassword] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);
    setError(false);

    const datos = new FormData(evento.currentTarget);
    try {
      await iniciarSesion({
        email: String(datos.get("email") || "").trim(),
        password: String(datos.get("password") || ""),
      });
      window.location.assign("/eventos");
    } catch {
      setError(true);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="w-full max-w-[390px] motion-safe:animate-[aparecer_0.6s_ease-out_both]">
      <h1 className="font-display text-[28px] leading-tight font-extrabold lg:text-[clamp(26px,2.5vw,35px)]">
        INICIAR SESIÓN
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[#7f6672]">Ingresa tus credenciales para continuar.</p>

      <form onSubmit={enviar} className="mt-9 flex flex-col gap-[18px] lg:mt-[42px]">
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          aria-label="Correo electrónico"
          autoComplete="username"
          required
          className="h-14 w-full rounded-xl border border-transparent bg-white px-5 text-[15px] text-ciruela outline-none placeholder:text-[#aaa0a4] focus:border-coral"
        />

        <div className="relative">
          <input
            type={verPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            aria-label="Contraseña"
            autoComplete="current-password"
            required
            className="h-14 w-full rounded-xl border border-transparent bg-white pr-14 pl-5 text-[15px] text-ciruela outline-none placeholder:text-[#aaa0a4] focus:border-coral"
          />
          <button
            type="button"
            onClick={() => setVerPassword((valor) => !valor)}
            aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute inset-y-0 right-2 grid w-12 cursor-pointer place-items-center text-[#977e88] hover:text-ciruela focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-coral"
          >
            <i className={verPassword ? "icon-eye-off" : "icon-eye"} aria-hidden="true" />
          </button>
        </div>

        {error && (
          <AlertMessage variant="error" title="No se pudo iniciar sesión">
            Verifica tus datos e inténtalo nuevamente.
          </AlertMessage>
        )}
        <button
          type="submit"
          disabled={enviando}
          className="mt-[18px] flex h-14 cursor-pointer items-center justify-center gap-3 rounded-xl bg-ciruela text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#500c2d] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:cursor-wait disabled:opacity-70"
        >
          <i className={enviando ? "icon-spin1" : "icon-login"} aria-hidden="true" />
          {enviando ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
