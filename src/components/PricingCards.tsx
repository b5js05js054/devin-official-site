import { Check } from 'lucide-react'
import { useState } from 'react'
import type { Plan } from '../types'
import { ComingSoon } from './ComingSoon'

export function PricingCards({ plans }: { plans: Plan[] }) {
  const [soon, setSoon] = useState(false)
  const visible = plans.filter((p) => p.published).sort((a, b) => a.sort - b.sort)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {visible.map((plan) => (
          <article
            key={plan.slug}
            className={`flex flex-col rounded-3xl border p-5 ${
              plan.highlighted
                ? 'border-volt bg-surface shadow-[0_0_0_1px_var(--color-volt),0_24px_48px_-24px_rgb(36_70_255/0.4)]'
                : 'border-line bg-surface'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg text-ink">充值 {plan.name}</h3>
              {plan.badge ? (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    plan.highlighted ? 'bg-volt text-white' : 'bg-sunk text-mute'
                  }`}
                >
                  {plan.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-4 font-display text-3xl text-ink">{plan.price}</p>
            <p className="mt-2 text-xs text-mute">{plan.description || '1:1 到账钱包'}</p>
            {plan.quotas.length ? (
              <div className="mt-4 space-y-2 border-t border-line pt-4">
                {plan.quotas.map((q) => (
                  <div key={q.label} className="flex items-baseline justify-between text-xs">
                    <span className="text-mute">{q.label}</span>
                    <span className="text-volt">
                      {q.value}
                      {q.note ? <span className="ml-1 text-mute">{q.note}</span> : null}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
            <ul className="mt-4 flex-1 space-y-2 text-sm text-mute">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check size={14} className="mt-1 shrink-0 text-volt" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setSoon(true)}
              className={`mt-6 rounded-full py-2.5 text-sm ${
                plan.highlighted ? 'bg-volt text-white' : 'border border-line text-ink hover:bg-sunk'
              }`}
            >
              充值到钱包
            </button>
          </article>
        ))}
      </div>
      <ComingSoon open={soon} title="充值" onClose={() => setSoon(false)} />
    </>
  )
}
