'use client'
import { type Entry, type Alert } from '@/lib/supabase'
import { SectionCard, StatCard, Chip, PriorityBadge, Row, ProgressRow } from './ui'
import { format, parseISO } from 'date-fns'

function fmtDate(d?: string) {
  if (!d) return '—'
  try { return format(parseISO(d), 'MMM d, yyyy') } catch { return d }
}

// ── OVERVIEW ─────────────────────────────────────────────────
export function OverviewPage({ entries, alerts }: { entries: Entry[]; alerts: Alert[] }) {
  const totalSpend = entries
    .filter(e => e.amount)
    .reduce((sum, e) => {
      const n = parseFloat((e.amount || '').replace(/[^\d.]/g, ''))
      return sum + (isNaN(n) ? 0 : n)
    }, 0)

  const overdueCount = entries.filter(e => e.status === 'overdue').length
  const dueSoonCount = entries.filter(e => e.status === 'due_soon').length
  const activeAlerts = alerts.filter(a => !a.resolved)

  const budgets = [
    { label: 'Utilities',   color: '#4dd9ac' },
    { label: 'Vehicles',    color: '#ffb547' },
    { label: 'Finances',    color: '#c8f064' },
    { label: 'Maintenance', color: '#5ba3f5' },
    { label: 'Health',      color: '#ff6b6b' },
  ]

  return (
    <div className="fade-in">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <StatCard label="Total entries" value={String(entries.length)} sub="across all modules" />
        <StatCard label="Active alerts" value={String(activeAlerts.length)}
          sub={`${overdueCount} overdue · ${dueSoonCount} due soon`}
          valueColor={activeAlerts.length > 0 ? 'var(--red)' : 'var(--accent)'} />
        <StatCard label="Logged spend" value={`₵${totalSpend.toLocaleString()}`} sub="from amount entries" />
        <StatCard label="Members" value="3" sub="2 online now" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mb-3.5">
        <SectionCard title="Active alerts">
          {activeAlerts.length === 0
            ? <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No active alerts 🎉</div>
            : activeAlerts.map(a => (
              <div key={a.id} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] last:border-none">
                <div>
                  <div className="text-[13.5px]">{a.title}</div>
                  <div className="text-[11px] text-[var(--muted)] capitalize mt-0.5">{a.module}</div>
                </div>
                <PriorityBadge priority={a.priority} />
              </div>
            ))
          }
        </SectionCard>

        <SectionCard title="Module activity">
          {budgets.map(b => {
            const count = entries.filter(e => e.module === b.label.toLowerCase()).length
            const pct = entries.length > 0 ? Math.round(count / entries.length * 100) : 0
            return (
              <ProgressRow key={b.label} label={b.label}
                value={`${count} entries`} percent={pct} color={b.color} />
            )
          })}
        </SectionCard>
      </div>

      <SectionCard title="Recent entries">
        {entries.slice(0, 6).map(e => (
          <div key={e.id} className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05] last:border-none">
            <div>
              <div className="text-[13.5px]">{e.title}</div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5 capitalize">{e.module} · {e.added_by}</div>
            </div>
            <div className="flex items-center gap-2">
              {e.amount && <span className="text-[13px] font-medium">{e.amount}</span>}
              <Chip status={e.status} />
            </div>
          </div>
        ))}
        {entries.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No entries yet — add your first one above.</div>
        )}
      </SectionCard>
    </div>
  )
}

// ── ACTIVITY LOG ─────────────────────────────────────────────
export function ActivityPage({ entries }: { entries: Entry[] }) {
  const sorted = [...entries].sort((a, b) => b.created_at.localeCompare(a.created_at))
  return (
    <div className="fade-in">
      <SectionCard title={`All entries · ${sorted.length}`}>
        {sorted.map(e => (
          <div key={e.id} className="flex items-start gap-3 px-4 py-3 border-b border-white/[0.05] last:border-none">
            <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5"
                 style={{ background: '#5ba3f5', color: '#fff' }}>
              {e.added_by.slice(0,2).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[13.5px]">{e.title}</span>
                  {e.description && <span className="text-[12px] text-[var(--muted)] ml-1.5">— {e.description}</span>}
                </div>
                <Chip status={e.status} />
              </div>
              <div className="text-[11px] text-[var(--muted)] mt-0.5 font-mono">
                {e.added_by} · {e.module} · {fmtDate(e.created_at.split('T')[0])}
                {e.amount && <span className="ml-2 text-[var(--accent)]">{e.amount}</span>}
              </div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No activity yet.</div>
        )}
      </SectionCard>
    </div>
  )
}

// ── UTILITIES ─────────────────────────────────────────────────
export function UtilitiesPage({ entries }: { entries: Entry[] }) {
  const items = entries.filter(e => e.module === 'utilities')
  return (
    <div className="fade-in">
      <SectionCard title={`Utilities · ${items.length} entries`}>
        {items.map(e => (
          <Row key={e.id} icon="⚡" name={e.title} meta={e.description || (e.due_date ? `Due ${fmtDate(e.due_date)}` : undefined)}
            value={e.amount} right={<Chip status={e.status} />}
            iconBg="rgba(255,181,71,0.12)" />
        ))}
        {items.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No utility entries yet.</div>
        )}
      </SectionCard>
    </div>
  )
}

// ── VEHICLES ──────────────────────────────────────────────────
export function VehiclesPage({ entries }: { entries: Entry[] }) {
  const items = entries.filter(e => e.module === 'vehicles')
  const icons: Record<string, string> = { overdue: '🔧', due_soon: '🛡️', info: '🚗', done: '✅', scheduled: '📅', paid: '✅', unpaid: '📄' }
  const iconBgs: Record<string, string> = {
    overdue: 'rgba(255,107,107,0.12)', due_soon: 'rgba(255,181,71,0.12)',
    info: 'rgba(91,163,245,0.12)', done: 'rgba(77,217,172,0.12)',
  }
  return (
    <div className="fade-in">
      <SectionCard title={`Vehicles · ${items.length} entries`}>
        {items.map(e => (
          <Row key={e.id}
            icon={icons[e.status] || '🚗'}
            iconBg={iconBgs[e.status] || 'rgba(91,163,245,0.12)'}
            name={e.title}
            meta={e.description || (e.due_date ? `Expires / due ${fmtDate(e.due_date)}` : undefined)}
            value={e.amount}
            right={<Chip status={e.status} />}
          />
        ))}
        {items.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No vehicle entries yet.</div>
        )}
      </SectionCard>
    </div>
  )
}

