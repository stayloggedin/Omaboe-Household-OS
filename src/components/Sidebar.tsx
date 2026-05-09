'use client'
import clsx from 'clsx'
import { type Member } from '@/lib/supabase'

export type NavPage = 'overview' | 'activity' | 'utilities' | 'vehicles' | 'finances' | 'maintenance' | 'health'

interface Props {
  current: NavPage
  onChange: (p: NavPage) => void
  members: Member[]
  alertCount: number
  maintenanceCount: number
  /** From runtime env via /api/public-env; falls back to NEXT_PUBLIC_* or default. */
  householdLabel?: string
}

const NAV = [
  { id: 'overview',    label: 'Overview',      icon: GridIcon },
  { id: 'activity',    label: 'Activity log',  icon: ClockIcon },
  { id: 'utilities',   label: 'Utilities',     icon: BoltIcon },
  { id: 'vehicles',    label: 'Vehicles',      icon: CarIcon },
  { id: 'finances',    label: 'Finances',      icon: CardIcon },
  { id: 'maintenance', label: 'Maintenance',   icon: WrenchIcon },
  { id: 'health',      label: 'Home health',   icon: HeartIcon },
] as const

export default function Sidebar({ current, onChange, members, alertCount, maintenanceCount, householdLabel }: Props) {
  return (
    <aside className="flex flex-col bg-[var(--surface)] border-r border-white/[0.07] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/[0.07]">
        <div className="font-serif text-[18px] tracking-tight">
          House<span className="text-[var(--accent)]">OS</span>
        </div>
        <div className="text-[11px] text-[var(--muted)] font-mono tracking-[0.05em] mt-0.5">
          {householdLabel?.trim() || process.env.NEXT_PUBLIC_HOUSEHOLD_NAME || 'Shared household'} · Live
        </div>
      </div>

      {/* Members */}
      <div className="px-5 py-3.5 border-b border-white/[0.07]">
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.1em] mb-2">Members</div>
        <div className="flex items-center gap-1.5">
          {members.map(m => (
            <div key={m.id} title={m.name} className="relative">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[var(--surface)]"
                   style={{ background: m.color, color: isLight(m.color) ? '#000' : '#fff' }}>
                {m.initials}
              </div>
              {m.is_online && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[var(--accent)] border border-[var(--surface)] pulse-dot" />
              )}
            </div>
          ))}
          <span className="text-[11px] text-[var(--muted)] ml-1">
            {members.filter(m => m.is_online).length} online
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.1em] px-2 pt-1 pb-2">Dashboard</div>
        {NAV.slice(0, 2).map(item => <NavItem key={item.id} item={item} current={current} onChange={onChange} />)}
        <div className="text-[10px] text-[var(--muted)] uppercase tracking-[0.1em] px-2 pt-4 pb-2">Modules</div>
        {NAV.slice(2).map(item => (
          <NavItem key={item.id} item={item} current={current} onChange={onChange}
            badge={
              item.id === 'vehicles' && alertCount > 0 ? alertCount :
              item.id === 'maintenance' && maintenanceCount > 0 ? maintenanceCount : 0
            }
            badgeColor={item.id === 'vehicles' ? 'red' : 'amber'}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-white/[0.07]">
        <div className="flex items-center gap-2 text-[11px] text-[var(--muted)]">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] pulse-dot" />
          Live sync enabled
        </div>
      </div>
    </aside>
  )
}

function NavItem({ item, current, onChange, badge = 0, badgeColor = 'red' }: {
  item: typeof NAV[number]
  current: NavPage
  onChange: (p: NavPage) => void
  badge?: number
  badgeColor?: 'red' | 'amber'
}) {
  const active = current === item.id
  const Icon = item.icon
  return (
    <button onClick={() => onChange(item.id as NavPage)}
      className={clsx(
        'w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-[13.5px] transition-all duration-150 text-left',
        active ? 'bg-[var(--accent-dim)] text-[var(--accent)]' : 'text-[var(--muted)] hover:bg-[var(--surface2)] hover:text-white'
      )}>
      <Icon size={15} />
      <span className="flex-1">{item.label}</span>
      {badge > 0 && (
        <span className={clsx('text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
          badgeColor === 'red' ? 'bg-red-500 text-white' : 'bg-amber-400 text-black')}>
          {badge}
        </span>
      )}
    </button>
  )
}

// light color check
function isLight(hex: string) {
  const c = hex.replace('#','')
  const r = parseInt(c.slice(0,2),16), g = parseInt(c.slice(2,4),16), b = parseInt(c.slice(4,6),16)
  return (r*299+g*587+b*114)/1000 > 128
}

// Icons
function GridIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><rect x="1" y="1" width="6" height="6" rx="1.5" fill="currentColor"/><rect x="9" y="1" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/><rect x="1" y="9" width="6" height="6" rx="1.5" fill="currentColor" opacity=".5"/><rect x="9" y="9" width="6" height="6" rx="1.5" fill="currentColor"/></svg>
}
function ClockIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/><polyline points="8,4 8,8 11,10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
}
function BoltIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><path d="M9 1L3 9h5l-1 6 7-8H9L9 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
}
function CarIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><rect x="1" y="6" width="14" height="6" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M3 6l2-3h6l2 3" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/><circle cx="4.5" cy="12.5" r="1.5" fill="currentColor"/><circle cx="11.5" cy="12.5" r="1.5" fill="currentColor"/></svg>
}
function CardIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><rect x="1" y="3" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M1 7h14" stroke="currentColor" strokeWidth="1.5"/></svg>
}
function WrenchIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><path d="M10.5 1.5a3.5 3.5 0 0 1 .5 6.5L4.5 14.5a1.5 1.5 0 0 1-2-2L9 6a3.5 3.5 0 0 1 1.5-4.5Z" stroke="currentColor" strokeWidth="1.5"/></svg>
}
function HeartIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="opacity-70 flex-shrink-0"><path d="M8 13S2 9.14 2 5a3 3 0 0 1 6 0 3 3 0 0 1 6 0c0 4.14-6 8-6 8Z" stroke="currentColor" strokeWidth="1.5"/></svg>
}
