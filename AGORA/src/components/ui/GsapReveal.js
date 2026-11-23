"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import activarInteracciones from "./gsapInteracciones";

gsap.registerPlugin(useGSAP);

export default function GsapReveal({ children, className = "", delay = 0 }) {
  const contenedor = useRef(null);
  const ruta = usePathname();

  useGSAP(
    () => {
      const raiz = contenedor.current;
      if (!raiz) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        // ENTRADA DE PÁGINAS Y CONTENIDO
        const animacion = gsap.timeline({ delay, defaults: { ease: "power3.out" } });
        animacion.fromTo(
          raiz,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            clearProps: "opacity,visibility,transform",
          }
        );

        const titulo = raiz.querySelector("h1");
        if (titulo) {
          animacion.fromTo(
            titulo,
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.55, clearProps: "opacity,visibility,transform" },
            0.16
          );
        }

        const tarjetas = [...raiz.querySelectorAll("article")].slice(0, 8);
        const formularios = [...raiz.querySelectorAll("form")]
          .filter((formulario) => !formulario.closest("article"))
          .slice(0, 2);
        const bloques = tarjetas.length ? tarjetas : formularios;

        if (bloques.length) {
          animacion.fromTo(
            bloques,
            { autoAlpha: 0, y: 20, scale: 0.985 },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.62,
              stagger: 0.09,
              clearProps: "opacity,visibility,transform",
            },
            0.25
          );
        }

        const limpiarInteracciones = activarInteracciones(raiz);

        return () => {
          limpiarInteracciones();
          animacion.kill();
        };
      });

      return () => media.revert();
    },
    { scope: contenedor, dependencies: [ruta, delay], revertOnUpdate: true }
  );

  return (
    <div ref={contenedor} data-agora-gsap="reveal" className={`gsap-reveal ${className}`}>
      {children}
    </div>
  );
}
