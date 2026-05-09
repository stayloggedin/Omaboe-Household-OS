import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const initialUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const initialKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** True after build-time env and/or `rebindSupabaseClient` (runtime Railway env). */
export let isSupabaseConfigured = Boolean(initialUrl && initialKey)

export let supabase: SupabaseClient = createClient(
  initialUrl || 'https://placeholder.supabase.co',
  initialKey || 'placeholder-anon-key'
)

export function rebindSupabaseClient(url: string, anonKey: string): void {
  supabase = createClient(url, anonKey)
  isSupabaseConfigured = true
}

if (!initialUrl || !initialKey) {
  console.warn(
    'NEXT_PUBLIC_SUPABASE_* not set at build time; client loads config from /api/public-env at runtime.'
  )
}

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
