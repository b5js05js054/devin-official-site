import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

type CatalogModel = {
  id: string
  label?: string
  free?: boolean
  ratio?: number
  price_in?: number | null
  price_out?: number | null
  price_cache?: number | null
  price_cache_write?: number | null
  category_name?: string
  category_multiplier?: number
  context_window?: number | null
  max_output?: number | null
  supports_thinking?: boolean
  reasoning_efforts?: string[] | null
  context_options?: Array<number | string> | null
}

const SERIES: Array<[string, string[]]> = [
  ['Claude', ['claude']],
  ['DeepSeek', ['deepseek']],
  ['Kimi', ['kimi']],
  ['MiMo', ['mimo']],
  ['Zhipu', ['glm', 'zhipu']],
  ['MiniMax', ['minimax']],
  ['Qwen', ['qwen']],
  ['Doubao', ['doubao']],
  ['Hunyuan', ['hy']],
]

const ICONS: Array<[string, string]> = [
  ['claude', 'claude'],
  ['deepseek', 'deepseek'],
  ['glm', 'zhipu'],
  ['kimi', 'kimi'],
  ['mimo', 'mimo'],
  ['minimax', 'minimax'],
  ['qwen', 'qwen'],
  ['doubao', 'doubao'],
  ['hy', 'hunyuan'],
]

const SERIES_ICON: Record<string, string> = {
  Claude: 'claude',
  DeepSeek: 'deepseek',
  Kimi: 'kimi',
  MiMo: 'mimo',
  Zhipu: 'zhipu',
  MiniMax: 'minimax',
  Qwen: 'qwen',
  Doubao: 'doubao',
  Hunyuan: 'hunyuan',
}

const PRICE_LABELS = ['输入', '输出', '缓存读', '缓存写'] as const

function seriesOf(id: string) {
  const name = id.toLowerCase()
  return SERIES.find(([, prefixes]) => prefixes.some((prefix) => name.startsWith(prefix)))?.[0] || '其他'
}

function iconOf(id: string) {
  const name = id.toLowerCase()
  return ICONS.find(([prefix]) => name.startsWith(prefix))?.[1] || ''
}

function priceText(value: number | null | undefined) {
  return `$${Number(value || 0)
    .toFixed(4)
    .replace(/0+$/, '')
    .replace(/\.$/, '')}`
}

function formatTok(value: number | string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return String(value)
  if (n >= 1e6 && n % 1e5 === 0) return `${n / 1e6}M`
  if (n >= 1000 && n % 1000 === 0) return `${n / 1000}K`
  return String(n)
}

function chipOf(model: CatalogModel) {
  if (model.free) return '免费'
  const name = String(model.category_name || '').trim()
  const mult = Number(model.category_multiplier)
  if (name && mult > 0) return `${name} ×${Number(mult.toFixed(4))}`
  return Number(model.ratio) > 0 ? `×${Number(Number(model.ratio).toFixed(4))}` : '收费'
}

function listPrice(value: number | null | undefined, multiplier: number) {
  const current = Number(value) || 0
  if (!(multiplier > 0)) return current
  return Math.round((current / multiplier) * 1e6) / 1e6
}

type CardMotion = { x: number; y: number; tx: number; ty: number; raf: number }

const cardMotion = new WeakMap<HTMLElement, CardMotion>()

function followCard(card: HTMLElement) {
  const motion = cardMotion.get(card)
  if (!motion || !card.isConnected) return
  motion.x += (motion.tx - motion.x) * 0.12
  motion.y += (motion.ty - motion.y) * 0.12
  card.style.setProperty('--px', `${motion.x * 100}%`)
  card.style.setProperty('--py', `${motion.y * 100}%`)
  card.style.setProperty('--rx', `${(0.5 - motion.y) * 4.5}deg`)
  card.style.setProperty('--ry', `${(motion.x - 0.5) * 5.5}deg`)
  if (Math.hypot(motion.tx - motion.x, motion.ty - motion.y) > 0.004) {
    motion.raf = requestAnimationFrame(() => followCard(card))
  } else {
    motion.x = motion.tx
    motion.y = motion.ty
    motion.raf = 0
  }
}

function aimCard(card: HTMLElement, x: number, y: number) {
  let motion = cardMotion.get(card)
  if (!motion) {
    motion = { x: 0.5, y: 0.5, tx: x, ty: y, raf: 0 }
    cardMotion.set(card, motion)
  }
  motion.tx = x
  motion.ty = y
  if (!motion.raf) motion.raf = requestAnimationFrame(() => followCard(card))
}

function tiltCard(card: HTMLElement, event: React.MouseEvent<HTMLElement>) {
  const box = card.getBoundingClientRect()
  aimCard(card, (event.clientX - box.left) / box.width, (event.clientY - box.top) / box.height)
}

function resetCard(card: HTMLElement) {
  aimCard(card, 0.5, 0.5)
}

function Mark({ name }: { name: string }) {
  if (!name || name === 'all') return null
  const icon = SERIES_ICON[name]
  if (!icon) return <span className="h-2 w-2 rounded-full bg-mute/50" />
  return <img src={`/client-preview/icons/${icon}.svg`} alt="" className="h-4 w-4 object-contain" />
}

