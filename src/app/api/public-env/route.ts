import { NextResponse } from 'next/server'

/**
 * Exposes public Supabase settings from **runtime** env (Railway injects these
 * into the container). `NEXT_PUBLIC_*` in client bundles is baked at `next build`,
 * so Docker images built without those vars need this for the browser client.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  const householdName = process.env.NEXT_PUBLIC_HOUSEHOLD_NAME?.trim() || ''

  return NextResponse.json(
    {
      configured: Boolean(url && anonKey),
      url,
      anonKey,
      householdName,
    },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
