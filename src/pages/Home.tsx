import { ArrowRight, Download } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClientMock } from '../components/ClientMock'
import { ComingSoon } from '../components/ComingSoon'
import { StatBar } from '../components/StatBar'
import { useContent } from '../lib/content'

export function Home() {
  const { home } = useContent()
  const [soon, setSoon] = useState(false)
  const [cap, setCap] = useState(home.capabilities[0]?.id ?? 'connect')
  const current = home.capabilities.find((c) => c.id === cap) ?? home.capabilities[0]
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      <section className="grain">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="font-mono text-xs tracking-[0.16em] text-gold">— {home.kicker}</p>
            <h1 className="mt-5 font-display text-4xl leading-[1.2] text-balance md:text-6xl">
              {home.headline}
              <span className="block text-mint">{home.highlight}</span>
            </h1>
          </div>
          <div>
            <p className="text-[15px] leading-7 text-mute">{home.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSoon(true)}
                className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm font-medium text-petal"
              >
                <Download size={16} />
                {home.ctaPrimary}
              </button>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-petal no-underline hover:bg-ink-3"
              >
                {home.ctaSecondary}
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-4 font-mono text-[11px] text-mute">Windows 10 / 11 · macOS</p>
          </div>
        </div>
        <div className="px-5 pb-16">
          <ClientMock />
        </div>
      </section>

      <StatBar stats={home.stats} />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">为什么选择 Devin hub</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl md:text-5xl">
          不改变你的编辑器，只把后台过程说清楚
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-2">
            {home.capabilities.map((c, i) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCap(c.id)}
                className={`rounded-xl px-4 py-3 text-left text-sm ${
                  cap === c.id ? 'bg-petal text-ink' : 'text-mute hover:text-petal'
                }`}
              >
                <span className="mr-2 font-mono text-[11px]">{String(i + 1).padStart(2, '0')}</span>
                {c.id === 'connect' ? '稳定连接' : c.id === 'usage' ? '透明用量' : '统一管理'}
              </button>
            ))}
          </div>
          {current ? (
            <div className="rounded-3xl border border-line bg-ink-2 p-8">
              <p className="font-mono text-xs text-gold">
                {String(home.capabilities.findIndex((c) => c.id === current.id) + 1).padStart(2, '0')} ·{' '}
                {current.id}
              </p>
              <h3 className="mt-3 font-display text-3xl">{current.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-mute">{current.desc}</p>
              <ul className="mt-6 space-y-2 text-sm text-petal">
                {current.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-mint">✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">常见问题</p>
          <h2 className="mt-3 font-display text-3xl md:text-4xl">使用前，你可能想确认这些</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {home.faqs.map((item, i) => (
              <button
                key={item.q}
                type="button"
                className="block w-full py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <span className="flex items-center justify-between gap-4 text-petal">
                  <span>
                    <span className="mr-3 font-mono text-xs text-gold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {item.q}
                  </span>
                  <span className="text-mute">{openFaq === i ? '–' : '+'}</span>
                </span>
                {openFaq === i ? <p className="mt-3 pl-8 text-sm leading-7 text-mute">{item.a}</p> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink-2">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-16 md:flex-row md:items-end">
          <div>
            <h2 className="font-display text-3xl md:text-5xl">{home.downloadTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-mute">{home.downloadSub}</p>
          </div>
          <Link
            to="/downloads"
            className="inline-flex items-center gap-2 rounded-full bg-leaf px-5 py-2.5 text-sm text-petal no-underline"
          >
            打开下载中心
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
      <ComingSoon open={soon} title="下载客户端" onClose={() => setSoon(false)} />
    </div>
  )
}
