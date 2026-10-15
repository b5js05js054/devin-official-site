function inline(text: string) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-ink-3 px-1.5 py-0.5 font-mono text-[13px] text-mint">
          {part.slice(1, -1)}
        </code>
      )
    }
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-medium text-petal">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function Markdown({ source }: { source: string }) {
  const blocks = source.trim().split(/\n\n+/)
  return (
    <div className="space-y-4 text-[15px] leading-7 text-mute">
      {blocks.map((block, i) => {
        const lines = block.split('\n')
        if (lines.every((l) => l.startsWith('- '))) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((l) => (
                <li key={l}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          )
        }
        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol key={i} className="list-decimal space-y-1 pl-5">
              {lines.map((l) => (
                <li key={l}>{inline(l.replace(/^\d+\.\s/, ''))}</li>
              ))}
            </ol>
          )
        }
        if (block.startsWith('### ')) return <h3 key={i} className="font-display text-xl text-petal">{inline(block.slice(4))}</h3>
        if (block.startsWith('## ')) return <h2 key={i} className="font-display text-2xl text-petal">{inline(block.slice(3))}</h2>
        if (block.startsWith('# ')) return <h1 key={i} className="font-display text-3xl text-petal">{inline(block.slice(2))}</h1>
        return <p key={i}>{inline(block.replaceAll('\n', ' '))}</p>
      })}
    </div>
  )
}
