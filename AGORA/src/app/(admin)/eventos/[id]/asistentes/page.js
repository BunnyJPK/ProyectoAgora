import { notFound } from "next/navigation";
import AttendeeList from "../../../../../components/eventos/AttendeeList";
import { buscarEvento, listarAsistentes } from "../../../../../lib/datos";

export default async function AsistentesPage({ params }) {
  const { id } = await params;
  const evento = buscarEvento(id);

  if (!evento) notFound();

  const asistentes = listarAsistentes(id);

  return <AttendeeList evento={evento} asistentes={asistentes} />;
}
