import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdjaeolqrnpiigrkhlst.supabase.co';
const supabaseKey = 'sb_secret_j9-QwNA_-Yui5QlRwNh1rw_KddCtDU0';

export const db = createClient(supabaseUrl, supabaseKey);