import ServiceDetail from '../../components/ServiceDetail'
import { SERVICE_PAGES } from '../../data/services'

export default function EventsPage() {
  return <ServiceDetail config={SERVICE_PAGES.events} />
}
