import type { StatItem } from '../types'

export function StatBar({ stats }: { stats: StatItem[] }) {
  return (
    <div className="border-y border-line bg-surface">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-6 py-10 ${i < stats.length - 1 ? 'md:border-r md:border-line' : ''}`}
          >
            <p className="font-display text-4xl text-volt md:text-5xl">{s.value}</p>
            <p className="mt-2 text-sm text-mute">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
