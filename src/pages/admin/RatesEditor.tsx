import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import type { ModelRate, SiteContent } from '../../types'
import { SaveBar } from './AdminLayout'

export function RatesEditor() {
  const [rates, setRates] = useState<ModelRate[]>([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  useEffect(() => {
    api<SiteContent>('/api/site').then((data) => setRates(data.rates ?? []))
  }, [])

  async function save() {
    setPending(true)
    setError('')
    setMessage('')
    try {
      const saved = await api<{ rates: ModelRate[] }>('/api/admin/rates', {
        method: 'PUT',
        body: JSON.stringify({ rates }),
      })
      setRates(saved.rates)
      setMessage('已发布。')
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败')
    } finally {
      setPending(false)
    }
  }

  function addRow() {
    const nextId = rates.reduce((m, r) => Math.max(m, r.id), 0) + 1
    setRates([
      ...rates,
      {
        id: nextId,
        name: '',
        kind: '按量',
        ratio: '1',
        note: '',
        published: true,
        sort: rates.length + 1,
      },
    ])
  }

  return (
    <div>
      <h1 className="font-display text-3xl">模型倍率</h1>
      <p className="mt-2 text-sm text-mute">展示在计费页。中继实际扣费以登录后同步的模型目录为准。</p>
      <button type="button" className="mt-4 text-sm text-volt" onClick={addRow}>
        + 新增一行
      </button>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="font-mono text-[11px] text-mute">
            <tr>
              <th className="py-2 font-normal">名称</th>
              <th className="py-2 font-normal">类型</th>
              <th className="py-2 font-normal">倍率</th>
              <th className="py-2 font-normal">说明</th>
              <th className="py-2 font-normal">排序</th>
              <th className="py-2 font-normal">上架</th>
              <th className="py-2 font-normal" />
            </tr>
          </thead>
          <tbody>
            {rates.map((r, i) => (
              <tr key={r.id} className="border-t border-line">
                <td className="py-2 pr-2">
                  <input
                    className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-ink"
                    value={r.name}
                    onChange={(e) =>
                      setRates(rates.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="w-24 rounded-lg border border-line bg-surface px-2 py-1.5 text-ink"
                    value={r.kind}
                    onChange={(e) =>
                      setRates(rates.map((x, j) => (j === i ? { ...x, kind: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="w-24 rounded-lg border border-line bg-surface px-2 py-1.5 text-ink"
                    value={r.ratio}
                    onChange={(e) =>
                      setRates(rates.map((x, j) => (j === i ? { ...x, ratio: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="w-full rounded-lg border border-line bg-surface px-2 py-1.5 text-ink"
                    value={r.note}
                    onChange={(e) =>
                      setRates(rates.map((x, j) => (j === i ? { ...x, note: e.target.value } : x)))
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    className="w-16 rounded-lg border border-line bg-surface px-2 py-1.5 text-ink"
                    value={String(r.sort)}
                    onChange={(e) =>
                      setRates(
                        rates.map((x, j) => (j === i ? { ...x, sort: Number(e.target.value) || 0 } : x)),
                      )
                    }
                  />
                </td>
                <td className="py-2 pr-2">
                  <input
                    type="checkbox"
                    checked={r.published}
                    onChange={(e) =>
                      setRates(rates.map((x, j) => (j === i ? { ...x, published: e.target.checked } : x)))
                    }
                  />
                </td>
                <td className="py-2">
                  <button
                    type="button"
                    className="text-xs text-flare"
                    onClick={() => setRates(rates.filter((_, j) => j !== i))}
                  >
                    删
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SaveBar message={message} error={error} pending={pending} onSave={save} />
    </div>
  )
}
