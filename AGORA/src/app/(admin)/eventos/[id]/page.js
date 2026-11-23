import { notFound } from "next/navigation";
import EventOverview from "../../../../components/eventos/EventOverview";
import { buscarMiEvento } from "../../../../actions/eventos";

export default async function PanelEventoPage({ params }) {
  const { id } = await params;
  const evento = await buscarMiEvento(id);

  if (!evento) notFound();

  return <EventOverview evento={evento} />;
}
