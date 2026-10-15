import { Link } from 'react-router-dom'

export function Logo({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 text-ink no-underline">
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-hidden>
        <rect width="32" height="32" rx="8" fill="#2446ff" />
        <path
          d="M10 8h7.2C22.4 8 26 11.6 26 16s-3.6 8-8.8 8H10V8zm3.6 3.1v9.8h3.7c2.9 0 4.9-2.1 4.9-4.9s-2-4.9-4.9-4.9h-3.7z"
          fill="#ffffff"
        />
        <rect x="8" y="8" width="2.2" height="16" rx="1" fill="#ffb38a" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[17px]">Devin hub</span>
        {!compact ? (
          <span className="mt-0.5 block text-[11px] text-mute">
            Windsurf
          </span>
        ) : null}
      </span>
    </Link>
  )
}
