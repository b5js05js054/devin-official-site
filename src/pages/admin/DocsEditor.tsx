import {
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Quote,
  Table2,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useRef, useState, type ClipboardEvent, type DragEvent } from 'react'
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

function ToolButton({
  icon: Icon,
  title,
  onClick,
  disabled = false,
}: {
  icon: LucideIcon
  title: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg p-2 text-mute transition hover:bg-sunk hover:text-ink disabled:opacity-40"
    >
      <Icon size={15} />
    </button>
  )
}

export function DocsEditor() {
  const [docs, setDocs] = useState<DocItem[]>([])
  const [selected, setSelected] = useState<DocItem | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

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

  function insertText(text: string) {
    if (!selected) return
    const ta = textareaRef.current
    const start = ta?.selectionStart ?? selected.body.length
    const end = ta?.selectionEnd ?? start
    const next = selected.body.slice(0, start) + text + selected.body.slice(end)
    setSelected({ ...selected, body: next })
    requestAnimationFrame(() => {
      ta?.focus()
      const caret = start + text.length
      ta?.setSelectionRange(caret, caret)
    })
  }

  function wrapSelection(before: string, after: string, placeholder: string) {
    if (!selected) return
    const ta = textareaRef.current
    const start = ta?.selectionStart ?? selected.body.length
    const end = ta?.selectionEnd ?? start
    const picked = selected.body.slice(start, end) || placeholder
    const next = selected.body.slice(0, start) + before + picked + after + selected.body.slice(end)
    setSelected({ ...selected, body: next })
    requestAnimationFrame(() => {
      ta?.focus()
      ta?.setSelectionRange(start + before.length, start + before.length + picked.length)
    })
  }

  function prefixLines(prefix: string) {
    if (!selected) return
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const lineStart = selected.body.lastIndexOf('\n', start - 1) + 1
    const lineEnd = selected.body.indexOf('\n', end)
    const blockEnd = lineEnd === -1 ? selected.body.length : lineEnd
    const lines = selected.body.slice(lineStart, blockEnd).split('\n').map((line) => (line ? prefix + line : line))
    const joined = lines.join('\n')
    setSelected({ ...selected, body: selected.body.slice(0, lineStart) + joined + selected.body.slice(blockEnd) })
    requestAnimationFrame(() => {
      ta.focus()
      ta.setSelectionRange(lineStart, lineStart + joined.length)
    })
  }

  function insertLink() {
    if (!selected) return
    const url = window.prompt('链接地址（https://… 或站内路径 /guide/…）')
    if (!url) return
    wrapSelection('[', `](${url})`, '链接文字')
  }

  async function uploadImage(file: File) {
    if (!selected) return
    if (!file.type.startsWith('image/')) {
      setError('只支持图片文件')
      return
    }
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch('/api/admin/uploads', { method: 'POST', body: form, credentials: 'include' })
      const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !data.url) throw new Error(data.error || '上传失败')
      const alt = file.name.replace(/\.[^.]+$/, '')
      insertText(`![${alt}](${data.url})`)
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败')
    } finally {
      setUploading(false)
    }
  }

  function onPaste(event: ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith('image/'))
    if (!file) return
    event.preventDefault()
    void uploadImage(file)
  }

  function onDrop(event: DragEvent<HTMLTextAreaElement>) {
    const file = Array.from(event.dataTransfer.files).find((item) => item.type.startsWith('image/'))
    if (!file) return
    event.preventDefault()
    void uploadImage(file)
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

          <div className="mt-4 rounded-2xl border border-line bg-surface">
            <div className="flex flex-wrap items-center gap-1 border-b border-line px-3 py-2">
              <ToolButton icon={Bold} title="加粗" onClick={() => wrapSelection('**', '**', '粗体')} />
              <ToolButton icon={Italic} title="斜体" onClick={() => wrapSelection('*', '*', '斜体')} />
              <span className="mx-1 h-5 w-px bg-line" />
              <ToolButton icon={Heading2} title="二级标题" onClick={() => prefixLines('## ')} />
              <ToolButton icon={Heading3} title="三级标题" onClick={() => prefixLines('### ')} />
              <ToolButton icon={List} title="无序列表" onClick={() => prefixLines('- ')} />
              <ToolButton icon={ListOrdered} title="有序列表" onClick={() => prefixLines('1. ')} />
              <ToolButton icon={Quote} title="引用" onClick={() => prefixLines('> ')} />
              <span className="mx-1 h-5 w-px bg-line" />
              <ToolButton icon={Code2} title="代码" onClick={() => wrapSelection('`', '`', '代码')} />
              <ToolButton icon={Link2} title="插入链接" onClick={insertLink} />
              <ToolButton icon={ImagePlus} title="上传图片" onClick={() => fileRef.current?.click()} disabled={uploading} />
              <ToolButton
                icon={Table2}
                title="插入表格"
                onClick={() => insertText('\n| 列 1 | 列 2 |\n| --- | --- |\n| 内容 | 内容 |\n')}
              />
              <ToolButton icon={Minus} title="分隔线" onClick={() => insertText('\n---\n')} />
              <span className="ml-auto flex items-center gap-1 text-xs text-mute">
                {uploading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" /> 图片上传中…
                  </>
                ) : (
                  '支持 Markdown · 可粘贴/拖入图片'
                )}
              </span>
            </div>
            <div className="grid gap-4 p-4 lg:grid-cols-2">
              <textarea
                ref={textareaRef}
                className="min-h-[420px] rounded-2xl border border-line bg-paper p-4 font-mono text-[13px] leading-6 text-ink outline-none"
                value={selected.body}
                onChange={(e) => setSelected({ ...selected, body: e.target.value })}
                onPaste={onPaste}
                onDrop={onDrop}
                placeholder="正文支持 Markdown。图片可点工具栏上传，或直接粘贴/拖进来；链接写成 [文字](https://…)。"
              />
              <div className="min-h-[420px] overflow-auto rounded-2xl border border-line bg-paper p-4">
                <p className="mb-3 text-xs text-mute">预览</p>
                <Markdown source={selected.body || '还没有内容'} />
              </div>
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void uploadImage(file)
              e.target.value = ''
            }}
          />
          <SaveBar message={message} error={error} pending={pending} onSave={save} />
          {selected.id ? (
            <button type="button" onClick={remove} className="mt-4 text-sm text-flare">
              删除此文档
            </button>
          ) : null}
        </div>
      ) : (
        <p className="text-sm text-mute">选择一篇文档编辑。正文支持 Markdown，可插入图片和链接。</p>
      )}
    </div>
  )
}
