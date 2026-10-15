export function ComingSoon({
  open,
  title,
  onClose,
}: {
  open: boolean
  title: string
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 px-4"
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-sm rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">即将开放</p>
        <h3 className="mt-2 font-display text-2xl">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-mute">
          用户注册、登录与充值会接到现有卡密与钱包系统。这一期官网先把计费规则、下载和文档讲清楚。
        </p>
        <button
          type="button"
          className="mt-5 w-full rounded-full bg-leaf px-4 py-2.5 text-sm font-medium text-petal"
          onClick={onClose}
        >
          知道了
        </button>
      </div>
    </div>
  )
}
