import { notFound } from "next/navigation";
import OfflinePanel from "../../../../../components/eventos/OfflinePanel";
import { buscarMiEvento } from "../../../../../actions/eventos";

export default async function OfflinePage({ params }) {
  const { id } = await params;
  const evento = await buscarMiEvento(id);

  if (!evento) notFound();

  return <OfflinePanel evento={evento} />;
}
