"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AlertMessage from "../ui/AlertMessage";

function MarcoEscaneo({ className = "" }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute ${className}`}>
      <span className="absolute top-0 left-0 h-9 w-9 rounded-tl-lg border-t-[3px] border-l-[3px] border-coral" />
      <span className="absolute top-0 right-0 h-9 w-9 rounded-tr-lg border-t-[3px] border-r-[3px] border-coral" />
      <span className="absolute bottom-0 left-0 h-9 w-9 rounded-bl-lg border-b-[3px] border-l-[3px] border-coral" />
      <span className="absolute right-0 bottom-0 h-9 w-9 rounded-br-lg border-r-[3px] border-b-[3px] border-coral" />
    </div>
  );
}

function mensajeDeCamara(error) {
  switch (error?.name) {
    case "NotAllowedError":
    case "PermissionDeniedError":
      return "No se concedió acceso a la cámara. Revisa los permisos del navegador e inténtalo de nuevo.";
    case "NotFoundError":
    case "DevicesNotFoundError":
      return "No se encontró ninguna cámara disponible en este dispositivo.";
    case "NotReadableError":
    case "TrackStartError":
      return "No se pudo usar la cámara. Comprueba que otra aplicación no la esté utilizando.";
    case "SecurityError":
      return "Para acceder a la cámara, abre ÁGORA mediante HTTPS o localhost.";
    default:
      return "No se pudo iniciar la cámara. Inténtalo de nuevo.";
  }
}

export default function CameraScanner({ pausado = false }) {
  const [estado, setEstado] = useState("inactiva");
  const [error, setError] = useState("");
  const flujoRef = useRef(null);
  const solicitudRef = useRef(0);
  const videoEscritorioRef = useRef(null);
  const videoMovilRef = useRef(null);

  const detenerCamara = useCallback(() => {
    solicitudRef.current += 1;
    flujoRef.current?.getTracks().forEach((pista) => pista.stop());
    flujoRef.current = null;
    setEstado("inactiva");
    setError("");
  }, []);

  async function activarCamara() {
    setError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("No se puede acceder a la cámara desde este navegador o conexión. Usa HTTPS o localhost.");
      setEstado("error");
      return;
    }

    const solicitud = ++solicitudRef.current;
    setEstado("iniciando");

    try {
      const flujo = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: { ideal: "environment" } },
      });

      if (solicitud !== solicitudRef.current) {
        flujo.getTracks().forEach((pista) => pista.stop());
        return;
      }

      flujoRef.current = flujo;
      setEstado("activa");
    } catch (err) {
      if (solicitud !== solicitudRef.current) return;
      setError(mensajeDeCamara(err));
      setEstado("error");
    }
  }

  // Conecta el flujo de cámara a las vistas de escritorio y móvil.
  useEffect(() => {
    if (estado !== "activa") return;

    const videos = [videoEscritorioRef.current, videoMovilRef.current].filter(Boolean);

    videos.forEach((video) => {
      video.srcObject = flujoRef.current;
      video.play().catch(() => {});
    });

    return () => {
      videos.forEach((video) => {
        video.pause();
        video.srcObject = null;
      });
    };
  }, [estado, pausado]);

  // Libera la cámara cuando se abandona la página o se oculta la pestaña.
  useEffect(() => {
    const alOcultar = () => {
      if (document.hidden) detenerCamara();
    };
    const alPresionarTecla = (evento) => {
      if (evento.key === "Escape") detenerCamara();
    };

    document.addEventListener("visibilitychange", alOcultar);
    document.addEventListener("keydown", alPresionarTecla);

    return () => {
      document.removeEventListener("visibilitychange", alOcultar);
      document.removeEventListener("keydown", alPresionarTecla);
      solicitudRef.current += 1;
      flujoRef.current?.getTracks().forEach((pista) => pista.stop());
      flujoRef.current = null;
    };
  }, [detenerCamara]);

  const activa = estado === "activa";
  const iniciando = estado === "iniciando";

  return (
    <>
      {!activa ? (
        <div className="mt-7 flex min-h-[270px] flex-col items-center justify-center rounded-[18px] bg-[#2a0920] px-6 py-9 text-center text-white sm:min-h-[300px]">
          <span className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[34px]">
            <i className="icon-camera" aria-hidden="true" />
          </span>
          <h3 className="mt-5 font-display text-xl font-bold">Escanear acreditación</h3>
          <p className="mt-2 max-w-[280px] text-[13px] leading-6 text-[#ead6df]">
            Activa la cámara y apunta al código QR del asistente.
          </p>
          <button
            type="button"
            onClick={activarCamara}
            disabled={iniciando}
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-coral px-7 text-sm font-bold text-[#2a0920] transition-colors hover:bg-[#ff8278] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
          >
            <i className={iniciando ? "icon-spin1" : "icon-camera"} aria-hidden="true" />
            {iniciando ? "Abriendo cámara…" : "Activar cámara"}
          </button>
        </div>
      ) : (
        <div className="mt-7">
          {/* Lector integrado para tablets y escritorio. */}
          <div className="relative hidden aspect-[4/3] overflow-hidden rounded-[18px] bg-[#2a0920] md:block xl:aspect-video">
            <video
              ref={videoEscritorioRef}
              autoPlay
              muted
              playsInline
              aria-label="Vista de la cámara"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-black/65 to-transparent px-5 pt-4 pb-8 text-white">
              <span className="inline-flex items-center gap-2 text-xs font-semibold">
                <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden="true" />
                {pausado ? "Lectura en pausa" : "Cámara activa"}
              </span>
              <button
                type="button"
                onClick={detenerCamara}
                className="rounded-lg bg-black/35 px-3 py-2 text-xs font-semibold transition-colors hover:bg-black/65 focus-visible:outline-2 focus-visible:outline-white"
              >
                <i className="icon-cancel mr-1" aria-hidden="true" /> Cerrar cámara
              </button>
            </div>
            {!pausado && <MarcoEscaneo className="top-1/2 left-1/2 h-[58%] w-[55%] max-w-[310px] -translate-x-1/2 -translate-y-1/2" />}
            <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 pt-9 pb-5 text-center text-xs font-medium text-white">
              {pausado ? "Revisa el resultado antes de continuar" : "Coloca el código QR dentro del marco"}
            </p>
          </div>

          {/* En móvil, la cámara utiliza una vista a pantalla completa. */}
          <div className="flex flex-col items-center gap-3 rounded-[18px] bg-[#2a0920] px-6 py-8 text-center text-white md:hidden">
            <i className="icon-camera text-3xl" aria-hidden="true" />
            <p className="text-sm font-semibold">{pausado ? "Lectura en pausa" : "Cámara activa"}</p>
            {pausado && (
              <button type="button" onClick={detenerCamara} className="min-h-10 rounded-xl border border-white/35 px-5 text-xs font-semibold">
                Cerrar cámara
              </button>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <AlertMessage variant="error" title="No se pudo abrir la cámara">{error}</AlertMessage>
        </div>
      )}

      {activa && !pausado && (
        <div role="dialog" aria-modal="true" aria-label="Escanear acreditación" className="fixed inset-0 z-[90] flex flex-col bg-[#160810] text-white md:hidden">
          <video
            ref={videoMovilRef}
            autoPlay
            muted
            playsInline
            aria-label="Vista de la cámara"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20" aria-hidden="true" />
          <div className="relative z-10 flex items-center justify-between gap-4 bg-gradient-to-b from-black/80 to-transparent px-5 pt-[max(24px,env(safe-area-inset-top))] pb-10">
            <div>
              <p className="font-display text-lg font-bold">Escanear acreditación</p>
              <span className="mt-1 inline-flex items-center gap-2 text-xs text-white/85">
                <span className="h-2 w-2 rounded-full bg-green-400" aria-hidden="true" /> Cámara activa
              </span>
            </div>
            <button
              type="button"
              autoFocus
              onClick={detenerCamara}
              aria-label="Cerrar cámara"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 bg-black/40 text-xl focus-visible:outline-2 focus-visible:outline-white"
            >
              <i className="icon-cancel" aria-hidden="true" />
            </button>
          </div>
          <div className="pointer-events-none relative z-10 flex flex-1 items-center justify-center px-7">
            <MarcoEscaneo className="relative h-[min(72vw,340px)] w-[min(72vw,340px)]" />
          </div>
          <p className="relative z-10 bg-gradient-to-t from-black/85 to-transparent px-8 pt-12 pb-[max(32px,env(safe-area-inset-bottom))] text-center text-sm font-medium">
            Coloca el código QR dentro del marco
          </p>
        </div>
      )}
    </>
  );
}
