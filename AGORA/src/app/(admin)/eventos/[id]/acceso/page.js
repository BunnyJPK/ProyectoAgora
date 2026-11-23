import { notFound } from "next/navigation";
import CheckInPanel from "../../../../../components/eventos/CheckInPanel";
import { buscarMiEvento } from "../../../../../actions/eventos";

export default async function AccesoPage({ params }) {
  const { id } = await params;
  const evento = await buscarMiEvento(id);

  if (!evento) notFound();

  return <CheckInPanel evento={evento} />;
}
