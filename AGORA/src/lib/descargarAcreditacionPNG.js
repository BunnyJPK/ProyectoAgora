const COLOR = {
  ciruela: "#39051f",
  coral: "#ff6b5f",
  hueso: "#fbefea",
  secundario: "#866e79",
};

function cargarImagen(src) {
  return new Promise((resolve, reject) => {
    const imagen = new Image();
    imagen.onload = () => resolve(imagen);
    imagen.onerror = reject;
    imagen.src = src;
  });
}

export default async function descargarAcreditacionPNG({ evento, acreditacion }) {
  if (!acreditacion?.qrDataUrl) {
    throw new Error("La acreditación no tiene código QR.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = 900;
  canvas.height = 1260;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo generar la imagen.");

  await document.fonts.ready;
  const qr = await cargarImagen(acreditacion.qrDataUrl);

  ctx.fillStyle = COLOR.hueso;
  ctx.fillRect(0, 0, 900, 1260);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.roundRect(45, 45, 810, 1170, 34);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(45, 45, 810, 255, [34, 34, 0, 0]);
  ctx.clip();
  ctx.fillStyle = COLOR.ciruela;
  ctx.fillRect(45, 45, 810, 255);
  ctx.restore();

  try {
    const logo = await cargarImagen("/brand/agora_logo_main.png");
    ctx.drawImage(logo, 92, 91, 310, 62);
  } catch {
    ctx.fillStyle = COLOR.hueso;
    ctx.font = "bold 56px Arial";
    ctx.fillText("ÁGORA", 92, 148);
  }

  ctx.fillStyle = "#f7b6b1";
  ctx.font = "bold 20px Arial";
  ctx.fillText("ACREDITACIÓN DE ASISTENTE", 92, 237);
  ctx.fillStyle = COLOR.coral;
  ctx.fillRect(45, 298, 810, 9);

  ctx.fillStyle = COLOR.secundario;
  ctx.font = "bold 20px Arial";
  ctx.fillText("NOMBRE DEL ASISTENTE", 92, 365);
  ctx.fillStyle = COLOR.ciruela;
  ctx.font = "bold 44px Arial";
  ctx.fillText(acreditacion.nombre, 92, 426, 700);

  ctx.fillStyle = COLOR.secundario;
  ctx.font = "bold 20px Arial";
  ctx.fillText("EVENTO", 92, 495);
  ctx.fillStyle = COLOR.ciruela;
  ctx.font = "bold 33px Arial";
  ctx.fillText(evento.nombre, 92, 544, 690);

  const fecha = new Date(`${evento.fecha}T12:00:00`).toLocaleDateString("es-MX", {
    day: "numeric", month: "long", year: "numeric",
  });
  ctx.fillStyle = COLOR.secundario;
  ctx.font = "25px Arial";
  ctx.fillText(`${fecha} · ${evento.hora} h`, 92, 603, 690);
  ctx.fillText(evento.sede, 92, 645, 690);

  ctx.fillStyle = "#fff";
  ctx.fillRect(294, 710, 312, 312);
  ctx.drawImage(qr, 304, 720, 292, 292);

  ctx.textAlign = "center";
  ctx.fillStyle = COLOR.secundario;
  ctx.font = "20px Arial";
  ctx.fillText("Presenta este código al ingresar al evento", 450, 1105);
  ctx.font = "18px Arial";
  ctx.fillText("Registro y acceso gestionados con ÁGORA", 450, 1160);

  const enlace = document.createElement("a");
  enlace.href = canvas.toDataURL("image/png");
  enlace.download = `acreditacion-${evento.slug}.png`;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
}
