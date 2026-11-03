const variantes = {
  success: {
    icono: "icon-ok-circled",
    colores: "border-green-200 bg-green-50 text-green-900",
    iconoColor: "text-green-700",
  },
  warning: {
    icono: "icon-attention",
    colores: "border-amber-200 bg-amber-50 text-amber-900",
    iconoColor: "text-amber-700",
  },
  error: {
    icono: "icon-cancel-circled",
    colores: "border-red-200 bg-red-50 text-red-900",
    iconoColor: "text-red-700",
  },
  info: {
    icono: "icon-info-circled-1",
    colores: "border-[#e9dfe4] bg-[#faf6f8] text-ciruela",
    iconoColor: "text-[#946979]",
  },
};

export default function AlertMessage({ variant = "info", title, children }) {
  const estilo = variantes[variant] ?? variantes.info;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-[16px] border px-4 py-4 sm:px-5 ${estilo.colores}`}
    >
      <i className={`${estilo.icono} mt-0.5 shrink-0 text-xl ${estilo.iconoColor}`} aria-hidden="true" />
      <div className="min-w-0">
        {title && <p className="text-sm font-bold">{title}</p>}
        <div className="mt-1 text-[13px] leading-6">{children}</div>
      </div>
    </div>
  );
}
