import { Download as DownloadIcon, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { ComingSoon } from '../components/ComingSoon'
import { useContent } from '../lib/content'

export function Downloads() {
  const { downloads } = useContent()
  const [q, setQ] = useState('')
  const [soon, setSoon] = useState('')
  const list = useMemo(() => {
    const published = downloads.filter((d) => d.published).sort((a, b) => a.sort - b.sort)
    const needle = q.trim().toLowerCase()
    if (!needle) return published
    return published.filter(
      (d) =>
        d.version.toLowerCase().includes(needle) ||
        d.windsurfMax.toLowerCase().includes(needle) ||
        d.notes.toLowerCase().includes(needle),
    )
  }, [downloads, q])
  const primary = list.find((d) => d.recommended) ?? list[0]
  const featured = primary ? list.filter((d) => d.version === primary.version) : []

  const trigger = (label: string, url: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    setSoon(label)
  }

  return (
    <div className="grid-paper">
      <div className="mx-auto max-w-5xl px-5 py-16">
        <h1 className="font-display text-4xl md:text-6xl">下载中心</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-mute">
          选择你的系统，直接下载 DevinHub 客户端。安装包放在本站，点下去就会开始下载。
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-line bg-surface p-6">
            <h2 className="font-display text-2xl">快捷上手</h2>
            <p className="mt-2 text-sm text-mute">三步完成接入。大多数情况直接下载推荐客户端即可。</p>
            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {[
                ['安装客户端', '先装 Devin，再装对应系统的 DevinHub 客户端。'],
                ['卡密激活', '在客户端激活。一卡一机，不在网页注册。'],
                ['启动拦截', '启动本地拦截，确认 Devin 进程在运行。'],
              ].map(([title, desc], i) => (
                <div key={title} className="rounded-2xl border border-line bg-paper p-4">
                  <p className="font-mono text-sm font-medium text-volt">{i + 1}</p>
                  <p className="mt-2 text-sm text-ink">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-mute">{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm">推荐客户端</p>
              <span className="rounded-full bg-volt/10 px-2 py-0.5 text-[10px] text-volt">当前推荐</span>
            </div>
            {featured.length ? (
              <>
                <p className="mt-6 font-display text-3xl">{primary.version ? `v${primary.version}` : 'DevinHub'}</p>
                <p className="mt-2 text-xs text-mute">{primary.notes || '当前发布的客户端'}</p>
                <div className="mt-6 grid gap-2">
                  {featured.map((item) =>
                    item.url ? (
                      <a
                        key={item.id}
                        href={item.url}
                        className="block rounded-full bg-volt py-2.5 text-center text-sm text-white no-underline"
                      >
                        下载 {item.windsurfMax || `v${item.version}`}
                      </a>
                    ) : (
                      <button
                        key={item.id}
                        type="button"
                        className="rounded-full bg-volt py-2.5 text-sm text-white"
                        onClick={() => trigger(`${item.windsurfMax || 'v' + item.version}`, item.url)}
                      >
                        下载 {item.windsurfMax || `v${item.version}`}
                      </button>
                    ),
                  )}
                </div>
              </>
            ) : (
              <p className="mt-8 text-sm text-mute">暂无已发布版本</p>
            )}
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-surface p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-display text-2xl">版本库</h2>
              <p className="mt-1 text-sm text-mute">按版本号或平台说明查找。</p>
            </div>
            <label className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2 text-sm">
              <Search size={14} className="text-mute" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="例如：1.2.0"
                className="w-48 bg-transparent text-ink outline-none placeholder:text-mute"
              />
            </label>
          </div>
          <ul className="mt-6 divide-y divide-line">
            {list.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-ink">
                    {item.version ? `v${item.version}` : item.windsurfMax || '客户端'}
                    <span className="ml-2 text-xs text-mute">{item.size}</span>
                    {item.recommended ? (
                      <span className="ml-2 rounded-full bg-volt/10 px-2 py-0.5 text-[10px] text-volt">
                        当前推荐
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-xs text-mute">
                    {item.releasedAt ? `发布于 ${item.releasedAt} · ` : ''}
                    {item.windsurfMax}
                  </p>
                  {item.notes ? <p className="mt-1 text-xs text-mute">{item.notes}</p> : null}
                </div>
                {item.url ? (
                  <a
                    href={item.url}
                    className="inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2 text-sm text-white no-underline"
                  >
                    <DownloadIcon size={14} />
                    下载 {item.windsurfMax || '客户端'}
                  </a>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full bg-volt px-4 py-2 text-sm text-white"
                    onClick={() => trigger(`v${item.version}`, item.url)}
                  >
                    <DownloadIcon size={14} />
                    下载 {item.windsurfMax || '客户端'}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        <ComingSoon open={Boolean(soon)} title={soon ? `下载 ${soon}` : '下载'} onClose={() => setSoon('')} />
      </div>
    </div>
  )
}
