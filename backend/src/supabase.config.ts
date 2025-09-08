import { createClient } from '@supabase/supabase-js';

const supabase = createClient(String(process.env.SUPABASE_URL), String(process.env.SUPABASE_ANON_KEY));
