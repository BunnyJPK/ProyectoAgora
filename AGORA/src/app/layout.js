import "./globals.css";

export const metadata = {
  title: "ÁGORA | Software para eventos",
  description: "Registro y control de acceso para eventos",
  manifest: "/manifest.json",
  icons: {
    icon: "/brand/agora_icon.png",
    apple: "/icons/apple-touch-icon.png",
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
