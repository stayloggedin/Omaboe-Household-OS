'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase, rebindSupabaseClient, type Entry, type Member, type Alert, type Module } from '@/lib/supabase'
import Sidebar, { type NavPage } from '@/components/Sidebar'
import AddEntryModal from '@/components/AddEntryModal'
import ShareModal from '@/components/ShareModal'
import { Button } from '@/components/ui'
import {
  OverviewPage, ActivityPage, UtilitiesPage, VehiclesPage,
  FinancesPage, MaintenancePage, HealthPage,
} from '@/components/Pages'

const PAGE_TITLES: Record<NavPage, string> = {
  overview:    'Overview',
  activity:    'Activity log',
  utilities:   'Utilities',
  vehicles:    'Vehicles',
  finances:    'Finances',
  maintenance: 'Maintenance',
  health:      'Home health',
}

export default function Home() {
  const [page, setPage]       = useState<NavPage>('overview')
  const [entries, setEntries] = useState<Entry[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [alerts, setAlerts]   = useState<Alert[]>([])
  const [booted, setBooted]   = useState(false)
  const [hasConfig, setHasConfig] = useState(false)
  const [loading, setLoading] = useState(true)
  const [householdLabel, setHouseholdLabel] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [memberName]          = useState(() =>
    typeof window !== 'undefined' ? (localStorage.getItem('houseOS_name') || 'Emmanuel') : 'Emmanuel'
  )

  const fetchAll = useCallback(async () => {
    const [{ data: e }, { data: m }, { data: a }] = await Promise.all([
      supabase.from('entries').select('*').order('created_at', { ascending: false }),
      supabase.from('members').select('*').order('created_at'),
      supabase.from('alerts').select('*').order('created_at', { ascending: false }),
    ])
    if (e) setEntries(e as Entry[])
    if (m) setMembers(m as Member[])
    if (a) setAlerts(a as Alert[])
  }, [])

  // Load Supabase URL/key from server runtime env (Railway) — not only from the JS bundle.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const r = await fetch('/api/public-env')
        const j = await r.json()
        if (cancelled) return
        if (j.configured && j.url && j.anonKey) {
          rebindSupabaseClient(j.url, j.anonKey)
          setHouseholdLabel(typeof j.householdName === 'string' ? j.householdName : '')
          setHasConfig(true)
        } else {
          setHasConfig(false)
          setLoading(false)
        }
      } catch {
        if (!cancelled) {
          setHasConfig(false)
          setLoading(false)
        }
      } finally {
        if (!cancelled) setBooted(true)
      }
    })()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!booted || !hasConfig) return

    let cancelled = false
    ;(async () => {
      await fetchAll()
      if (!cancelled) setLoading(false)
    })()

    const chan = supabase
      .channel('household-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, () => { void fetchAll() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts' }, () => { void fetchAll() })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => { void fetchAll() })
      .subscribe()

    return () => {
      cancelled = true
      supabase.removeChannel(chan)
    }
  }, [booted, hasConfig, fetchAll])

  const alertCount       = alerts.filter(a => !a.resolved && a.module === 'vehicles').length
  const maintenanceCount = entries.filter(e => e.module === 'maintenance' && (e.status === 'overdue' || e.status === 'due_soon')).length

  const moduleEntries = (m: Module) => entries.filter(e => e.module === m)

  if (!booted || (hasConfig && loading)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="font-serif text-2xl mb-2">House<span style={{ color: 'var(--accent)' }}>OS</span></div>
          <div className="text-[var(--muted)] text-[13px]">Loading your household…</div>
        </div>
      </div>
    )
  }

  // BYPASS SUPABASE CHECK — Skip setup screen and show dashboard with empty data
  if (!hasConfig && false) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-xl rounded-[14px] border border-white/[0.07] bg-[#16181d] p-6 text-center">
          <h1 className="mb-2 font-serif text-2xl">
            House<span style={{ color: 'var(--accent)' }}>OS</span> setup required
          </h1>
          <p className="text-[13px] text-[var(--muted)]">
            Add <code className="text-[var(--accent)]">NEXT_PUBLIC_SUPABASE_URL</code> and{' '}
            <code className="text-[var(--accent)]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to this Railway service&apos;s
            variables, save, then refresh this page (a full redeploy is not required).
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100vh' }}>
      <Sidebar
        current={page}
        onChange={setPage}
        members={members}
        alertCount={alertCount}
        maintenanceCount={maintenanceCount}
        householdLabel={householdLabel}
      />

      <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0
        }}>
          <h1 style={{ fontFamily: '"DM Serif Display", serif', fontSize: 22, letterSpacing: '-0.02em' }}>
            {PAGE_TITLES[page]}
          </h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button onClick={() => setShowShare(true)} variant="ghost">Share link</Button>
            <Button onClick={() => setShowAdd(true)} variant="accent">+ Add entry</Button>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {page === 'overview'    && <OverviewPage entries={entries} alerts={alerts} />}
          {page === 'activity'    && <ActivityPage entries={entries} />}
          {page === 'utilities'   && <UtilitiesPage entries={moduleEntries('utilities')} />}
          {page === 'vehicles'    && <VehiclesPage entries={moduleEntries('vehicles')} />}
          {page === 'finances'    && <FinancesPage entries={moduleEntries('finances')} />}
          {page === 'maintenance' && <MaintenancePage entries={moduleEntries('maintenance')} />}
          {page === 'health'      && <HealthPage entries={moduleEntries('health')} />}
        </div>
      </div>

      {showAdd && (
        <AddEntryModal
          onClose={() => setShowAdd(false)}
          onSaved={fetchAll}
          memberName={memberName}
        />
      )}
      {showShare && <ShareModal onClose={() => setShowShare(false)} />}
    </div>
  )
}
