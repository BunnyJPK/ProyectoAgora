"use client";

import { useEffect } from "react";

export default function RegistrarServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    let montado = true;
    const ruta =
      process.env.NODE_ENV === "development" ? "/sw.js?dev=1" : "/sw.js";

    // REGISTRO DEL SERVICE WORKER
    navigator.serviceWorker
      .register(ruta, { scope: "/", updateViaCache: "none" })
      .then(() => navigator.serviceWorker.ready)
      .then(() => {
        if (montado) window.dispatchEvent(new Event("agora-sw-listo"));
      })
      .catch((error) => {
        console.warn("No se pudo instalar el Service Worker de ÁGORA:", error);
        if (montado) window.dispatchEvent(new Event("agora-sw-error"));
      });

    return () => {
      montado = false;
    };
  }, []);

  return null;
}
