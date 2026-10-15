import { Navigate, Route, Routes } from 'react-router-dom'
import { ContentProvider } from './lib/content'
import { AdminLayout } from './pages/admin/AdminLayout'
import { DocsEditor } from './pages/admin/DocsEditor'
import { DownloadsEditor } from './pages/admin/DownloadsEditor'
import { HomeEditor } from './pages/admin/HomeEditor'
import { AdminLogin } from './pages/admin/Login'
import { NoticeEditor } from './pages/admin/NoticeEditor'
import { PlansEditor } from './pages/admin/PlansEditor'
import { RatesEditor } from './pages/admin/RatesEditor'
import { Downloads } from './pages/Downloads'
import { Guide } from './pages/Guide'
import { Home } from './pages/Home'
import { Pricing } from './pages/Pricing'
import { SiteLayout } from './pages/SiteLayout'

export default function App() {
  return (
    <ContentProvider>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/guide/:slug" element={<Guide />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<HomeEditor />} />
          <Route path="notice" element={<NoticeEditor />} />
          <Route path="plans" element={<PlansEditor />} />
          <Route path="rates" element={<RatesEditor />} />
          <Route path="downloads" element={<DownloadsEditor />} />
          <Route path="docs" element={<DocsEditor />} />
        </Route>
      </Routes>
    </ContentProvider>
  )
}
