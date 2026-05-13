import { Helmet } from 'react-helmet-async'
import Hero from '../components/Hero'
import Services from '../components/Services'
import StudioSection from '../components/StudioSection'
import WorkGallery from '../components/WorkGallery'
import ContactForm from '../components/ContactForm'

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Fabing Productions | Recording Studio, Podcast, Live Events & Video</title>
        <meta
          name="description"
          content="Fabing Productions — full-service production house offering professional recording studio sessions, podcast production, live event coordination, and cinematic video."
        />
      </Helmet>

      <Hero />
      <Services />
      <StudioSection />
      <WorkGallery />
      <ContactForm />
    </>
  )
}
