import { useEffect, useState } from 'react'
import { DEFAULT_CONTENT } from '../../data/defaults'
import { api } from '../../lib/api'
import type { Notice, SiteContent } from '../../types'
import { SaveBar } from './AdminLayout'

export function NoticeEditor() {
  const [notice, setNotice] = useState<Notice>(DEFAULT_CONTENT.notice)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    api<SiteContent>('/api/site').then((data) => setNotice(data.notice))
  }, [])

  async function save() {
    setPending(true)
    setError('')
    setMessage('')
    try {
      await api('/api/admin/notice', { method: 'PUT', body: JSON.stringify(notice) })
      setMessage('已发布。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-3xl">顶栏公告</h1>
      <label className="mt-6 flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={notice.enabled}
          onChange={(e) => setNotice({ ...notice, enabled: e.target.checked })}
        />
        显示公告条
      </label>
      <label className="mt-4 block text-xs text-mute">
        文案
        <input
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
          value={notice.text}
          onChange={(e) => setNotice({ ...notice, text: e.target.value })}
        />
      </label>
      <label className="mt-4 block text-xs text-mute">
        链接（站内路径，如 /downloads）
        <input
          className="mt-1 w-full rounded-xl border border-line bg-surface px-3 py-2 text-sm text-ink outline-none"
          value={notice.href}
          onChange={(e) => setNotice({ ...notice, href: e.target.value })}
        />
      </label>
      <SaveBar message={message} error={error} pending={pending} onSave={save} />
    </div>
  )
}
