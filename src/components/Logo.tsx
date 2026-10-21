import { Link } from 'react-router-dom'

export function Logo({ to = '/', compact = false }: { to?: string; compact?: boolean }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 text-ink no-underline">
      <svg width="28" height="28" viewBox="0 0 64 64" fill="none" aria-hidden>
        <rect width="64" height="64" rx="14" fill="#17282b" />
        <path
          fill="#d8f0e8"
          fillRule="evenodd"
          d="M32 8.25 52.57 20.12 52.57 43.88 32 55.75 11.43 43.88 11.43 20.12Z M32 16 45.86 24 45.86 40 32 48 18.14 40 18.14 24Z"
        />
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
