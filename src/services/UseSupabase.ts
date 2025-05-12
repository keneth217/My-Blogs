import {createClient} from '@supabase/supabase-js'

const supabaseUrl = "https://avpzeipppikuemhwqanl.supabase.co"

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2cHplaXBwcGlrdWVtaHdxYW5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcwNDQ0NDksImV4cCI6MjA2MjYyMDQ0OX0.IjTHkHxq6weBsAsCqWJRbBs6ESPodCaEvaIyn6D5WF4"


export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log(supabase)  // Should show your initialized clients