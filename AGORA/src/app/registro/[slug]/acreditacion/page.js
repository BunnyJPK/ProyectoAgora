import { notFound } from "next/navigation";
import Acreditacion from "../../../../components/registro/Acreditacion";
import { buscarEventoPorSlug, buscarAcreditacion } from "../../../../lib/datos";

export default async function AcreditacionPage({ params, searchParams }) {
  const { slug } = await params;
  const { registro } = await searchParams;
  const evento = buscarEventoPorSlug(slug);

  if (!evento) notFound();

  return <Acreditacion evento={evento} acreditacion={buscarAcreditacion(evento.id, registro)} />;
}
