import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vdjaeolqrnpiigrkhlst.supabase.co';
const supabaseKey = 'sb_publishable_3-hryRjRCYYxFkikqmioDQ_lsrAhGru';

export const db = createClient(supabaseUrl, supabaseKey);