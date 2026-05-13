import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import StudioSection from './components/StudioSection'
import WorkGallery from './components/WorkGallery'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import './index.css'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <StudioSection />
        <WorkGallery />
        <ContactForm />
      </main>
      <Footer />
    </>
  )
}
