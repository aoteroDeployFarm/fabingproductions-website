import ServiceDetail from '../../components/ServiceDetail'
import { SERVICE_PAGES } from '../../data/services'

export default function PodcastPage() {
  return <ServiceDetail config={SERVICE_PAGES.podcast} />
}
