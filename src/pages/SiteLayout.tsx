import { Outlet } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'

export function SiteLayout() {
  return (
    <div className="min-h-svh bg-paper text-ink">
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
