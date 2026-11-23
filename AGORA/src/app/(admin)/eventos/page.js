import { listarMisEventos } from "../../../actions/eventos";
import EventList from "../../../components/eventos/EventList";

export default async function MisEventosPage() {
  const eventos = await listarMisEventos();
  return <EventList eventos={eventos} />;
}
