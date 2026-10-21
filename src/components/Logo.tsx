import { Link } from 'react-router-dom'

export function Logo({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 text-ink no-underline">
      <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#0b0b0d" />
        <path d="M46.55 40.40L39.27 36.20L39.27 27.80L46.55 23.60L53.82 27.80L53.82 36.20Z" fill="#ffffff" />
        <path d="M24.73 53.00L17.45 48.80L17.45 40.40L24.73 36.20L32.00 40.40L32.00 48.80Z" fill="#ffffff" />
        <path d="M24.73 27.80L17.45 23.60L17.45 15.20L24.73 11.00L32.00 15.20L32.00 23.60Z" fill="#ffffff" />
        <path d="M32.00 40.40L24.73 36.20L24.73 27.80L32.00 23.60L39.27 27.80L39.27 36.20Z" fill="#5b78ff" />
      </svg>
      <span className="leading-none">
        <span className="block font-display text-[17px]">DevinHub</span>
        {!compact ? (
          <span className="mt-0.5 block text-[11px] text-mute">
            Devin
          </span>
        ) : null}
      </span>
    </Link>
  )
}
