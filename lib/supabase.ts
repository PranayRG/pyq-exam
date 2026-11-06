import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cagocmqdnctmjdlyisih.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_qdcfYoUaw3XeMc7AK8YJaQ_a-yEOiCm'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

