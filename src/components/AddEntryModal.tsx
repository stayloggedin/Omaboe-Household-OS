'use client'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { supabase, type Module, type Status } from '@/lib/supabase'
import { Button } from './ui'

const MODULES: { value: Module; label: string }[] = [
  { value: 'utilities',    label: 'Utilities' },
  { value: 'vehicles',     label: 'Vehicles' },
  { value: 'finances',     label: 'Finances' },
  { value: 'maintenance',  label: 'Maintenance' },
  { value: 'health',       label: 'Home Health' },
]

const STATUSES: { value: Status; label: string }[] = [
  { value: 'info',      label: 'Info' },
  { value: 'done',      label: 'Done' },
  { value: 'paid',      label: 'Paid' },
  { value: 'unpaid',    label: 'Unpaid' },
  { value: 'due_soon',  label: 'Due soon' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'overdue',   label: 'Overdue' },
]

interface Props {
  onClose: () => void
  onSaved: () => void
  memberName?: string
  defaultModule?: Module
}

export default function AddEntryModal({ onClose, onSaved, memberName = 'Member', defaultModule }: Props) {
  const [form, setForm] = useState({
    module:      (defaultModule || 'utilities') as Module,
    title:       '',
    description: '',
    amount:      '',
    status:      'info' as Status,
    due_date:    '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Title is required'); return }
    setSaving(true)
    setError('')
    const { error: err } = await supabase.from('entries').insert({
      module:      form.module,
      title:       form.title.trim(),
      description: form.description.trim() || null,
      amount:      form.amount.trim() || null,
      status:      form.status,
      due_date:    form.due_date || null,
      added_by:    memberName,
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
    onClose()
  }

  const field = 'block w-full bg-[#1e2028] border border-white/10 rounded-lg text-[13.5px] px-3 py-2.5 text-white placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#16181d] border border-white/10 rounded-[14px] p-6 w-full max-w-md fade-in"
           onClick={e => e.stopPropagation()}>
        <div className="font-serif text-[19px] mb-1">Add new entry</div>
        <div className="text-[13px] text-[var(--muted)] mb-5">Visible to all household members instantly</div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Module</label>
            <select className={field} value={form.module}
              onChange={e => setForm(f => ({ ...f, module: e.target.value as Module }))}>
              {MODULES.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Title *</label>
            <input className={field} placeholder="e.g. ECG electricity bill — May 2026"
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>

          <div>
            <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Description</label>
            <input className={field} placeholder="Optional detail"
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Amount</label>
              <input className={field} placeholder="e.g. ₵680"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Status</label>
              <select className={field} value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as Status }))}>
                {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Due date (optional)</label>
            <input type="date" className={field}
              value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
          </div>

          {error && <p className="text-red-400 text-[12px]">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={onClose} variant="ghost">Cancel</Button>
            <Button type="submit" variant="accent">{saving ? 'Saving…' : 'Save entry'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