// ── FINANCES ──────────────────────────────────────────────────
export function FinancesPage({ entries }: { entries: Entry[] }) {
  const items = entries.filter(e => e.module === 'finances')
  const totalAmount = items.reduce((s, e) => {
    const n = parseFloat((e.amount || '').replace(/[^\d.]/g, ''))
    return s + (isNaN(n) ? 0 : n)
  }, 0)
  return (
    <div className="fade-in">
      <div className="grid grid-cols-3 gap-3 mb-3.5">
        <StatCard label="Entries" value={String(items.length)} />
        <StatCard label="Total logged" value={`₵${totalAmount.toLocaleString()}`} />
        <StatCard label="Unpaid" value={String(items.filter(e => e.status === 'unpaid').length)}
          valueColor={items.filter(e => e.status === 'unpaid').length > 0 ? 'var(--amber)' : undefined} />
      </div>
      <SectionCard title="Financial entries">
        {items.map(e => (
          <Row key={e.id} icon="₵" name={e.title}
            meta={e.description || (e.due_date ? `Due ${fmtDate(e.due_date)}` : undefined)}
            value={e.amount} right={<Chip status={e.status} />}
            iconBg="rgba(200,240,100,0.1)" />
        ))}
        {items.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No finance entries yet.</div>
        )}
      </SectionCard>
    </div>
  )
}

// ── MAINTENANCE ───────────────────────────────────────────────
export function MaintenancePage({ entries }: { entries: Entry[] }) {
  const items = entries.filter(e => e.module === 'maintenance')
  const done   = items.filter(e => e.status === 'done')
  const active = items.filter(e => e.status !== 'done')
  const emojiMap: Record<string, string> = {
    overdue: '🔴', due_soon: '🟡', scheduled: '📅', info: '🔵', done: '✅', paid: '✅', unpaid: '⚪'
  }
  return (
    <div className="fade-in">
      {active.length > 0 && (
        <SectionCard title={`Due / active · ${active.length}`}>
          {active.map(e => (
            <Row key={e.id} icon={emojiMap[e.status] || '🔧'} name={e.title}
              meta={e.description || (e.due_date ? `Due ${fmtDate(e.due_date)}` : undefined)}
              right={<Chip status={e.status} />}
              iconBg={e.status === 'overdue' ? 'rgba(255,107,107,0.12)' : e.status === 'due_soon' ? 'rgba(255,181,71,0.12)' : 'rgba(91,163,245,0.12)'} />
          ))}
        </SectionCard>
      )}
      {done.length > 0 && (
        <SectionCard title={`Completed · ${done.length}`}>
          {done.map(e => (
            <Row key={e.id} icon="✅" name={e.title} meta={e.description}
              right={<Chip status={e.status} />} iconBg="rgba(77,217,172,0.12)" />
          ))}
        </SectionCard>
      )}
      {items.length === 0 && (
        <SectionCard title="Maintenance">
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No maintenance entries yet.</div>
        </SectionCard>
      )}
    </div>
  )
}

// ── HOME HEALTH ───────────────────────────────────────────────
export function HealthPage({ entries }: { entries: Entry[] }) {
  const items = entries.filter(e => e.module === 'health')
  return (
    <div className="fade-in">
      <SectionCard title={`Home health · ${items.length} entries`}>
        {items.map(e => (
          <Row key={e.id} icon="🏠" name={e.title}
            meta={e.description || (e.due_date ? `Next: ${fmtDate(e.due_date)}` : undefined)}
            right={<Chip status={e.status} />}
            iconBg="rgba(77,217,172,0.12)" />
        ))}
        {items.length === 0 && (
          <div className="px-4 py-8 text-center text-[13px] text-[var(--muted)]">No health entries yet.</div>
        )}
      </SectionCard>
    </div>
  )
}
