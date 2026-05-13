import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'

const Home        = lazy(() => import('./pages/Home'))
const StudioPage  = lazy(() => import('./pages/services/StudioPage'))
const PodcastPage = lazy(() => import('./pages/services/PodcastPage'))
const EventsPage  = lazy(() => import('./pages/services/EventsPage'))
const VideoPage   = lazy(() => import('./pages/services/VideoPage'))

function PageShell({ children }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-gold-500 rounded-full animate-spin" />
        </div>
      }
    >
      {children}
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true,              element: <PageShell><Home /></PageShell> },
      { path: 'services/studio',  element: <PageShell><StudioPage /></PageShell> },
      { path: 'services/podcast', element: <PageShell><PodcastPage /></PageShell> },
      { path: 'services/events',  element: <PageShell><EventsPage /></PageShell> },
      { path: 'services/video',   element: <PageShell><VideoPage /></PageShell> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
