import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

// Database types
export interface Article {
  id: string
  title: string
  author_name: string
  agency_contact: string
  kol_name: string
  kol_credentials: string
  body: string
  therapeutic_area: string
  target_audience: string
  article_type: string
  image_url?: string
  status: 'pending_review' | 'approved' | 'rejected'
  created_at: string
}

export interface Interview {
  id: string
  article_id: string
  kol_id: string
  scheduled_time: string
  duration: number
  payment_status: 'pending' | 'paid' | 'failed'
  created_at: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'agency'
  created_at: string
}
