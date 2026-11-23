import GsapReveal from "../ui/GsapReveal";

export default function AuthLayout({ children }) {
  return (
    <main className="grid min-h-svh grid-rows-[auto_1fr] bg-hueso text-ciruela lg:grid-cols-[55%_45%] lg:grid-rows-1">
      <section className="flex items-center justify-center bg-ciruela px-6 py-7 text-white lg:justify-start lg:rounded-r-[90px] lg:px-[clamp(45px,8vw,135px)] lg:py-[70px]">
        <GsapReveal className="w-full max-w-[490px]" delay={0.04}>
          <img
            src="/brand/agora_logo_main.png"
            alt="ÁGORA"
            className="mx-auto block w-[170px] lg:mx-0 lg:w-[245px]"
          />
          <h2 className="mt-[66px] mb-6 hidden font-display text-[clamp(30px,3.35vw,46px)] leading-[1.34] font-extrabold lg:block">
            REGISTRA.<br />
            ACREDITA.<br />
            DA ACCESO.
          </h2>
          <p className="hidden max-w-[420px] text-base leading-[1.75] text-[#f5e7eb] lg:block">
            Un flujo sencillo de registro, check-in y operación sin conexión.
          </p>
        </GsapReveal>
      </section>
      <section className="flex items-start justify-center px-6 pt-11 pb-16 sm:px-8 sm:pt-14 lg:items-center lg:px-11 lg:py-[60px]">
        <GsapReveal className="w-full max-w-[390px]" delay={0.1}>
          {children}
        </GsapReveal>
      </section>
    </main>
  );
}
