import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://vcgdogpquwlfpmtlermp.supabase.co" // Based on the JWT ref provided
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjZ2RvZ3BxdXdsZnBtdGxlcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxOTc4MjMsImV4cCI6MjA5MTc3MzgyM30.YX08IemJhclIgJWQqj9uv2qF8dA8csJpe06-IqrxO64"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
