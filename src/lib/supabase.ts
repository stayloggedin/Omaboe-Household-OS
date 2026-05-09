import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

if (!isSupabaseConfigured) {
  // Keep builds from crashing when env vars are not set yet.
  // The UI will surface setup guidance instead of failing at build-time.
  console.warn(
    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. App will run in setup mode until configured.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-anon-key'
)

// Types
export type Module = 'utilities' | 'vehicles' | 'finances' | 'maintenance' | 'health'
export type Status = 'done' | 'due_soon' | 'overdue' | 'scheduled' | 'info' | 'paid' | 'unpaid'
export type Priority = 'high' | 'medium' | 'low'

export interface Entry {
  id: string
  module: Module
  title: string
  description?: string
  amount?: string
  status: Status
  due_date?: string
  added_by: string
  created_at: string
  updated_at: string
}

export interface Member {
  id: string
  name: string
  initials: string
  color: string
  is_online: boolean
  created_at: string
}

export interface Alert {
  id: string
  entry_id?: string
  module: Module
  title: string
  priority: Priority
  resolved: boolean
  created_at: string
}
