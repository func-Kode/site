import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function getActivityLogs({ limit = 50, repo, username, event_type }: {
  limit?: number;
  repo?: string;
  username?: string;
  event_type?: string;
} = {}) {
  let query = supabase.from('activities').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(limit);

  if (repo) query = query.eq('repo', repo);
  if (username) query = query.eq('username', username);
  if (event_type) query = query.eq('event_type', event_type);

  const { data, error, count } = await query;
  if (error) {
    console.error('Error fetching activity logs:', error);
    return { data: [], count: 0, error };
  }
  return { data, count };
}
