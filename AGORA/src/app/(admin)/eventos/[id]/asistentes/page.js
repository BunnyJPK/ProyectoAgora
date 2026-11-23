import { notFound } from "next/navigation";
import AttendeeList from "../../../../../components/eventos/AttendeeList";
import { buscarMiEvento } from "../../../../../actions/eventos";
import { listarAsistentesDelEvento } from "../../../../../actions/registros";

export default async function AsistentesPage({ params }) {
  const { id } = await params;
  const evento = await buscarMiEvento(id);

  if (!evento) notFound();

  const asistentes = await listarAsistentesDelEvento(id);

  return <AttendeeList evento={evento} asistentes={asistentes} />;
}
