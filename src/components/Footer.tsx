import { Link } from 'react-router-dom'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-mute">
            Devin hub 提供 Windsurf 连接、模型调度与用量管理。钱包按量，请求过程可回看。
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">产品</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="text-mute no-underline hover:text-ink" to="/pricing">
                计费说明
              </Link>
            </li>
            <li>
              <Link className="text-mute no-underline hover:text-ink" to="/downloads">
                下载中心
              </Link>
            </li>
            <li>
              <Link className="text-mute no-underline hover:text-ink" to="/guide">
                使用指南
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">支持</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link className="text-mute no-underline hover:text-ink" to="/guide/faq">
                常见问题
              </Link>
            </li>
            <li>
              <Link className="text-mute no-underline hover:text-ink" to="/guide/billing">
                计费说明
              </Link>
            </li>
            <li>
              <Link className="text-mute no-underline hover:text-ink" to="/admin">
                内容后台
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">关于</p>
          <p className="mt-4 text-sm leading-6 text-mute">
            单文件 Go 中继，无第三方运行时依赖。协议适配、卡密、审核与结算在同一条链路上完成。
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-mute">
          © {new Date().getFullYear()} Devin hub · 充值档与倍率可在内容后台修改
        </p>
      </div>
    </footer>
  )
}
