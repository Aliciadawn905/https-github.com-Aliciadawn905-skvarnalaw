import { supabase } from './supabaseClient';
import { UserData, WeeklyStats, TaskLog } from './types';

// Fetch all users with their stats
export async function fetchUsers(): Promise<UserData[]> {
  try {
    // Fetch users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('id');

    if (usersError) throw usersError;

    // Fetch weekly stats for all users
    const { data: weeklyStats, error: statsError } = await supabase
      .from('weekly_stats')
      .select('*')
      .order('week');

    if (statsError) throw statsError;

    // Combine data into UserData format
    return users.map(user => {
      const userStats = weeklyStats
        .filter(stat => stat.user_id === user.id)
        .map(stat => ({
          week: stat.week,
          tasksCompleted: stat.tasks_completed,
          hoursSaved: stat.hours_saved,
          efficiencyScore: stat.efficiency_score,
        }));

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        stats: userStats,
        currentGoals: {
          tasksTarget: user.tasks_target,
          hoursTarget: user.hours_target,
          deadline: user.deadline,
        },
        metrics: {
          totalTasks: user.total_tasks,
          totalHoursSaved: user.total_hours_saved,
          avgEfficiency: user.avg_efficiency,
          aiToolsUsed: user.ai_tools_used || [],
          engagementScore: user.engagement_score,
        },
        completedToneBlueprint: user.completed_tone_blueprint,
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

// Fetch all task logs
export async function fetchTaskLogs(): Promise<TaskLog[]> {
  try {
    const { data, error } = await supabase
      .from('task_logs')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) throw error;

    return data.map(log => ({
      id: log.id,
      userId: log.user_id,
      userName: log.user_name,
      toolName: log.tool_name,
      taskDescription: log.task_description,
      taskType: log.task_type,
      date: log.date,
      timeSaved: log.time_saved,
      timestamp: log.timestamp,
    }));
  } catch (error) {
    console.error('Error fetching task logs:', error);
    throw error;
  }
}

// Add a new task log
export async function addTaskLog(log: TaskLog): Promise<void> {
  try {
    const { error } = await supabase.from('task_logs').insert({
      id: log.id,
      user_id: log.userId,
      user_name: log.userName,
      tool_name: log.toolName,
      task_description: log.taskDescription,
      task_type: log.taskType,
      date: log.date,
      time_saved: log.timeSaved,
      timestamp: log.timestamp,
    });

    if (error) throw error;

    // Update user's total tasks and hours saved
    await updateUserMetrics(log.userId);
  } catch (error) {
    console.error('Error adding task log:', error);
    throw error;
  }
}

// Update user metrics after adding a task
async function updateUserMetrics(userId: string): Promise<void> {
  try {
    // Get all task logs for this user
    const { data: logs, error: logsError } = await supabase
      .from('task_logs')
      .select('time_saved')
      .eq('user_id', userId);

    if (logsError) throw logsError;

    const totalTasks = logs.length;
    const totalHours = logs.reduce((sum, log) => sum + log.time_saved, 0);

    // Update user's metrics
    const { error: updateError } = await supabase
      .from('users')
      .update({
        total_tasks: totalTasks,
        total_hours_saved: totalHours,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating user metrics:', error);
    throw error;
  }
}

// Update user goal
export async function updateUserGoal(
  userId: string,
  type: 'tasksTarget' | 'hoursTarget' | 'deadline',
  value: any
): Promise<void> {
  try {
    const fieldMap = {
      tasksTarget: 'tasks_target',
      hoursTarget: 'hours_target',
      deadline: 'deadline',
    };

    const { error } = await supabase
      .from('users')
      .update({
        [fieldMap[type]]: value,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating user goal:', error);
    throw error;
  }
}

// Toggle blueprint completion
export async function toggleBlueprint(userId: string): Promise<void> {
  try {
    // Get current value
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('completed_tone_blueprint')
      .eq('id', userId)
      .single();

    if (fetchError) throw fetchError;

    // Toggle it
    const { error: updateError } = await supabase
      .from('users')
      .update({
        completed_tone_blueprint: !user.completed_tone_blueprint,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error toggling blueprint:', error);
    throw error;
  }
}
