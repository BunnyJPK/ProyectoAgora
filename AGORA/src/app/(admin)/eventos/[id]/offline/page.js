import { notFound } from "next/navigation";
import OfflinePanel from "../../../../../components/eventos/OfflinePanel";
import { buscarEvento } from "../../../../../lib/datos";

export default async function OfflinePage({ params }) {
  const { id } = await params;
  const evento = buscarEvento(id);

  if (!evento) notFound();

  return <OfflinePanel evento={evento} />;
}
