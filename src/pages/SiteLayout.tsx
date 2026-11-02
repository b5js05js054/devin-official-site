import { Outlet, useLocation } from 'react-router-dom'
import { Footer } from '../components/Footer'
import { Nav } from '../components/Nav'

export function SiteLayout() {
  const section = useLocation().pathname.split('/')[1] || 'home'

  return (
    <div className="min-h-svh bg-paper text-ink">
      <Nav />
      <main key={section} className="page-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
