import { createClient } from '@supabase/supabase-js';
import { UserData, TaskLog } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to transform database response to UserData format
function transformUserData(dbUser: any): UserData {
  return {
    id: dbUser.id || '',
    name: dbUser.name || '',
    role: dbUser.role || 'Staff',
    avatar: dbUser.avatar || '',
    stats: dbUser.stats || [],
    currentGoals: {
      tasksTarget: dbUser.tasks_target || dbUser.currentGoals?.tasksTarget || 10,
      hoursTarget: dbUser.hours_target || dbUser.currentGoals?.hoursTarget || 0,
      deadline: dbUser.deadline || dbUser.currentGoals?.deadline || '',
    },
    metrics: {
      totalTasks: dbUser.total_tasks || dbUser.metrics?.totalTasks || 0,
      totalHoursSaved: dbUser.total_hours_saved || dbUser.metrics?.totalHoursSaved || 0,
      avgEfficiency: dbUser.avg_efficiency || dbUser.metrics?.avgEfficiency || 0,
      aiToolsUsed: dbUser.ai_tools_used || dbUser.metrics?.aiToolsUsed || [],
      engagementScore: dbUser.engagement_score || dbUser.metrics?.engagementScore || 0,
    },
    completedWritingToneBlueprint: dbUser.completed_writing_tone_blueprint || dbUser.completedWritingToneBlueprint || false,
    completedToneBlueprint: dbUser.completed_tone_blueprint || dbUser.completedToneBlueprint || false,
  };
}

// Helper function to transform database response to TaskLog format
function transformTaskLogData(dbLog: any): TaskLog {
  return {
    id: dbLog.id || '',
    userId: dbLog.user_id || dbLog.userId || '',
    userName: dbLog.user_name || dbLog.userName || '',
    toolName: dbLog.tool_name || dbLog.toolName || '',
    taskDescription: dbLog.task_description || dbLog.taskDescription || '',
    taskType: dbLog.task_type || dbLog.taskType || '',
    date: dbLog.date || '',
    timestamp: dbLog.timestamp || 0,
  };
}

export async function fetchUsers(): Promise<UserData[]> {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return (data || []).map(transformUserData);
}

export async function fetchTaskLogs(): Promise<TaskLog[]> {
  const { data, error } = await supabase
    .from('task_logs')
    .select('*')
    .order('timestamp', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(transformTaskLogData);
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

export async function updateUserGoal(userId: string, type: 'tasksTarget' | 'hoursTarget' | 'deadline', value: any) {
  const fieldMap: { [key: string]: string } = {
    tasksTarget: 'tasks_target',
    hoursTarget: 'hours_target',
    deadline: 'deadline'
  };
  
  const dbField = fieldMap[type];
  const { data, error } = await supabase
    .from('users')
    .update({ [dbField]: value })
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
