import "./globals.css";

export const metadata = {
  title: "ÁGORA | Software para eventos",
  description: "Registro y control de acceso para eventos",
  icons: {
    icon: "/brand/agora_icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="/fontello/css/fontello.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