function Pick({
  label,
  value,
  options,
  withIcon,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ key: string; text: string }>
  withIcon?: boolean
  onChange: (key: string) => void
}) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const current = options.find((option) => option.key === value) ?? options[0]

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((next) => !next)}
        className="price-tool inline-flex h-10 min-w-36 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-ink"
      >
        {withIcon ? <Mark name={current?.key ?? 'all'} /> : null}
        <span>{current?.text}</span>
        <span className="ml-1 text-mute">▾</span>
      </button>
      {open ? (
        <div className="absolute top-12 left-0 z-20 max-h-80 min-w-52 overflow-auto rounded-2xl border border-line bg-surface p-1 shadow-[0_16px_40px_-20px_rgb(17_20_27/0.45)]">
          {options.map((option) => (
            <button
              key={option.key}
              type="button"
              aria-selected={option.key === value}
              onClick={() => {
                onChange(option.key)
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm ${
                option.key === value ? 'bg-sunk text-ink' : 'text-ink hover:bg-paper'
              }`}
            >
              {withIcon ? <Mark name={option.key} /> : null}
              <span>{option.text}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function Pricing() {
  const [catalog, setCatalog] = useState<CatalogModel[]>([])
  const [ready, setReady] = useState(false)
  const [series, setSeries] = useState('all')
  const [category, setCategory] = useState('all')
  const [freeOnly, setFreeOnly] = useState(false)
  const [sort, setSort] = useState<'' | 'name' | 'price'>('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [keyword, setKeyword] = useState('')
  const loaded = useRef(false)

  useEffect(() => {
    let stop = false
    const load = async () => {
      let models: CatalogModel[] | null = null
      try {
        const response = await fetch('/api/catalog', { cache: 'no-store' })
        const data = await response.json()
        if (response.ok && Array.isArray(data.models)) models = data.models
      } catch {
        models = null
      }
      if (!models) {
        if (loaded.current) return
        try {
          models = await (await fetch('/client-preview/models.json')).json()
        } catch {
          models = []
        }
      }
      if (stop || !models) return
      loaded.current = models.length > 0
      setCatalog(models)
      setReady(true)
    }
    load()
    const timer = window.setInterval(load, 20000)
    const onVisible = () => {
      if (!document.hidden) load()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      stop = true
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  const base = useMemo(() => (freeOnly ? catalog.filter((model) => model.free) : catalog), [catalog, freeOnly])

  const seriesOptions = useMemo(() => {
    const groups = SERIES.map(([title]) => ({
      title,
      count: base.filter((model) => seriesOf(model.id) === title).length,
    })).concat([{ title: '其他', count: base.filter((model) => seriesOf(model.id) === '其他').length }])
    const visible = groups.filter((group) => group.count > 0)
    return [{ key: 'all', text: `全部 ${visible.reduce((sum, group) => sum + group.count, 0)}` }].concat(
      visible.map((group) => ({ key: group.title, text: `${group.title} ${group.count}` })),
    )
  }, [base])

  const categoryOptions = useMemo(() => {
    const names = [...new Set(base.map((model) => model.category_name || '未分类'))]
    return [{ key: 'all', text: `全部 ${base.length}` }].concat(
      names.map((title) => ({
        key: title,
        text: `${title} ${base.filter((model) => (model.category_name || '未分类') === title).length}`,
      })),
    )
  }, [base])

  const seriesKey = seriesOptions.some((option) => option.key === series) ? series : 'all'
  const categoryKey = categoryOptions.some((option) => option.key === category) ? category : 'all'

  const models = useMemo(() => {
    const query = keyword.trim().toLowerCase()
    const next = catalog.filter((model) => {
      if (freeOnly && !model.free) return false
      if (seriesKey !== 'all' && seriesOf(model.id) !== seriesKey) return false
      if (categoryKey !== 'all' && (model.category_name || '未分类') !== categoryKey) return false
      const text = `${model.id} ${model.label || ''} ${model.category_name || ''}`.toLowerCase()
      return !query || text.includes(query)
    })
    const dir = order === 'desc' ? -1 : 1
    if (sort === 'name') next.sort((a, b) => (a.label || a.id).localeCompare(b.label || b.id, 'zh') * dir)
    if (sort === 'price') next.sort((a, b) => ((Number(a.price_in) || 0) - (Number(b.price_in) || 0)) * dir)
    return next
  }, [catalog, freeOnly, seriesKey, categoryKey, keyword, sort, order])

  const chooseSort = (key: 'name' | 'price') => {
    if (sort === key) setOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
    else {
      setSort(key)
      setOrder('asc')
    }
  }

  return (
    <div className="grid-paper">
      <div className="mx-auto max-w-[1440px] px-5 py-12">
        <p className="text-sm font-medium text-volt">计费</p>
        <h1 className="mt-3 font-display text-4xl text-balance md:text-6xl">模型单价</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-mute">
          和客户端同一份目录。日卡走免费模型，按量从余额扣收费模型。下面是每百万 token 的现价，划线是分组倍率前的原价。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Pick label="厂商" value={seriesKey} options={seriesOptions} withIcon onChange={setSeries} />
          <Pick label="分组" value={categoryKey} options={categoryOptions} onChange={setCategory} />
          <label className="price-tool inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-ink">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(event) => setFreeOnly(event.target.checked)}
              className="accent-volt"
            />
            仅免费
          </label>
          <button
            type="button"
            aria-pressed={sort === 'name'}
            onClick={() => chooseSort('name')}
            className={`price-tool h-10 rounded-full px-4 text-sm ${
              sort === 'name' ? 'bg-volt text-white' : 'border border-line bg-surface text-ink'
            }`}
          >
            按名称排序{sort === 'name' ? (order === 'desc' ? ' ↓' : ' ↑') : ''}
          </button>
          <button
            type="button"
            aria-pressed={sort === 'price'}
            onClick={() => chooseSort('price')}
            className={`price-tool h-10 rounded-full px-4 text-sm ${
              sort === 'price' ? 'bg-volt text-white' : 'border border-line bg-surface text-ink'
            }`}
          >
            按价格排序{sort === 'price' ? (order === 'desc' ? ' ↓' : ' ↑') : ''}
          </button>
          <label className="price-tool ml-auto flex h-10 min-w-64 flex-1 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-mute md:max-w-xs md:flex-none">
            <Search size={15} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索模型名称或 ID"
              className="w-full bg-transparent text-ink outline-none placeholder:text-mute"
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-mute">
          {ready ? (models.length ? `已显示 ${models.length} / ${catalog.length}` : '没有符合条件的模型') : '正在同步目录'}
        </p>

        {ready && models.length === 0 ? (
          <p className="mt-6 rounded-3xl border border-dashed border-line px-6 py-16 text-center text-sm text-mute">
            {catalog.length ? '没有符合条件的模型。' : '模型目录暂时没有载入。'}
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => {
              const icon = iconOf(model.id)
              const multiplier = Number(model.category_multiplier)
              const prices = [model.price_in, model.price_out, model.price_cache, model.price_cache_write]
              const caps = [
                model.context_window ? `${formatTok(model.context_window)} 上下文` : '',
                model.max_output ? `最多输出 ${formatTok(model.max_output)}` : '',
                model.supports_thinking ? '思考' : '',
              ]
                .filter(Boolean)
                .join(' · ')
              const contexts = Array.isArray(model.context_options) ? model.context_options : []
              const efforts = Array.isArray(model.reasoning_efforts) ? model.reasoning_efforts : []
              return (
                <article
                  key={model.id}
                  className="price-card flex flex-col rounded-3xl border border-line bg-surface p-5"
                  onMouseMove={(event) => tiltCard(event.currentTarget, event)}
                  onMouseLeave={(event) => resetCard(event.currentTarget)}
                >
                  <div className="relative flex items-start justify-between gap-3">
                    <h2 className="flex min-w-0 items-start gap-2 font-display text-xl leading-tight text-ink">
                      {icon ? (
                        <img src={`/client-preview/icons/${icon}.svg`} alt="" className="price-mark mt-1 h-[18px] w-[18px] object-contain" />
                      ) : (
                        <span className="price-mark mt-1 grid h-[18px] w-[18px] place-items-center rounded-md bg-sunk text-xs text-mute">?</span>
                      )}
                      <span>{model.label || model.id}</span>
                    </h2>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                        model.free ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {chipOf(model)}
                    </span>
                  </div>
                  <p className="relative mt-2 font-mono text-xs text-mute">{model.id}</p>
                  <div className="relative mt-4 grid grid-cols-4 gap-2">
                    {PRICE_LABELS.map((label, index) => {
                      const current = prices[index]
                      const list = listPrice(current, multiplier)
                      const showList = priceText(list) !== priceText(current)
                      return (
                        <div key={label} className="min-w-0">
                          <p className="text-[11px] text-mute">{label}</p>
                          <p className="price-now font-medium text-ink tabular-nums">{priceText(current)}</p>
                          {showList ? (
                            <p className="text-[11px] text-mute line-through tabular-nums" title="原价">
                              {priceText(list)}
                            </p>
                          ) : null}
                        </div>
                      )
                    })}
                  </div>
                  {caps ? <p className="relative mt-4 text-xs text-mute">{caps}</p> : null}
                  {contexts.length || efforts.length ? (
                    <div className="relative mt-3 grid gap-2">
                      {contexts.length ? (
                        <p className="flex flex-wrap items-center gap-1 text-[11px] text-mute">
                          <span className="mr-1">上下文</span>
                          {contexts.map((value) => (
                            <span key={String(value)} className="price-spec rounded-full bg-sunk px-2 py-0.5 text-ink">
                              {formatTok(value)}
                            </span>
                          ))}
                        </p>
                      ) : null}
                      {efforts.length ? (
                        <p className="flex flex-wrap items-center gap-1 text-[11px] text-mute">
                          <span className="mr-1">思考</span>
                          {efforts.map((value) => (
                            <span key={value} className="price-spec rounded-full bg-sunk px-2 py-0.5 text-ink">
                              {value}
                            </span>
                          ))}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
