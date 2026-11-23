"use client";

import gsap from "gsap";

export default function activarInteracciones(raiz) {
  const quitarEventos = [];
  const escuchar = (elemento, evento, funcion) => {
    elemento.addEventListener(evento, funcion);
    quitarEventos.push(() => elemento.removeEventListener(evento, funcion));
  };

  // TARJETAS, BOTONES Y NAVEGACIÓN
  const tarjetas = [...raiz.querySelectorAll("article")]
    .filter((tarjeta) => tarjeta.querySelector('a[href^="/eventos/"]') && !tarjeta.querySelector("form"));
  const botones = [...raiz.querySelectorAll(
    "button.bg-coral, a.bg-coral, button.bg-ciruela, a.bg-ciruela"
  )];
  const enlacesMenu = [...document.querySelectorAll("#menu-lateral nav a")];
  const raton = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (raton) {
    tarjetas.forEach((tarjeta) => {
      escuchar(tarjeta, "pointerenter", () => {
        gsap.to(tarjeta, { y: -5, duration: 0.25, ease: "power2.out", overwrite: "auto" });
      });
      escuchar(tarjeta, "pointerleave", () => {
        gsap.to(tarjeta, { y: 0, duration: 0.3, overwrite: "auto", clearProps: "transform" });
      });
    });

    botones.forEach((boton) => {
      escuchar(boton, "pointerenter", () => {
        if (boton.disabled) return;
        gsap.to(boton, { scale: 1.035, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      });
      escuchar(boton, "pointerleave", () => {
        gsap.to(boton, { scale: 1, duration: 0.24, overwrite: "auto", clearProps: "transform" });
      });
    });

    enlacesMenu.forEach((enlace) => {
      escuchar(enlace, "pointerenter", () => {
        gsap.to(enlace, { x: 4, duration: 0.2, overwrite: "auto" });
      });
      escuchar(enlace, "pointerleave", () => {
        gsap.to(enlace, { x: 0, duration: 0.2, overwrite: "auto", clearProps: "transform" });
      });
    });
  }

  botones.forEach((boton) => {
    escuchar(boton, "pointerdown", () => {
      if (boton.disabled) return;
      gsap.to(boton, { scale: 0.97, duration: 0.1, overwrite: "auto" });
    });
    escuchar(boton, "pointerup", () => {
      gsap.to(boton, { scale: 1, duration: 0.2, overwrite: "auto", clearProps: "transform" });
    });
    escuchar(boton, "pointercancel", () => {
      gsap.to(boton, { scale: 1, duration: 0.2, overwrite: "auto", clearProps: "transform" });
    });
  });

  // FORMULARIOS Y FICHAS DESPLEGABLES
  raiz.querySelectorAll("input:not([type='hidden']), textarea, select").forEach((campo) => {
    escuchar(campo, "focus", () => {
      gsap.to(campo, { boxShadow: "0 0 0 3px rgba(255,107,95,0.12)", duration: 0.2 });
    });
    escuchar(campo, "blur", () => {
      gsap.to(campo, {
        boxShadow: "0 0 0 0px rgba(255,107,95,0)",
        duration: 0.2,
        clearProps: "boxShadow",
      });
    });
  });

  raiz.querySelectorAll("details").forEach((ficha) => {
    escuchar(ficha, "toggle", () => {
      if (!ficha.open || !ficha.children[1]) return;
      gsap.fromTo(ficha.children[1], { autoAlpha: 0, y: -8 }, {
        autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out",
        clearProps: "opacity,visibility,transform",
      });
    });
  });

  // FILTROS Y ELEMENTOS QUE APARECEN DESPUÉS
  const observador = new MutationObserver((cambios) => {
    for (const cambio of cambios) {
      if (cambio.type === "attributes" && cambio.target.getAttribute("aria-pressed") === "true") {
        gsap.fromTo(cambio.target, { scale: 0.95 }, {
          scale: 1, duration: 0.24, ease: "back.out(1.5)", clearProps: "transform",
        });
      }
      if (cambio.type !== "childList") continue;

      cambio.addedNodes.forEach((nodo) => {
        if (nodo.nodeType !== 1) return;
        const nuevos = nodo.matches?.("article") ? [nodo] : [...(nodo.querySelectorAll?.("article") ?? [])];
        if (nuevos.length) {
          gsap.fromTo(nuevos.slice(0, 8), { autoAlpha: 0, y: 12 }, {
            autoAlpha: 1, y: 0, duration: 0.38, stagger: 0.05,
            ease: "power2.out", clearProps: "opacity,visibility,transform",
          });
        }

        const avisos = nodo.matches?.('[role="alert"], [role="status"]')
          ? [nodo]
          : [...(nodo.querySelectorAll?.('[role="alert"], [role="status"]') ?? [])];
        const avisosIndependientes = avisos.filter((aviso) => !aviso.closest("article"));
        if (avisosIndependientes.length) {
          gsap.fromTo(avisosIndependientes, { autoAlpha: 0, y: 8 }, {
            autoAlpha: 1, y: 0, duration: 0.28, ease: "power2.out",
            clearProps: "opacity,visibility,transform",
          });
        }
      });
    }
  });
  observador.observe(raiz, {
    childList: true, subtree: true, attributes: true, attributeFilter: ["aria-pressed"],
  });

  return () => {
    observador.disconnect();
    quitarEventos.forEach((quitar) => quitar());
    gsap.killTweensOf([
      ...tarjetas, ...botones, ...enlacesMenu,
      ...raiz.querySelectorAll("input, textarea, select, details > *"),
    ]);
  };
}
