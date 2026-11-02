import { Menu, X } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
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
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const linkRefs = useRef<Array<HTMLAnchorElement | null>>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0, on: false })

  useLayoutEffect(() => {
    const nav = navRef.current
    if (!nav) return
    const place = () => {
      const active = linkRefs.current.find((el) => el?.getAttribute('aria-current') === 'page')
      if (!active) return
      const navBox = nav.getBoundingClientRect()
      const box = active.getBoundingClientRect()
      setIndicator((prev) => ({ left: box.left - navBox.left, width: box.width, on: prev.on }))
      requestAnimationFrame(() => setIndicator((prev) => ({ ...prev, on: true })))
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [pathname])

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
          <nav ref={navRef} className="relative hidden items-center gap-1 text-sm md:flex">
            <span
              aria-hidden
              className={`nav-indicator ${indicator.on ? 'is-on' : ''}`}
              style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
            />
            {links.map((l, index) => (
              <NavLink
                key={l.to}
                to={l.to}
                ref={(node) => {
                  linkRefs.current[index] = node
                }}
                className={({ isActive }) =>
                  `relative z-10 rounded-full px-3 py-1.5 no-underline transition-colors duration-500 ${
                    isActive ? 'text-volt' : 'text-mute hover:text-ink'
                  }`
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
                  end={l.to === '/'}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 no-underline ${isActive ? 'bg-volt/10 text-volt' : 'text-ink'}`
                  }
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
