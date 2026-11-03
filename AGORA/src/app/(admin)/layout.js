"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "../../components/layout/Sidebar";
import MobileHeader from "../../components/layout/MobileHeader";

export default function AdminLayout({ children }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ruta = usePathname();

  return (
    <div className="min-h-svh bg-hueso text-ciruela lg:flex">
      <MobileHeader
        abrirMenu={() => setMenuAbierto(true)}
        menuAbierto={menuAbierto}
      />

      {menuAbierto && (
        <button
          type="button"
          onClick={() => setMenuAbierto(false)}
          aria-label="Cerrar menú"
          className="fixed inset-0 z-40 cursor-pointer bg-black/55 lg:hidden"
        />
      )}

      <Sidebar
        menuAbierto={menuAbierto}
        cerrarMenu={() => setMenuAbierto(false)}
        ruta={ruta}
      />

      <main className="min-w-0 flex-1 px-5 pt-10 pb-16 sm:px-7 sm:pt-12 lg:px-[clamp(32px,6.25vw,90px)] lg:pt-[77px] lg:pb-[90px]">
        {children}
      </main>
    </div>
  );
}
