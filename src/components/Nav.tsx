import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useContent } from '../lib/content'
import { ComingSoon } from './ComingSoon'
import { Logo } from './Logo'

const links = [
  { to: '/', label: '首页' },
  { to: '/pricing', label: '计费' },
  { to: '/downloads', label: '下载中心' },
  { to: '/guide', label: '使用指南' },
]

export function Nav() {
  const { notice } = useContent()
  const [soon, setSoon] = useState('')
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      {notice.enabled && notice.text ? (
        <div className="bg-ink-3/90 text-center text-[13px] text-petal">
          {notice.href ? (
            <Link to={notice.href} className="block px-4 py-2 text-petal no-underline hover:text-mint">
              {notice.text}
              <span className="ml-2 text-gold">查看</span>
            </Link>
          ) : (
            <p className="px-4 py-2">{notice.text}</p>
          )}
        </div>
      ) : null}
      <div className="border-b border-line bg-ink/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-mute md:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `no-underline transition ${isActive ? 'text-petal' : 'text-mute hover:text-petal'}`
                }
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="rounded-full px-3 py-1.5 text-sm text-mute hover:text-petal"
              onClick={() => setSoon('登录')}
            >
              登录
            </button>
            <button
              type="button"
              className="rounded-full bg-leaf px-4 py-1.5 text-sm font-medium text-petal"
              onClick={() => setSoon('注册')}
            >
              注册
            </button>
          </div>
          <button
            type="button"
            className="md:hidden text-petal"
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
                  className="text-petal no-underline"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </NavLink>
              ))}
              <button type="button" className="text-left text-mute" onClick={() => setSoon('登录')}>
                登录
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <ComingSoon open={Boolean(soon)} title={soon} onClose={() => setSoon('')} />
    </header>
  )
}
