import { createClient } from '@supabase/supabase-js';
import type { Workflow } from '../types/index.js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!);

export async function saveWorkflow(workflow: Workflow): Promise<Workflow> {
  const { data, error } = await supabase
    .from('workflows')
    .insert([workflow])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getWorkflow(id: string): Promise<Workflow> {
  const { data, error } = await supabase.from('workflows').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function getWorkflowsCount(): Promise<{ total: number }> {
  const { count, error } = await supabase.from('workflows').select('*', { count: 'exact', head: true });
  if (error) throw error;
  return { total: count || 0 };
}

// Init DB (run once: supabase gen types typescript --local > src/types/supabase.ts for full types)