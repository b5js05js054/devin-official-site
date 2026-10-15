import { NavLink, useParams } from 'react-router-dom'
import { Markdown } from '../components/Markdown'
import { useContent } from '../lib/content'

export function Guide() {
  const { docs } = useContent()
  const { slug } = useParams()
  const published = docs.filter((d) => d.published).sort((a, b) => a.sort - b.sort)
  const current = published.find((d) => d.slug === slug) ?? published[0]
  const groups = [...new Set(published.map((d) => d.groupName))]

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 lg:grid-cols-[240px_1fr]">
      <aside>
        <p className="font-display text-lg">使用指南</p>
        {groups.map((group) => (
          <div key={group} className="mt-6">
            <p className="text-xs text-mute">{group}</p>
            <ul className="mt-2 space-y-1">
              {published
                .filter((d) => d.groupName === group)
                .map((d) => (
                  <li key={d.slug}>
                    <NavLink
                      to={`/guide/${d.slug}`}
                      className={({ isActive }) =>
                        `block rounded-lg px-3 py-2 text-sm no-underline ${
                          (isActive || current?.slug === d.slug) && (!slug || slug === d.slug)
                            ? 'bg-volt/10 font-medium text-volt'
                            : 'text-mute hover:text-ink'
                        }`
                      }
                    >
                      {d.title}
                    </NavLink>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </aside>
      <article>
        {current ? (
          <>
            <p className="text-sm font-medium text-volt">{current.groupName}</p>
            <h1 className="mt-2 font-display text-4xl">{current.title}</h1>
            <div className="mt-8">
              <Markdown source={current.body} />
            </div>
          </>
        ) : (
          <p className="text-mute">暂无已发布文档</p>
        )}
      </article>
    </div>
  )
}
