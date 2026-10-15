import { useEffect, useState } from 'react'
import { Markdown } from '../../components/Markdown'
import { api } from '../../lib/api'
import type { DocItem, SiteContent } from '../../types'
import { SaveBar } from './AdminLayout'

const emptyDoc = (): DocItem => ({
  id: 0,
  groupName: '开始使用',
  slug: '',
  title: '',
  body: '',
  published: true,
  sort: 99,
})

export function DocsEditor() {
  const [docs, setDocs] = useState<DocItem[]>([])
  const [selected, setSelected] = useState<DocItem | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function reload() {
    const data = await api<SiteContent>('/api/site')
    setDocs(data.docs)
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
      const saved = await api<DocItem>('/api/admin/docs', {
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
    if (!confirm(`删除「${selected.title}」？`)) return
    await api(`/api/admin/docs/${selected.id}`, { method: 'DELETE' })
    setSelected(null)
    await reload()
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div>
        <h1 className="font-display text-3xl">文档</h1>
        <button type="button" className="mt-4 text-sm text-volt" onClick={() => setSelected(emptyDoc())}>
          + 新建
        </button>
        <ul className="mt-4 space-y-1">
          {docs.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                onClick={() => setSelected(d)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  selected?.id === d.id ? 'bg-volt/10 font-medium text-volt' : 'text-mute'
                }`}
              >
                {d.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {selected ? (
        <div>
          <div className="grid gap-3 md:grid-cols-3">
            <label className="text-xs text-mute">
              分组
              <input
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
                value={selected.groupName}
                onChange={(e) => setSelected({ ...selected, groupName: e.target.value })}
              />
            </label>
            <label className="text-xs text-mute">
              slug
              <input
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
                value={selected.slug}
                onChange={(e) => setSelected({ ...selected, slug: e.target.value })}
              />
            </label>
            <label className="text-xs text-mute">
              标题
              <input
                className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
                value={selected.title}
                onChange={(e) => setSelected({ ...selected, title: e.target.value })}
              />
            </label>
          </div>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={selected.published}
              onChange={(e) => setSelected({ ...selected, published: e.target.checked })}
            />
            发布
          </label>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <textarea
              className="min-h-80 rounded-2xl border border-line bg-surface p-4 font-mono text-sm text-ink outline-none"
              value={selected.body}
              onChange={(e) => setSelected({ ...selected, body: e.target.value })}
            />
            <div className="rounded-2xl border border-line p-4">
              <p className="mb-3 text-xs text-mute">预览</p>
              <Markdown source={selected.body} />
            </div>
          </div>
          <SaveBar message={message} error={error} pending={pending} onSave={save} />
          {selected.id ? (
            <button type="button" onClick={remove} className="mt-4 text-sm text-flare">
              删除此文档
            </button>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-mute">选择一篇文档编辑。正文支持简易 Markdown。</p>
      )}
    </div>
  )
}
