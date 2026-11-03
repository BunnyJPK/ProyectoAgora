import Link from "next/link";

export default function MobileHeader({ abrirMenu, menuAbierto }) {
  return (
    <header className="relative flex h-[72px] items-center justify-center bg-ciruela px-6 lg:hidden">
      <button
        type="button"
        onClick={abrirMenu}
        aria-label="Abrir menú"
        aria-expanded={menuAbierto}
        aria-controls="menu-lateral"
        className="absolute left-5 grid h-10 w-10 cursor-pointer place-items-center text-xl text-white"
      >
        <i className="icon-menu" aria-hidden="true" />
      </button>
      <Link href="/eventos" aria-label="Ir a Mis eventos">
        <img src="/brand/agora_logo_main.png" alt="ÁGORA" className="block w-[126px]" />
      </Link>
    </header>
  );
}
