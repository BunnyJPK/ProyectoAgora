"use client";

import { useState } from "react";

export default function CopyLinkButton({ ruta }) {
  const [estado, setEstado] = useState("idle");

  async function copiar() {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${ruta}`);
      setEstado("success");
    } catch {
      setEstado("error");
    }
  }

  return (
    <div className="inline-flex flex-col gap-2">
      <button
        type="button"
        onClick={copiar}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#e9dee1] px-5 text-sm font-semibold text-ciruela transition-colors hover:border-coral"
      >
        <i className="icon-docs" aria-hidden="true" />
        Copiar enlace
      </button>
      {estado !== "idle" && (
        <span role="status" className={`text-xs ${estado === "success" ? "text-green-800" : "text-red-700"}`}>
          {estado === "success" ? "Enlace copiado" : "No se pudo copiar el enlace"}
        </span>
      )}
    </div>
  );
}
