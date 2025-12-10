export interface User {
  id: string;
  name: string;
  role: 'Owner' | 'Staff';
  avatar: string;
}

export interface WeeklyStats {
  week: string;
  tasksCompleted: number;
  hoursSaved: number;
  efficiencyScore: number; // 0-100
}

export interface UserData extends User {
  stats: WeeklyStats[];
  currentGoals: {
    tasksTarget: number;
    hoursTarget: number;
    deadline: string;
  };
  metrics: {
    totalTasks: number;
    totalHoursSaved: number;
    avgEfficiency: number;
    aiToolsUsed: string[];
    engagementScore: number; // 1-10
  };
  completedToneBlueprint: boolean; // New requirement
}

export interface ComparisonRow {
  metric: string;
  vic: string | number;
  kelly: string | number;
  maria: string | number;
  sandra: string | number;
}

export type TaskType = 'Drafting' | 'Research' | 'Review' | 'Communication' | 'Analysis' | 'Writing Tone Blueprint' | 'Other';

export interface TaskLog {
  id: string;
  userId: string;
  userName: string;
  toolName: string;
  taskDescription: string;
  taskType: TaskType;
  date: string;
  timeSaved: number; // Minutes
  timestamp: number;
}
