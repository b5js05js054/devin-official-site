import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import { Link } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

const linkClass =
  'font-medium text-volt underline decoration-volt/30 underline-offset-4 transition hover:decoration-volt'

const components: Components = {
  h1: ({ children }) => <h1 className="font-display text-3xl text-ink">{children}</h1>,
  h2: ({ children }) => <h2 className="pt-2 font-display text-2xl text-ink">{children}</h2>,
  h3: ({ children }) => <h3 className="pt-1 font-display text-xl text-ink">{children}</h3>,
  h4: ({ children }) => <h4 className="font-display text-lg text-ink">{children}</h4>,
  p: ({ children }) => <p>{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-ink">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  del: ({ children }) => <del className="text-mute line-through">{children}</del>,
  a: ({ href = '', children }) => {
    if (href.startsWith('/') && !href.startsWith('//')) {
      return (
        <Link to={href} className={linkClass}>
          {children}
        </Link>
      )
    }
    return (
      <a href={href} target="_blank" rel="noreferrer" className={linkClass}>
        {children}
      </a>
    )
  },
  img: ({ src, alt, title }) => (
    <span className="my-5 block">
      <img
        src={typeof src === 'string' ? src : undefined}
        alt={alt ?? ''}
        loading="lazy"
        className="max-h-[640px] max-w-full rounded-2xl border border-line bg-surface"
      />
      {title ? <span className="mt-2 block text-center text-xs text-mute">{title}</span> : null}
    </span>
  ),
  ul: ({ children }) => <ul className="list-disc space-y-1.5 pl-5 marker:text-volt/50">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-1.5 pl-5 marker:text-volt/50">{children}</ol>,
  li: ({ children }) => <li className="pl-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="rounded-r-xl border-l-2 border-volt/50 bg-volt/5 py-2 pl-4 pr-3 text-mute italic">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-line" />,
  pre: ({ children }) => (
    <pre className="overflow-x-auto rounded-2xl border border-line bg-sunk p-4 text-[13px] leading-6 text-ink [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-inherit">
      {children}
    </pre>
  ),
  code: ({ className, children }) => (
    <code
      className={
        className
          ? `font-mono text-[13px] ${className}`
          : 'rounded bg-sunk px-1.5 py-0.5 font-mono text-[13px] text-volt'
      }
    >
      {children}
    </code>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-sunk text-ink">{children}</thead>,
  th: ({ children }) => <th className="px-4 py-2.5 font-medium">{children}</th>,
  td: ({ children }) => <td className="border-t border-line px-4 py-2.5 align-top">{children}</td>,
  input: (props) => <input {...props} className="mr-2 align-middle accent-[#2446ff]" />,
}

export function Markdown({ source }: { source: string }) {
  return (
    <div className="space-y-4 text-[15px] leading-7 text-mute">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {source}
      </ReactMarkdown>
    </div>
  )
}
