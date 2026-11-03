import { notFound } from "next/navigation";
import EventOverview from "../../../../components/eventos/EventOverview";
import { buscarEvento } from "../../../../lib/datos";

export default async function PanelEventoPage({ params }) {
  const { id } = await params;
  const evento = buscarEvento(id);

  if (!evento) notFound();

  return <EventOverview evento={evento} />;
}
