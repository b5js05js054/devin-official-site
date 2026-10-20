import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Logo } from '../../components/Logo'
import { api } from '../../lib/api'

const items = [
  { to: '/admin/home', label: '首页文案' },
  { to: '/admin/notice', label: '顶栏公告' },
  { to: '/admin/plans', label: '计费方式' },
  { to: '/admin/rates', label: '模型倍率' },
  { to: '/admin/downloads', label: '下载' },
  { to: '/admin/docs', label: '文档' },
]

export function AdminLayout() {
  const nav = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api<{ user: string }>('/api/admin/me')
      .then(() => setReady(true))
      .catch(() => nav('/admin/login'))
  }, [nav])

  if (!ready) {
    return <div className="min-h-svh bg-paper p-10 text-mute">校验登录…</div>
  }

  async function logout() {
    await api('/api/admin/logout', { method: 'POST' })
    nav('/admin/login')
  }

  return (
    <div className="min-h-svh bg-paper text-ink">
      <div className="flex min-h-svh">
        <aside className="hidden w-56 shrink-0 border-r border-line p-5 md:block">
          <Logo to="/admin/home" compact />
          <nav className="mt-8 flex flex-col gap-1 text-sm">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 no-underline ${isActive ? 'bg-volt/10 font-medium text-volt' : 'text-mute hover:text-ink'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <button type="button" onClick={logout} className="mt-10 text-xs text-mute hover:text-ink">
            退出
          </button>
        </aside>
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-line px-5 py-3 md:hidden">
            <Logo to="/admin/home" compact />
            <button type="button" onClick={logout} className="text-xs text-mute">
              退出
            </button>
          </header>
          <nav className="flex gap-3 overflow-x-auto border-b border-line px-5 py-3 text-sm md:hidden">
            {items.map((item) => (
              <NavLink key={item.to} to={item.to} className="shrink-0 text-mute no-underline">
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="p-5 md:p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SaveBar({
  message,
  error,
  pending,
  onSave,
}: {
  message: string
  error: string
  pending: boolean
  onSave: () => void
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onSave}
        disabled={pending}
        className="rounded-full bg-volt px-5 py-2 text-sm text-white disabled:opacity-60"
      >
        {pending ? '保存中…' : '保存并发布'}
      </button>
      {message ? <span className="text-sm text-volt">{message}</span> : null}
      {error ? <span className="text-sm text-flare">{error}</span> : null}
    </div>
  )
}
