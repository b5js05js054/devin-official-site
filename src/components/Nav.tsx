import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useContent } from '../lib/content'
import { Logo } from './Logo'

const links = [
  { to: '/', label: '首页' },
  { to: '/pricing', label: '计费' },
  { to: '/downloads', label: '下载中心' },
  { to: '/guide', label: '使用指南' },
]

export function Nav() {
  const { notice } = useContent()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      {notice.enabled && notice.text ? (
        <div className="bg-volt text-center text-[13px] text-white">
          {notice.href ? (
            <Link to={notice.href} className="block px-4 py-2 text-white no-underline hover:underline">
              {notice.text}
              <span className="ml-2 font-medium underline underline-offset-2">查看</span>
            </Link>
          ) : (
            <p className="px-4 py-2">{notice.text}</p>
          )}
        </div>
      ) : null}
      <div className="border-b border-line bg-paper/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-mute md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `no-underline transition ${isActive ? 'text-ink' : 'text-mute hover:text-ink'}`
                }
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              to="/guide/getting-started"
              className="rounded-full bg-volt px-4 py-1.5 text-sm font-medium text-white no-underline"
            >
              开始使用
            </Link>
          </div>
          <button
            type="button"
            className="md:hidden text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="菜单"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        {open ? (
          <div className="border-t border-line px-5 py-4 md:hidden">
            <div className="flex flex-col gap-3 text-sm">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  className="text-ink no-underline"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/guide/getting-started" className="text-ink no-underline" onClick={() => setOpen(false)}>
                开始使用
              </NavLink>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  )
}
