import { createClient } from '@supabase/supabase-js';
import { UserData, TaskLog } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to calculate next Friday in MM/DD/YYYY format
function getNextFriday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday
  const daysUntilFriday = dayOfWeek <= 5 ? 5 - dayOfWeek : 7 - dayOfWeek + 5;
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + (daysUntilFriday || 7)); // If today is Friday, get next Friday
  
  const month = String(nextFriday.getMonth() + 1).padStart(2, '0');
  const day = String(nextFriday.getDate()).padStart(2, '0');
  const year = nextFriday.getFullYear();
  
  return `${month}/${day}/${year}`;
}

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
      deadline: getNextFriday(), // Always shows the next Friday
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
    timeSaved: dbLog.time_saved || dbLog.timeSaved || 0,
  };
}

export async function fetchUsers(): Promise<UserData[]> {
  // Fetch users
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('*')
    .order('name');
  
  if (usersError) throw usersError;
  
  // Fetch all task logs to calculate metrics
  const { data: logsData, error: logsError } = await supabase
    .from('task_logs')
    .select('*');
  
  if (logsError) throw logsError;
  
  // Calculate metrics for each user from their task logs
  const users = (usersData || []).map(dbUser => {
    const userLogs = (logsData || []).filter(log => log.user_id === dbUser.id);
    
    // Calculate total tasks and hours saved
    const totalTasks = userLogs.length;
    const totalHoursSaved = userLogs.reduce((sum, log) => sum + (log.time_saved || 0), 0) / 60; // Convert minutes to hours
    
    // Get unique tools used
    const aiToolsUsed = [...new Set(userLogs.map(log => log.tool_name))];
    
    // Check if Writing Tone Blueprint is completed
    const completedBlueprint = userLogs.some(log => 
      log.task_type === 'Writing Tone Blueprint' || 
      log.task_description?.toLowerCase().includes('writing tone blueprint')
    ) || dbUser.completed_writing_tone_blueprint || false;
    
    // Calculate engagement score (0-10 based on activity)
    const engagementScore = Math.min(10, Math.floor(totalTasks / 2));
    
    // Calculate average efficiency (placeholder - can be refined)
    const avgEfficiency = totalTasks > 0 ? Math.min(100, Math.round((totalHoursSaved / totalTasks) * 20)) : 0;
    
    return {
      ...transformUserData(dbUser),
      metrics: {
        totalTasks,
        totalHoursSaved: Math.round(totalHoursSaved * 10) / 10, // Round to 1 decimal
        avgEfficiency,
        aiToolsUsed,
        engagementScore,
      },
      completedWritingToneBlueprint: completedBlueprint,
    };
  });
  
  return users;
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
  id: string;
  user_id: string;
  user_name: string;
  tool_name: string;
  task_description: string;
  task_type: string;
  date: string;
  timestamp: number;
  time_saved?: number;
}) {
  console.log('Attempting to insert task log:', taskLog);
  
  const { data, error } = await supabase
    .from('task_logs')
    .insert([taskLog])
    .select();
  
  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to add log: ${error.message}`);
  }
  
  console.log('Task log inserted successfully:', data);
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
