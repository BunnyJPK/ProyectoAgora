import { notFound } from "next/navigation";
import CheckInPanel from "../../../../../components/eventos/CheckInPanel";
import { buscarEvento } from "../../../../../lib/datos";

export default async function AccesoPage({ params }) {
  const { id } = await params;
  const evento = buscarEvento(id);

  if (!evento) notFound();

  return <CheckInPanel evento={evento} />;
}
