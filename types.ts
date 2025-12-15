export interface UserData {
  id: string;
  name: string;
  role: 'Owner' | 'Staff';
  avatar: string;
  stats: WeeklyStats[];
  currentGoals: {
    tasksTarget: number;
  };
  metrics: {
    totalTasks: number;
    avgEfficiency: number;
    aiToolsUsed: string[];
    engagementScore: number;
  };
  completedWritingToneBlueprint: boolean;
}

export interface WeeklyStats {
  week: string;
  tasksCompleted: number;
  efficiencyScore: number;
}

export interface TaskLog {
  id: string;
  userId: string;
  userName: string;
  toolName: string;
  taskDescription: string;
  taskType: string;
  date: string;
  timestamp: number;
}

export interface ComparisonRow {
  metric: string;
  vic: number | string;
  kelly: number | string;
  maria: number | string;
  sandra: number | string;
}

export type View = 'dashboard' | 'comparison' | 'individual' | 'leaderboard' | 'entry';
