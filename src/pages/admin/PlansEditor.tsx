import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { Plan, SiteContent } from '../../types'
import { SaveBar } from './AdminLayout'

const emptyPlan = (): Plan => ({
  id: 0,
  slug: '',
  name: '',
  badge: '',
  price: '',
  period: '',
  officialPrice: '',
  officialLabel: '',
  description: '',
  features: [],
  quotas: [
    { label: '', value: '', note: '' },
    { label: '', value: '', note: '' },
  ],
  highlighted: false,
  published: true,
  sort: 99,
})

export function PlansEditor() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [selected, setSelected] = useState<Plan | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function reload() {
    const data = await api<SiteContent>('/api/site')
    setPlans(data.plans)
  }

  useEffect(() => {
    reload()
  }, [])

  async function save() {
    if (!selected) return
    setPending(true)
    setError('')
    setMessage('')
    try {
      const saved = await api<Plan>('/api/admin/plans', {
        method: selected.id ? 'PUT' : 'POST',
        body: JSON.stringify(selected),
      })
      setSelected(saved)
      await reload()
      setMessage('已发布。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  async function remove() {
    if (!selected?.id) return
    if (!confirm(`删除计费方式「${selected.name}」？`)) return
    await api(`/api/admin/plans/${selected.id}`, { method: 'DELETE' })
    setSelected(null)
    await reload()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div>
        <h1 className="font-display text-3xl">计费方式</h1>
        <p className="mt-2 text-sm text-mute">展示规则，不是固定充值金额。</p>
        <button
          type="button"
          className="mt-4 text-sm text-volt"
          onClick={() => setSelected(emptyPlan())}
        >
          + 新建
        </button>
        <ul className="mt-4 space-y-1">
          {plans.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setSelected(p)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selected?.id === p.id ? 'bg-volt/10 font-medium text-volt' : 'text-mute hover:text-ink'
                }`}
              >
                {p.name}
                {!p.published ? <span className="ml-2 text-xs text-flare">下架</span> : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selected ? (
        <div>
          <div className="grid gap-3 md:grid-cols-2">
            <Input label="名称" value={selected.name} onChange={(name) => setSelected({ ...selected, name })} />
            <Input label="slug" value={selected.slug} onChange={(slug) => setSelected({ ...selected, slug })} />
            <Input label="价格" value={selected.price} onChange={(price) => setSelected({ ...selected, price })} />
            <Input
              label="周期（留空）"
              value={selected.period}
              onChange={(period) => setSelected({ ...selected, period })}
            />
            <Input label="角标" value={selected.badge} onChange={(badge) => setSelected({ ...selected, badge })} />
            <Input
              label="排序"
              value={String(selected.sort)}
              onChange={(sort) => setSelected({ ...selected, sort: Number(sort) || 0 })}
            />
            <Input
              label="官方对照价"
              value={selected.officialPrice}
              onChange={(officialPrice) => setSelected({ ...selected, officialPrice })}
            />
            <Input
              label="对照说明"
              value={selected.officialLabel}
              onChange={(officialLabel) => setSelected({ ...selected, officialLabel })}
            />
          </div>
          <Input
            className="mt-3"
            label="简介"
            value={selected.description}
            onChange={(description) => setSelected({ ...selected, description })}
          />
          <label className="mt-3 block text-xs text-mute">
            卖点（一行一条）
            <textarea
              className="mt-1 min-h-28 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
              value={selected.features.join('\n')}
              onChange={(e) =>
                setSelected({
                  ...selected,
                  features: e.target.value.split('\n').map((x) => x.trim()).filter(Boolean),
                })
              }
            />
          </label>
          <div className="mt-4 flex gap-4 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.highlighted}
                onChange={(e) => setSelected({ ...selected, highlighted: e.target.checked })}
              />
              推荐高亮
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selected.published}
                onChange={(e) => setSelected({ ...selected, published: e.target.checked })}
              />
              上架
            </label>
          </div>
          <SaveBar message={message} error={error} pending={pending} onSave={save} />
          {selected.id ? (
            <button type="button" onClick={remove} className="mt-4 text-sm text-flare">
              删除此档
            </button>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-mute">选择左侧计费方式，或新建。</p>
      )}
    </div>
  )
}

function Input({
  label,
  value,
  onChange,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  className?: string
}) {
  return (
    <label className={`block text-xs text-mute ${className}`}>
      {label}
      <input
        className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}
