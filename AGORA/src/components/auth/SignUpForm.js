"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { registrarOrganizador } from "../../actions/auth";
import AlertMessage from "../ui/AlertMessage";

const inputClass = "h-14 w-full rounded-xl border border-transparent bg-white px-5 text-[15px] text-ciruela outline-none placeholder:text-[#aaa0a4] focus:border-coral";

function BotonCrearCuenta() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-1 flex h-14 cursor-pointer items-center justify-center gap-3 rounded-xl bg-ciruela text-base font-semibold text-white transition hover:bg-[#500c2d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral disabled:cursor-wait disabled:opacity-70"
    >
      <i className={pending ? "icon-spin1" : "icon-user"} aria-hidden="true" />
      {pending ? "Creando cuenta..." : "Crear cuenta"}
    </button>
  );
}

export default function SignUpForm({ mensajeError = "", correoEnviado = false }) {
  const [mostrarPassword, setMostrarPassword] = useState(false);

  return (
    <div className="w-full max-w-[390px] motion-safe:animate-[aparecer_0.6s_ease-out_both]">
      <h1 className="font-display text-[28px] leading-tight font-extrabold lg:text-[clamp(26px,2.5vw,35px)]">
        CREAR CUENTA
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-[#7f6672]">
        Regístrate como organizador de eventos.
      </p>

      {correoEnviado ? (
        <div className="mt-9">
          <AlertMessage variant="success" title="Revisa tu correo">
            Si el correo es válido para el registro, recibirás un enlace para confirmar tu cuenta.
          </AlertMessage>
        </div>
      ) : (
        <form action={registrarOrganizador} className="mt-9 flex flex-col gap-[16px]">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            aria-label="Nombre completo"
            autoComplete="name"
            maxLength={120}
            required
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            aria-label="Correo electrónico"
            autoComplete="email"
            maxLength={254}
            required
            className={inputClass}
          />
          <input
            type={mostrarPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña (mínimo 8 caracteres)"
            aria-label="Contraseña"
            autoComplete="new-password"
            minLength={8}
            required
            className={inputClass}
          />
          <div className="relative">
            <input
              type={mostrarPassword ? "text" : "password"}
              name="confirmarPassword"
              placeholder="Confirmar contraseña"
              aria-label="Confirmar contraseña"
              autoComplete="new-password"
              minLength={8}
              required
              className={`${inputClass} pr-14`}
            />
            <button
              type="button"
              aria-label={mostrarPassword ? "Ocultar contraseñas" : "Mostrar contraseñas"}
              onClick={() => setMostrarPassword((actual) => !actual)}
              className="absolute inset-y-0 right-2 grid w-12 cursor-pointer place-items-center text-[#977e88] hover:text-ciruela focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-coral"
            >
              <i className={mostrarPassword ? "icon-eye-off" : "icon-eye"} aria-hidden="true" />
            </button>
          </div>

          {mensajeError && (
            <AlertMessage variant="error" title="No se pudo crear la cuenta">
              {mensajeError}
            </AlertMessage>
          )}
          <BotonCrearCuenta />
        </form>
      )}

      <p className="mt-7 text-center text-sm text-[#7f6672]">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-semibold text-ciruela underline-offset-4 hover:underline">
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
