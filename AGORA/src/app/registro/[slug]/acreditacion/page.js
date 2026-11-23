import { notFound } from "next/navigation";
import Acreditacion from "../../../../components/registro/Acreditacion";
import { buscarAcreditacionPublica } from "../../../../actions/registros";

export default async function AcreditacionPage({ params }) {
  const { slug } = await params;
  const datos = await buscarAcreditacionPublica(slug);

  if (!datos) notFound();

  return <Acreditacion evento={datos.evento} acreditacion={datos.acreditacion} />;
}
