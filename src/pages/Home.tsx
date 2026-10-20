import { ArrowRight, Check, Download, Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClientMock } from '../components/ClientMock'
import { StatBar } from '../components/StatBar'
import { useContent } from '../lib/content'

export function Home() {
  const { home } = useContent()
  const [cap, setCap] = useState(home.capabilities[0]?.id ?? 'connect')
  const current = home.capabilities.find((c) => c.id === cap) ?? home.capabilities[0]
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      <section className="grid-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 pt-20 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-flare" />
              {home.kicker}
            </p>
            <h1 className="mt-6 font-display text-[2.6rem] leading-[1.1] text-balance md:text-7xl">
              {home.headline}
              <span className="mt-1 block text-volt">{home.highlight}</span>
            </h1>
          </div>
          <div>
            <p className="text-base leading-7 text-mute">{home.sub}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/downloads"
                className="inline-flex items-center gap-2 rounded-full bg-volt px-5 py-2.5 text-sm font-medium text-white no-underline shadow-[0_8px_24px_-8px_rgb(36_70_255/0.6)] transition hover:-translate-y-px hover:bg-[#1a38e0]"
              >
                <Download size={16} />
                {home.ctaPrimary}
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-ink no-underline hover:border-ink/30"
              >
                {home.ctaSecondary}
                <ArrowRight size={16} />
              </Link>
            </div>
            <p className="mt-4 text-xs text-mute">Windows 与 macOS 客户端。拦截的是 Devin。</p>
          </div>
        </div>
        <div className="px-5 pb-16">
          <ClientMock />
        </div>
      </section>

      <StatBar stats={home.stats} />

      <section className="mx-auto max-w-6xl px-5 py-20">
        <h2 className="max-w-2xl font-display text-3xl text-balance md:text-5xl">
          不改变你的编辑器，只把后台过程说清楚
        </h2>
        <div className="mt-12 grid gap-8 lg:grid-cols-[220px_1fr]">
          <div className="flex gap-2 overflow-x-auto lg:flex-col">
            {home.capabilities.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCap(c.id)}
                className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm transition ${
                  cap === c.id ? 'bg-ink font-medium text-paper' : 'text-mute hover:bg-sunk hover:text-ink'
                }`}
              >
                {c.id === 'connect' ? '本地拦截' : c.id === 'usage' ? '卡密结算' : '目录计价'}
              </button>
            ))}
          </div>
          {current ? (
            <div className="rounded-3xl border border-line bg-surface p-8">
              <h3 className="font-display text-3xl">{current.title}</h3>
              <p className="mt-4 max-w-xl text-sm leading-7 text-mute">{current.desc}</p>
              <ul className="mt-6 space-y-2 text-sm text-ink">
                {current.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-volt" />
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
          <h2 className="font-display text-3xl md:text-4xl">使用前，你可能想确认这些</h2>
          <div className="mt-10 divide-y divide-line border-y border-line">
            {home.faqs.map((item, i) => (
              <button
                key={item.q}
                type="button"
                aria-expanded={openFaq === i}
                className="block w-full py-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              >
                <span className="flex items-center justify-between gap-4 font-medium text-ink">
                  {item.q}
                  <Plus
                    size={18}
                    className={`shrink-0 text-mute transition-transform ${openFaq === i ? 'rotate-45 text-volt' : ''}`}
                  />
                </span>
                {openFaq === i ? <p className="mt-3 text-sm leading-7 text-mute">{item.a}</p> : null}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 overflow-hidden rounded-[28px] bg-volt px-8 py-14 text-white md:flex-row md:items-end md:px-12">
          <div className="relative">
            <h2 className="font-display text-3xl text-balance md:text-5xl">{home.downloadTitle}</h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/80">{home.downloadSub}</p>
          </div>
          <Link
            to="/downloads"
            className="relative inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-volt no-underline transition hover:-translate-y-px"
          >
            打开下载中心
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
