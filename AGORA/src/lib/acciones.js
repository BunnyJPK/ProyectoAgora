// Contratos de operaciones que deberá conectar la capa de datos.
export async function iniciarSesion() {
  throw new Error("No se pudo iniciar sesión.");
}

export async function guardarEvento() {
  throw new Error("No se pudo crear el evento.");
}

export async function registrarAsistente() {
  throw new Error("No se pudo completar el registro.");
}

export async function cerrarSesion() {
  throw new Error("No se pudo cerrar sesión.");
}
