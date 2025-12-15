// AI Tools available for tracking
export const AI_TOOLS = [
  'Gemini',
  'Claude.ai',
  'NotebookLM',
  'CoCounsel',
  'ChatGPT Plus',
  'Legal Research AI',
  'Drafting Copilot',
  'Other'
] as const;

// Task type categories for AI usage
export const TASK_TYPES = [
  'Client Email/Letter',
  'Legal Research',
  'Document Drafting',
  'Document Review',
  'Case Analysis',
  'Writing Tone Blueprint',
  'Other'
] as const;

import { UserData, ComparisonRow, TaskLog } from './types';

export const USERS: UserData[] = [
  {
    id: '1',
    name: 'Vic',
    role: 'Owner',
    avatar: 'https://picsum.photos/id/1/200/200',
    stats: [],
    currentGoals: {
      tasksTarget: 10,
    },
    metrics: {
      totalTasks: 0,
      avgEfficiency: 0,
      aiToolsUsed: [],
      engagementScore: 0,
    },
    completedWritingToneBlueprint: false,
  },
  {
    id: '2',
    name: 'Kelly',
    role: 'Staff',
    avatar: 'https://picsum.photos/id/2/200/200',
    stats: [],
    currentGoals: {
      tasksTarget: 10,
    },
    metrics: {
      totalTasks: 0,
      avgEfficiency: 0,
      aiToolsUsed: [],
      engagementScore: 0,
    },
    completedWritingToneBlueprint: false,
  },
  {
    id: '3',
    name: 'Maria',
    role: 'Staff',
    avatar: 'https://picsum.photos/id/3/200/200',
    stats: [],
    currentGoals: {
      tasksTarget: 10,
    },
    metrics: {
      totalTasks: 0,
      avgEfficiency: 0,
      aiToolsUsed: [],
      engagementScore: 0,
    },
    completedWritingToneBlueprint: false,
  },
  {
    id: '4',
    name: 'Sandra',
    role: 'Staff',
    avatar: 'https://picsum.photos/id/4/200/200',
    stats: [],
    currentGoals: {
      tasksTarget: 10,
    },
    metrics: {
      totalTasks: 0,
      avgEfficiency: 0,
      aiToolsUsed: [],
      engagementScore: 0,
    },
    completedWritingToneBlueprint: false,
  },
];

export const INITIAL_COMPARISON_DATA: ComparisonRow[] = [
  { metric: 'AI Activities Logged (Total)', vic: 0, kelly: 0, maria: 0, sandra: 0 },
  { metric: 'Weekly Goal Progress', vic: '0/10', kelly: '0/10', maria: '0/10', sandra: '0/10' },
  { metric: 'Efficiency (%)', vic: '0%', kelly: '0%', maria: '0%', sandra: '0%' },
  { metric: 'Engagement Score (1-10)', vic: 0, kelly: 0, maria: 0, sandra: 0 },
];

export const INITIAL_TASK_LOGS: TaskLog[] = [];
