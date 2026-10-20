import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { DownloadItem, SiteContent } from '../../types'
import { SaveBar } from './AdminLayout'

const emptyItem = (): DownloadItem => ({
  id: 0,
  version: '',
  windsurfMax: '',
  size: '',
  url: '',
  notes: '',
  recommended: false,
  published: true,
  releasedAt: new Date().toISOString().slice(0, 10),
  sort: 99,
})

export function DownloadsEditor() {
  const [items, setItems] = useState<DownloadItem[]>([])
  const [selected, setSelected] = useState<DownloadItem | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function reload() {
    const data = await api<SiteContent>('/api/site')
    setItems(data.downloads)
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
      const saved = await api<DownloadItem>('/api/admin/downloads', {
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
    if (!confirm(`删除 v${selected.version}？`)) return
    await api(`/api/admin/downloads/${selected.id}`, { method: 'DELETE' })
    setSelected(null)
    await reload()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <div>
        <h1 className="font-display text-3xl">下载</h1>
        <button type="button" className="mt-4 text-sm text-volt" onClick={() => setSelected(emptyItem())}>
          + 新建版本
        </button>
        <ul className="mt-4 space-y-1">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelected(item)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selected?.id === item.id ? 'bg-volt/10 font-medium text-volt' : 'text-mute'
                }`}
              >
                v{item.version}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selected ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="版本号" value={selected.version} onChange={(version) => setSelected({ ...selected, version })} />
          <Field
            label="平台"
            value={selected.windsurfMax}
            onChange={(windsurfMax) => setSelected({ ...selected, windsurfMax })}
          />
          <Field label="体积" value={selected.size} onChange={(size) => setSelected({ ...selected, size })} />
          <Field
            label="发布日期"
            value={selected.releasedAt}
            onChange={(releasedAt) => setSelected({ ...selected, releasedAt })}
          />
          <Field
            className="md:col-span-2"
            label="下载 URL"
            value={selected.url}
            onChange={(url) => setSelected({ ...selected, url })}
          />
          <Field
            className="md:col-span-2"
            label="说明"
            value={selected.notes}
            onChange={(notes) => setSelected({ ...selected, notes })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.recommended}
              onChange={(e) => setSelected({ ...selected, recommended: e.target.checked })}
            />
            当前推荐
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.published}
              onChange={(e) => setSelected({ ...selected, published: e.target.checked })}
            />
            上架
          </label>
          <div className="md:col-span-2">
            <SaveBar message={message} error={error} pending={pending} onSave={save} />
            {selected.id ? (
              <button type="button" onClick={remove} className="mt-4 text-sm text-flare">
                删除此版本
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-sm text-mute">选择或新建一个版本。第一期只填 URL，不上传大文件。</p>
      )}
    </div>
  )
}

function Field({
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
