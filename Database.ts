import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function fetchTaskLogs() {
  const { data, error } = await supabase
    .from('task_logs')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

export async function addTaskLog(taskLog: {
  user_id: string;
  user_name: string;
  tool_name: string;
  task_description: string;
  task_type: string;
  date: string;
  timestamp: number;
}) {
  const { data, error } = await supabase
    .from('task_logs')
    .insert([taskLog])
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function updateUserGoal(userId: string, tasksTarget: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ tasks_target: tasksTarget })
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data?.[0];
}

export async function toggleBlueprint(userId: string, completed: boolean) {
  const { data, error } = await supabase
    .from('users')
    .update({ completed_writing_tone_blueprint: completed })
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data?.[0];
}
