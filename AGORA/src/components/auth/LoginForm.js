"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import AlertMessage from "../ui/AlertMessage";
import { iniciarSesion } from "../../actions/auth";

function BotonIngresar() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-[18px] flex h-14 cursor-pointer items-center justify-center gap-3 rounded-xl bg-ciruela text-base font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:bg-[#500c2d] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:cursor-wait disabled:opacity-70"
    >
      <i className={pending ? "icon-spin1" : "icon-login"} aria-hidden="true" />
      {pending ? "Ingresando..." : "Ingresar"}
    </button>
  );
}

export default function LoginForm({ mensajeError = "" }) {
  const [verPassword, setVerPassword] = useState(false);

  return (
    <div className="w-full max-w-[390px] motion-safe:animate-[aparecer_0.6s_ease-out_both]">
      <h1 className="font-display text-[28px] leading-tight font-extrabold lg:text-[clamp(26px,2.5vw,35px)]">
        INICIAR SESIÓN
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[#7f6672]">Ingresa tus credenciales para continuar.</p>

      <form action={iniciarSesion} className="mt-9 flex flex-col gap-[18px] lg:mt-[42px]">
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

        {mensajeError && (
          <AlertMessage variant="error" title="No se pudo iniciar sesión">
            {mensajeError}
          </AlertMessage>
        )}

        <BotonIngresar />
      </form>

      <p className="mt-7 text-center text-sm text-[#7f6672]">
        ¿Aún no tienes cuenta?{" "}
        <Link href="/registro-organizador" className="font-semibold text-ciruela underline-offset-4 hover:underline">
          Crear cuenta
        </Link>
      </p>
    </div>
  );
}
