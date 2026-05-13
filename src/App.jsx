import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

// ── Top-level pages ───────────────────────────────────────────────────────────
const Home            = lazy(() => import('./pages/Home'))
const StudioFullPage  = lazy(() => import('./pages/StudioFullPage'))
const WorkPage        = lazy(() => import('./pages/WorkPage'))
const BookPage        = lazy(() => import('./pages/BookPage'))

// ── /services/* sub-pages ─────────────────────────────────────────────────────
const ServiceStudio   = lazy(() => import('./pages/services/StudioPage'))
const ServicePodcast  = lazy(() => import('./pages/services/PodcastPage'))
const ServiceEvents   = lazy(() => import('./pages/services/EventsPage'))
const ServiceVideo    = lazy(() => import('./pages/services/VideoPage'))

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="w-8 h-8 border-2 border-zinc-700 border-t-gold-500 rounded-full animate-spin" />
    </div>
  )
}

function Page({ children }) {
  return <Suspense fallback={<Spinner />}>{children}</Suspense>
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Top-level nav routes
      { index: true,            element: <Page><Home /></Page> },
      { path: 'studio',         element: <Page><StudioFullPage /></Page> },
      { path: 'work',           element: <Page><WorkPage /></Page> },
      { path: 'book',           element: <Page><BookPage /></Page> },

      // Service deep-dive routes
      { path: 'services/studio',  element: <Page><ServiceStudio /></Page> },
      { path: 'services/podcast', element: <Page><ServicePodcast /></Page> },
      { path: 'services/events',  element: <Page><ServiceEvents /></Page> },
      { path: 'services/video',   element: <Page><ServiceVideo /></Page> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
