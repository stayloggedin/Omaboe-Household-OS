import clsx from 'clsx'
import type { ReactNode } from 'react'
import { type Status, type Priority } from '@/lib/supabase'

// ── Status chip ─────────────────────────────────────────────
const STATUS_STYLES: Record<Status, string> = {
  done:      'bg-teal-500/15 text-teal-300',
  paid:      'bg-teal-500/15 text-teal-300',
  info:      'bg-blue-500/15 text-blue-300',
  scheduled: 'bg-blue-500/15 text-blue-300',
  due_soon:  'bg-amber-500/15 text-amber-300',
  unpaid:    'bg-amber-500/15 text-amber-300',
  overdue:   'bg-red-500/15 text-red-400',
}
const STATUS_LABELS: Record<Status, string> = {
  done: 'Done', paid: 'Paid', info: 'Info',
  scheduled: 'Scheduled', due_soon: 'Due soon',
  unpaid: 'Unpaid', overdue: 'Overdue',
}

export function Chip({ status }: { status: Status }) {
  return (
    <span className={clsx('text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}

// ── Priority badge ────────────────────────────────────────────
const PRIORITY_STYLES: Record<Priority, string> = {
  high:   'bg-red-500/15 text-red-400',
  medium: 'bg-amber-500/15 text-amber-300',
  low:    'bg-teal-500/15 text-teal-300',
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span className={clsx('text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full capitalize', PRIORITY_STYLES[priority])}>
      {priority}
    </span>
  )
}

// ── Section card ──────────────────────────────────────────────
export function SectionCard({ title, children, right }: {
  title: string
  children: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#16181d] mb-3.5 overflow-hidden">
      <div className="flex items-center justify-between px-[18px] py-3.5 border-b border-white/[0.07]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#8a8d96]">{title}</span>
        {right}
      </div>
      <div>{children}</div>
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────
export function StatCard({ label, value, sub, valueColor }: {
  label: string; value: string; sub?: string; valueColor?: string
}) {
  return (
    <div className="rounded-[14px] border border-white/[0.07] bg-[#16181d] p-4">
      <div className="text-[11px] uppercase tracking-[0.07em] text-[#8a8d96] mb-2">{label}</div>
      <div className="text-[26px] font-medium leading-none tracking-tight" style={{ color: valueColor || 'var(--text)' }}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-[#8a8d96] mt-1.5">{sub}</div>}
    </div>
  )
}

// ── Table row ─────────────────────────────────────────────────
export function Row({ icon, name, meta, value, right, iconBg }: {
  icon: string; name: string; meta?: string
  value?: string; right?: ReactNode; iconBg?: string
}) {
  return (
    <div className="flex items-center justify-between px-[18px] py-3 border-b border-white/[0.05] last:border-none">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-[6px] flex items-center justify-center text-[13px] flex-shrink-0"
          style={{ background: iconBg || 'rgba(91,163,245,0.12)', color: 'var(--blue)' }}>
          {icon}
        </div>
        <div>
          <div className="text-[13.5px] text-[var(--text)]">{name}</div>
          {meta && <div className="text-[11px] text-[var(--muted)]">{meta}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 text-right">
        {value && <span className="text-[13px] font-medium text-[var(--text)]">{value}</span>}
        {right}
      </div>
    </div>
  )
}

// ── Progress bar ──────────────────────────────────────────────
export function ProgressRow({ label, value, percent, color }: {
  label: string; value: string; percent: number; color?: string
}) {
  return (
    <div className="px-[18px] py-2.5 border-b border-white/[0.05] last:border-none">
      <div className="flex justify-between mb-1.5">
        <span className="text-[13px]">{label}</span>
        <span className="text-[13px] font-medium">{value}</span>
      </div>
      <div className="h-[5px] bg-[#1e2028] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(percent, 100)}%`, background: color || 'var(--teal)' }} />
      </div>
    </div>
  )
}

// ── Button ─────────────────────────────────────────────────────
export function Button({ children, onClick, variant = 'ghost', className, type = 'button' }: {
  children: ReactNode
  onClick?: () => void
  variant?: 'ghost' | 'accent' | 'danger'
  className?: string
  type?: 'button' | 'submit'
}) {
  const base = 'px-4 py-2 rounded-lg text-[12.5px] font-medium cursor-pointer transition-all duration-150 border font-sans'
  const variants = {
    ghost:  'bg-transparent border-white/20 text-[var(--muted)] hover:bg-white/5 hover:text-white',
    accent: 'bg-[var(--accent)] text-black border-transparent font-semibold hover:opacity-90',
    danger: 'bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25',
  }
  return (
    <button type={type} onClick={onClick} className={clsx(base, variants[variant], className)}>
      {children}
    </button>
  )
}
