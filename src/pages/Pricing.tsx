import { Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

type PriceTier = {
  price_in?: number | null
  price_out?: number | null
  price_cache?: number | null
  price_cache_write?: number | null
}

type CatalogModel = {
  id: string
  label?: string
  free?: boolean
  billing_mode?: string
  ratio?: number
  price_in?: number | null
  price_out?: number | null
  price_cache?: number | null
  price_cache_write?: number | null
  price_request?: number | null
  tier_threshold?: number | null
  tier_ratio?: number | null
  price_tiers?: { active?: string; peak?: PriceTier; off?: PriceTier } | null
  category_name?: string
  category_multiplier?: number
  context_window?: number | null
  max_output?: number | null
  supports_thinking?: boolean
  reasoning_efforts?: string[] | null
}

const SERIES: Array<[string, string[]]> = [
  ['Claude', ['claude']],
  ['GPT', ['gpt', 'openai', 'chatgpt']],
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
  ['gpt', 'openai'],
  ['openai', 'openai'],
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
  GPT: 'openai',
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

function rateText(value: number | string) {
  const n = Number(value)
  if (!Number.isFinite(n)) return ''
  return `×${Number(n.toFixed(4))}`
}

function rateKey(model: CatalogModel) {
  const mult = Number(model.category_multiplier)
  if (!(mult > 0)) return ''
  return String(Number(mult.toFixed(4)))
}

function fullCount(value: number | null | undefined) {
  const n = Number(value)
  if (!(n > 0)) return ''
  return n.toLocaleString('en-US')
}

function modelTags(model: CatalogModel) {
  if (model.free) return [{ kind: 'free', text: '免费' }]
  if (model.billing_mode === 'request') {
    const price = Number(model.price_request)
    const tags = [{ kind: 'group', text: '按次' }]
    if (price > 0) tags.push({ kind: 'rate', text: String(Number(price.toFixed(4))) })
    return tags
  }
  const name = String(model.category_name || '').trim()
  const mult = Number(model.category_multiplier)
  const tags: Array<{ kind: string; text: string }> = []
  if (name) tags.push({ kind: 'group', text: name })
  if (mult > 0) tags.push({ kind: 'rate', text: rateText(mult) })
  if (!tags.length) {
    const ratio = Number(model.ratio)
    tags.push(ratio > 0 ? { kind: 'rate', text: rateText(ratio) } : { kind: 'group', text: '收费' })
  }
  return tags
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

function FilterLine({
  label,
  value,
  options,
  withIcon,
  onChange,
}: {
  label: string
  value: string
  options: Array<{ key: string; name: string; count: number }>
  withIcon?: boolean
  onChange: (key: string) => void
}) {
  const rowRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef(new Map<string, HTMLButtonElement>())
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, on: false })

  useLayoutEffect(() => {
    const row = rowRef.current
    const button = buttonRefs.current.get(value)
    if (!row || !button) return
    const place = () => {
      const rowBox = row.getBoundingClientRect()
      const buttonBox = button.getBoundingClientRect()
      setPill((prev) => ({
        left: buttonBox.left - rowBox.left,
        top: buttonBox.top - rowBox.top,
        width: buttonBox.width,
        height: buttonBox.height,
        on: prev.on,
      }))
      requestAnimationFrame(() => setPill((prev) => ({ ...prev, on: true })))
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [value, options])

  return (
    <div className="flex items-start gap-3">
      <span className="mt-1.5 w-8 shrink-0 text-xs text-mute">{label}</span>
      <div ref={rowRef} className="relative flex flex-1 flex-wrap gap-1" role="listbox" aria-label={label}>
        <span
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-ink"
          style={{
            left: pill.left,
            top: pill.top,
            width: pill.width,
            height: pill.height,
            transition: pill.on
              ? 'left .55s cubic-bezier(.22,1,.36,1), top .55s cubic-bezier(.22,1,.36,1), width .55s cubic-bezier(.22,1,.36,1), height .55s cubic-bezier(.22,1,.36,1)'
              : 'none',
          }}
        />
        {options.map((option) => {
          const selected = option.key === value
          return (
            <button
              key={option.key}
              ref={(node) => {
                if (node) buttonRefs.current.set(option.key, node)
                else buttonRefs.current.delete(option.key)
              }}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(option.key)}
              className={`relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-[13px] ${
                selected ? 'text-white' : 'text-ink hover:bg-sunk'
              }`}
              style={{ transition: 'color .55s cubic-bezier(.22,1,.36,1)' }}
            >
              {withIcon ? <Mark name={option.key} /> : null}
              <span>{option.name}</span>
              <span className={`text-[11px] tabular-nums ${selected ? 'text-white/55' : 'text-mute'}`} style={{ transition: 'color .55s cubic-bezier(.22,1,.36,1)' }}>
                {option.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function Pricing() {
  const [catalog, setCatalog] = useState<CatalogModel[]>([])
  const [ready, setReady] = useState(false)
  const [series, setSeries] = useState('all')
  const [category, setCategory] = useState('all')
  const [rate, setRate] = useState('all')
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
  const inSeries = (model: CatalogModel) => series === 'all' || seriesOf(model.id) === series
  const inCategory = (model: CatalogModel) => category === 'all' || (model.category_name || '未分类') === category
  const inRate = (model: CatalogModel) => rate === 'all' || rateKey(model) === rate

  const seriesOptions = useMemo(() => {
    const pool = base.filter((model) => inCategory(model) && inRate(model))
    const groups = SERIES.map(([title]) => ({
      title,
      count: pool.filter((model) => seriesOf(model.id) === title).length,
    })).concat([{ title: '其他', count: pool.filter((model) => seriesOf(model.id) === '其他').length }])
    const visible = groups.filter((group) => group.count > 0 || group.title === series)
    return [{ key: 'all', name: '全部', count: pool.length }].concat(
      visible.map((group) => ({ key: group.title, name: group.title, count: group.count })),
    )
  }, [base, category, rate, series])

  const categoryOptions = useMemo(() => {
    const pool = base.filter((model) => inSeries(model) && inRate(model))
    const names = [...new Set(base.map((model) => model.category_name || '未分类'))]
    return [{ key: 'all', name: '全部', count: pool.length }].concat(
      names
        .map((title) => ({
          key: title,
          name: title,
          count: pool.filter((model) => (model.category_name || '未分类') === title).length,
        }))
        .filter((option) => option.count > 0 || option.key === category),
    )
  }, [base, series, rate, category])

  const rateOptions = useMemo(() => {
    const pool = base.filter((model) => inSeries(model) && inCategory(model))
    const keys = [...new Set(pool.map(rateKey).filter(Boolean))]
    if (rate !== 'all' && !keys.includes(rate)) keys.push(rate)
    keys.sort((a, b) => Number(a) - Number(b))
    return [{ key: 'all', name: '全部', count: pool.length }].concat(
      keys
        .map((key) => ({
          key,
          name: rateText(key),
          count: pool.filter((model) => rateKey(model) === key).length,
        }))
        .filter((option) => option.count > 0 || option.key === rate),
    )
  }, [base, series, category, rate])

  const seriesKey = seriesOptions.some((option) => option.key === series) ? series : 'all'
  const categoryKey = categoryOptions.some((option) => option.key === category) ? category : 'all'
  const rateFilterKey = rateOptions.some((option) => option.key === rate) ? rate : 'all'

  const models = useMemo(() => {
    const query = keyword.trim().toLowerCase()
    const next = catalog.filter((model) => {
      if (freeOnly && !model.free) return false
      if (seriesKey !== 'all' && seriesOf(model.id) !== seriesKey) return false
      if (categoryKey !== 'all' && (model.category_name || '未分类') !== categoryKey) return false
      if (rateFilterKey !== 'all' && rateKey(model) !== rateFilterKey) return false
      const text = `${model.id} ${model.label || ''} ${model.category_name || ''}`.toLowerCase()
      return !query || text.includes(query)
    })
    const dir = order === 'desc' ? -1 : 1
    if (sort === 'name') next.sort((a, b) => (a.label || a.id).localeCompare(b.label || b.id, 'zh') * dir)
    if (sort === 'price') next.sort((a, b) => ((Number(a.price_in) || 0) - (Number(b.price_in) || 0)) * dir)
    return next
  }, [catalog, freeOnly, seriesKey, categoryKey, rateFilterKey, keyword, sort, order])

  const chooseSort = (key: 'name' | 'price') => {
    if (sort === key) setOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
    else {
      setSort(key)
      setOrder('asc')
    }
  }

  return (
    <div className="grid-paper">
      <div className="mx-auto max-w-6xl px-5 pt-8 pb-12">
        <div className="rounded-3xl border border-line bg-surface px-4 py-3">
          <FilterLine label="厂商" value={seriesKey} options={seriesOptions} withIcon onChange={setSeries} />
          <div className="my-2.5 h-px bg-line" />
          <FilterLine label="分组" value={categoryKey} options={categoryOptions} onChange={setCategory} />
          <div className="my-2.5 h-px bg-line" />
          <FilterLine label="倍率" value={rateFilterKey} options={rateOptions} onChange={setRate} />
          <div className="my-2.5 h-px bg-line" />
        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-8 items-center gap-2 rounded-lg px-2.5 text-[13px] text-ink hover:bg-sunk">
            <input
              type="checkbox"
              checked={freeOnly}
              onChange={(event) => setFreeOnly(event.target.checked)}
              className="accent-ink"
            />
            仅免费
          </label>
          <button
            type="button"
            aria-pressed={sort === 'name'}
            onClick={() => chooseSort('name')}
            className={`h-8 rounded-lg px-2.5 text-[13px] ${
              sort === 'name' ? 'bg-ink font-medium text-white' : 'text-mute hover:bg-sunk hover:text-ink'
            }`}
          >
            名称{sort === 'name' ? (order === 'desc' ? ' ↓' : ' ↑') : ''}
          </button>
          <button
            type="button"
            aria-pressed={sort === 'price'}
            onClick={() => chooseSort('price')}
            className={`h-8 rounded-lg px-2.5 text-[13px] ${
              sort === 'price' ? 'bg-ink font-medium text-white' : 'text-mute hover:bg-sunk hover:text-ink'
            }`}
          >
            价格{sort === 'price' ? (order === 'desc' ? ' ↓' : ' ↑') : ''}
          </button>
          <label className="ml-auto flex h-8 min-w-52 flex-1 items-center gap-2 rounded-lg bg-paper px-3 text-sm text-mute md:max-w-xs md:flex-none">
            <Search size={14} />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜索名称或 ID"
              className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-mute"
            />
          </label>
        </div>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="max-w-3xl text-sm leading-7 text-mute">
              和客户端同一份目录。日卡走免费模型，按量从余额扣收费模型。下面是每百万 token 的现价，划线是分组倍率前的原价。
              <Link to="/topup" className="ml-2 text-volt no-underline">
                去充值
              </Link>
            </p>
          </div>
          <p className="shrink-0 text-xs text-mute">
            {ready ? (models.length ? `已显示 ${models.length} / ${catalog.length}` : '没有符合条件的模型') : '正在同步目录'}
          </p>
        </div>

        {ready && models.length === 0 ? (
          <p className="mt-6 rounded-3xl border border-dashed border-line px-6 py-16 text-center text-sm text-mute">
            {catalog.length ? '没有符合条件的模型。' : '模型目录暂时没有载入。'}
          </p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {models.map((model) => {
              const icon = iconOf(model.id)
              const multiplier = Number(model.category_multiplier)
              const tiers = model.price_tiers
              const hasTiers = Boolean(tiers?.peak && tiers?.off)
              const activeKey = tiers?.active === 'off' ? 'off' : 'peak'
              const prices = [model.price_in, model.price_out, model.price_cache, model.price_cache_write]
              const tierRows = hasTiers
                ? [
                    { key: 'peak', values: [tiers?.peak?.price_in, tiers?.peak?.price_out, tiers?.peak?.price_cache, tiers?.peak?.price_cache_write] },
                    { key: 'off', values: [tiers?.off?.price_in, tiers?.off?.price_out, tiers?.off?.price_cache, tiers?.off?.price_cache_write] },
                  ]
                : []
              const activeValues = hasTiers ? (activeKey === 'off' ? tierRows[1].values : tierRows[0].values) : prices
              const efforts = Array.isArray(model.reasoning_efforts) ? model.reasoning_efforts : []
              const context = fullCount(model.context_window)
              const output = fullCount(model.max_output)
              const threshold = Number(model.tier_threshold)
              const tierRatio = Number(model.tier_ratio)
              return (
                <article
                  key={model.id}
                  className="price-card flex flex-col rounded-3xl border border-line bg-surface p-5"
                  onMouseMove={(event) => tiltCard(event.currentTarget, event)}
                  onMouseLeave={(event) => resetCard(event.currentTarget)}
                >
                  <h2 className="relative flex min-w-0 items-start gap-2 font-display text-xl leading-tight text-ink">
                    {icon ? (
                      <img src={`/client-preview/icons/${icon}.svg`} alt="" className="price-mark mt-1 h-[18px] w-[18px] object-contain" />
                    ) : (
                      <span className="price-mark mt-1 grid h-[18px] w-[18px] place-items-center rounded-md bg-sunk text-xs text-mute">?</span>
                    )}
                    <span>{model.label || model.id}</span>
                  </h2>
                  <div className="relative mt-2 flex flex-wrap gap-1.5">
                    {modelTags(model).map((tag) => (
                      <span
                        key={`${tag.kind}-${tag.text}`}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          tag.kind === 'free'
                            ? 'bg-emerald-100 text-emerald-800'
                            : tag.kind === 'rate'
                              ? 'bg-sunk text-mute'
                              : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {tag.text}
                      </span>
                    ))}
                  </div>
                  <div className="relative mt-4 grid grid-cols-4 gap-x-2 gap-y-1">
                    {PRICE_LABELS.map((label) => (
                      <p key={label} className="text-[11px] text-mute">{label}</p>
                    ))}
                    {hasTiers
                      ? tierRows.map((row) =>
                          row.values.map((value, index) => (
                            <p
                              key={`${row.key}-${PRICE_LABELS[index]}`}
                              className={`rounded-md px-1 font-medium tabular-nums ${
                                row.key === activeKey ? 'bg-amber-100 text-ink' : 'text-mute'
                              }`}
                            >
                              {priceText(value)}
                            </p>
                          )),
                        )
                      : prices.map((value, index) => (
                          <p key={PRICE_LABELS[index]} className="price-now font-medium text-ink tabular-nums">
                            {priceText(value)}
                          </p>
                        ))}
                    {activeValues.map((value, index) => {
                      const list = listPrice(value, multiplier)
                      const showList = priceText(list) !== priceText(value)
                      return (
                        <p key={`list-${PRICE_LABELS[index]}`} className="text-[11px] text-mute line-through tabular-nums" title="原价">
                          {showList ? priceText(list) : ''}
                        </p>
                      )
                    })}
                  </div>
                  {hasTiers ? (
                    <p className="relative mt-3 text-[11px] text-mute">高峰：工作日 09:00–12:00、14:00–18:00</p>
                  ) : null}
                  {threshold > 0 && tierRatio > 0 ? (
                    <p className="relative mt-2 text-[11px] text-mute">
                      输入超过 {threshold.toLocaleString('en-US')}，整单 {rateText(tierRatio)}
                    </p>
                  ) : null}
                  {context || output ? (
                    <p className="relative mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-mute">
                      {context ? <span><b className="mr-1 font-medium text-ink">最大上下文</b>{context}</span> : null}
                      {output ? <span><b className="mr-1 font-medium text-ink">最大输出</b>{output}</span> : null}
                    </p>
                  ) : null}
                  {efforts.length ? (
                    <p className="relative mt-2 flex flex-wrap items-center gap-1 text-[11px] text-mute">
                      <span className="mr-1">思考</span>
                      {efforts.map((value) => (
                        <span key={value} className="price-spec rounded-full bg-sunk px-2 py-0.5 text-ink">
                          {value}
                        </span>
                      ))}
                    </p>
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
