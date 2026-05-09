'use client'
import { useState } from 'react'
import { Button } from './ui'

interface Props { onClose: () => void }

export default function ShareModal({ onClose }: Props) {
  const [copied, setCopied] = useState(false)
  const url = typeof window !== 'undefined' ? window.location.href : 'https://your-app.vercel.app'

  const copy = async () => {
    await navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const field = 'w-full bg-[#1e2028] border border-white/10 rounded-lg text-[12px] px-3 py-2.5 text-[var(--accent)] font-mono focus:outline-none focus:border-[var(--accent)]'

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-[#16181d] border border-white/10 rounded-[14px] p-6 w-full max-w-md fade-in"
           onClick={e => e.stopPropagation()}>
        <div className="font-serif text-[19px] mb-1">Share Household OS</div>
        <div className="text-[13px] text-[var(--muted)] mb-5">
          Send this link to any household member. They can view and add entries in real time.
        </div>

        <div className="mb-4">
          <label className="block text-[11px] text-[var(--muted)] uppercase tracking-[0.05em] mb-1.5">Shareable link</label>
          <input readOnly className={field} value={url} />
        </div>

        <div className="bg-[var(--accent-dim)] border border-[rgba(200,240,100,0.15)] rounded-lg p-3.5 mb-5">
          <div className="text-[12px] text-[var(--accent)] font-medium mb-1">How sharing works</div>
          <ul className="text-[12px] text-[rgba(200,240,100,0.7)] space-y-0.5 list-disc list-inside">
            <li>Anyone with this link can view all data</li>
            <li>Members can add and update entries</li>
            <li>Changes sync live — no refresh needed</li>
            <li>Add password protection via Vercel env vars</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={onClose} variant="ghost">Close</Button>
          <Button onClick={copy} variant="accent">{copied ? '✓ Copied!' : 'Copy link'}</Button>
        </div>
      </div>
    </div>
  )
}
