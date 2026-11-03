// Genera una acreditación de demostración en PNG.
// Sin código QR ni validez para el control de acceso.

const COLOR = {
  ciruela: "#39051f",
  coral: "#ff6b5f",
  hueso: "#fbefea",
  textoSecundario: "#866e79",
};

// Se usa únicamente para descargar una muestra en PNG.
// No crea un QR ni genera credenciales válidas para un evento.
export default async function descargarMuestraPNG(evento) {
  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1260;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo preparar la imagen PNG.");

  await document.fonts.ready;

  ctx.fillStyle = COLOR.hueso;
  ctx.fillRect(0, 0, 900, 1260);

  // Tarjeta con bordes suaves.
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.roundRect(45, 45, 810, 1170, 34);
  ctx.fill();

  // Panel superior con el logo original de ÁGORA.
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(45, 45, 810, 255, [34, 34, 0, 0]);
  ctx.clip();
  ctx.fillStyle = COLOR.ciruela;
  ctx.fillRect(45, 45, 810, 255);
  ctx.restore();

  const logo = new Image();
  logo.src = "/brand/agora_logo_main.png";
  try {
    await new Promise((resolve, reject) => {
      if (logo.complete && logo.naturalWidth) return resolve();
      logo.onload = resolve;
      logo.onerror = reject;
    });
    ctx.drawImage(logo, 92, 91, 310, 62);
  } catch {
    // El nombre de la marca permanece visible si falla la carga del PNG.
    ctx.fillStyle = COLOR.hueso;
    ctx.font = "bold 56px Arial";
    ctx.fillText("ÁGORA", 92, 148);
  }

  ctx.fillStyle = "#f7b6b1";
  ctx.font = "bold 20px Arial";
  ctx.fillText("ACREDITACIÓN DE ASISTENTE", 92, 237);
  ctx.fillStyle = COLOR.coral;
  ctx.fillRect(45, 298, 810, 9);

  ctx.fillStyle = COLOR.textoSecundario;
  ctx.font = "bold 20px Arial";
  ctx.fillText("NOMBRE DEL ASISTENTE", 92, 365);
  ctx.fillStyle = COLOR.ciruela;
  ctx.font = "bold 44px Arial";
  ctx.fillText("Nombre del asistente", 92, 426);

  // Texto largo dividido en líneas para que no se salga del PNG.
  function escribirLineas(texto, x, y, maxAncho, altura, maxLineas = 2) {
    const palabras = texto.split(" ");
    const lineas = [];
    let linea = "";
    for (const palabra of palabras) {
      const prueba = linea ? `${linea} ${palabra}` : palabra;
      if (linea && ctx.measureText(prueba).width > maxAncho) {
        lineas.push(linea);
        linea = palabra;
      } else {
        linea = prueba;
      }
    }
    if (linea) lineas.push(linea);
    lineas.slice(0, maxLineas).forEach((parte, i) => ctx.fillText(parte, x, y + i * altura));
    return Math.min(lineas.length, maxLineas);
  }

  ctx.fillStyle = COLOR.textoSecundario;
  ctx.font = "bold 20px Arial";
  ctx.fillText("EVENTO", 92, 495);
  ctx.fillStyle = COLOR.ciruela;
  ctx.font = "bold 33px Arial";
  const numLineas = escribirLineas(evento.nombre, 92, 544, 690, 43);
  const espacio = (numLineas - 1) * 43;

  const fecha = new Date(`${evento.fecha}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
  });
  ctx.font = "25px Arial";
  ctx.fillStyle = COLOR.textoSecundario;
  ctx.fillText(`${fecha} · ${evento.hora} h`, 92, 602 + espacio);
  ctx.fillText(evento.sede, 92, 643 + espacio, 675);

  // Marcador explícito, NO un código QR funcional.
  const qrY = 704 + espacio;
  ctx.strokeStyle = "#e6d6de";
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 9]);
  ctx.strokeRect(302, qrY, 296, 296);
  ctx.setLineDash([]);
  ctx.fillStyle = COLOR.ciruela;
  ctx.font = "bold 59px Arial";
  ctx.textAlign = "center";
  ctx.fillText("QR", 450, qrY + 145);
  ctx.font = "bold 23px Arial";
  ctx.fillText("PENDIENTE", 450, qrY + 191);
  ctx.textAlign = "start";

  ctx.fillStyle = "#b42333";
  ctx.font = "bold 31px Arial";
  ctx.textAlign = "center";
  ctx.fillText("MUESTRA · NO VÁLIDA", 450, 1082);
  ctx.fillStyle = COLOR.textoSecundario;
  ctx.font = "20px Arial";
  ctx.fillText("No permite ingresar al evento", 450, 1124);
  ctx.font = "18px Arial";
  ctx.fillText("Registro y acceso gestionados con ÁGORA", 450, 1170);
  ctx.textAlign = "start";

  const enlace = document.createElement("a");
  enlace.href = canvas.toDataURL("image/png");
  enlace.download = `agora-acreditacion-MUESTRA-${evento.slug}.png`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
}

