import { useEffect, useState } from 'react'
import { DEFAULT_CONTENT } from '../../data/defaults'
import { api } from '../../lib/api'
import type { HomeContent, SiteContent } from '../../types'
import { SaveBar } from './AdminLayout'

export function HomeEditor() {
  const [home, setHome] = useState<HomeContent>(DEFAULT_CONTENT.home)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    api<SiteContent>('/api/site').then((data) => setHome(data.home))
  }, [])

  async function save() {
    setPending(true)
    setError('')
    setMessage('')
    try {
      await api('/api/admin/home', { method: 'PUT', body: JSON.stringify(home) })
      setMessage('已发布，前台刷新即可看到。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl">首页文案</h1>
      <p className="mt-2 text-sm text-mute">口号、按钮、数据条、能力与 FAQ。保存即发布。</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="眉题" value={home.kicker} onChange={(kicker) => setHome({ ...home, kicker })} />
        <Field label="主标题" value={home.headline} onChange={(headline) => setHome({ ...home, headline })} />
        <Field label="高亮句" value={home.highlight} onChange={(highlight) => setHome({ ...home, highlight })} />
        <Field label="主按钮" value={home.ctaPrimary} onChange={(ctaPrimary) => setHome({ ...home, ctaPrimary })} />
        <Field label="次按钮" value={home.ctaSecondary} onChange={(ctaSecondary) => setHome({ ...home, ctaSecondary })} />
        <Field label="下载标题" value={home.downloadTitle} onChange={(downloadTitle) => setHome({ ...home, downloadTitle })} />
      </div>
      <Field
        className="mt-4"
        label="副文案"
        textarea
        value={home.sub}
        onChange={(sub) => setHome({ ...home, sub })}
      />
      <Field
        className="mt-4"
        label="下载副文案"
        textarea
        value={home.downloadSub}
        onChange={(downloadSub) => setHome({ ...home, downloadSub })}
      />

      <h2 className="mt-8 text-lg">数据条</h2>
      {home.stats.map((s, i) => (
        <div key={i} className="mt-3 grid gap-3 md:grid-cols-2">
          <Field
            label={`数值 ${i + 1}`}
            value={s.value}
            onChange={(value) => {
              const stats = [...home.stats]
              stats[i] = { ...s, value }
              setHome({ ...home, stats })
            }}
          />
          <Field
            label="标签"
            value={s.label}
            onChange={(label) => {
              const stats = [...home.stats]
              stats[i] = { ...s, label }
              setHome({ ...home, stats })
            }}
          />
        </div>
      ))}

      <h2 className="mt-8 text-lg">三块能力</h2>
      {home.capabilities.map((c, i) => (
        <div key={c.id} className="mt-4 rounded-2xl border border-line p-4">
          <Field label="标题" value={c.title} onChange={(title) => {
            const capabilities = [...home.capabilities]
            capabilities[i] = { ...c, title }
            setHome({ ...home, capabilities })
          }} />
          <Field className="mt-3" textarea label="描述" value={c.desc} onChange={(desc) => {
            const capabilities = [...home.capabilities]
            capabilities[i] = { ...c, desc }
            setHome({ ...home, capabilities })
          }} />
          <Field className="mt-3" textarea label="要点（一行一条）" value={c.points.join('\n')} onChange={(text) => {
            const capabilities = [...home.capabilities]
            capabilities[i] = { ...c, points: text.split('\n').map((x) => x.trim()).filter(Boolean) }
            setHome({ ...home, capabilities })
          }} />
        </div>
      ))}

      <h2 className="mt-8 text-lg">FAQ</h2>
      {home.faqs.map((f, i) => (
        <div key={i} className="mt-4 grid gap-3 md:grid-cols-2">
          <Field label={`问题 ${i + 1}`} value={f.q} onChange={(q) => {
            const faqs = [...home.faqs]
            faqs[i] = { ...f, q }
            setHome({ ...home, faqs })
          }} />
          <Field textarea label="回答" value={f.a} onChange={(a) => {
            const faqs = [...home.faqs]
            faqs[i] = { ...f, a }
            setHome({ ...home, faqs })
          }} />
        </div>
      ))}
      <SaveBar message={message} error={error} pending={pending} onSave={save} />
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  textarea,
  className = '',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  textarea?: boolean
  className?: string
}) {
  return (
    <label className={`block text-xs text-mute ${className}`}>
      {label}
      {textarea ? (
        <textarea
          className="mt-1 min-h-24 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  )
}
