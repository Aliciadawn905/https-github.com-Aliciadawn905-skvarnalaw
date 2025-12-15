export interface UserData {
  id: string;
  name: string;
  role: 'Owner' | 'Staff';
  avatar: string;
  stats: WeeklyStats[];
  currentGoals: {
    tasksTarget: number;
    hoursTarget?: number;
    deadline?: string;
  };
  metrics: {
    totalTasks: number;
    totalHoursSaved?: number;
    avgEfficiency: number;
    aiToolsUsed: string[];
    engagementScore: number;
  };
  completedWritingToneBlueprint?: boolean;
  completedToneBlueprint?: boolean;
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
  timeSaved?: number; // Time saved in minutes
}

export interface ComparisonRow {
  metric: string;
  vic: number | string;
  kelly: number | string;
  maria: number | string;
  sandra: number | string;
}

export type View = 'dashboard' | 'comparison' | 'individual' | 'leaderboard' | 'entry';

export type TaskType = 'Client Email/Letter' | 'Legal Research' | 'Document Drafting' | 'Document Review' | 'Case Analysis' | 'Writing Tone Blueprint' | 'Other';
