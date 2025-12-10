import { UserData, ComparisonRow, TaskLog } from './types';

export const USERS: UserData[] = [
  {
    id: '1',
    name: 'Vic',
    role: 'Owner',
    avatar: 'https://picsum.photos/id/1/200/200',
    stats: [
      { week: 'Week 1', tasksCompleted: 12, hoursSaved: 5, efficiencyScore: 75 },
      { week: 'Week 2', tasksCompleted: 15, hoursSaved: 7, efficiencyScore: 82 },
      { week: 'Week 3', tasksCompleted: 18, hoursSaved: 10, efficiencyScore: 88 },
      { week: 'Week 4', tasksCompleted: 22, hoursSaved: 12, efficiencyScore: 92 },
    ],
    currentGoals: {
      tasksTarget: 100,
      hoursTarget: 50,
      deadline: '2025-12-31',
    },
    metrics: {
      totalTasks: 67,
      totalHoursSaved: 34,
      avgEfficiency: 84,
      aiToolsUsed: ['Legal Research AI', 'Drafting Copilot'],
      engagementScore: 9.5,
    },
    completedToneBlueprint: true,
  },
  {
    id: '2',
    name: 'Kelly',
    role: 'Staff',
    avatar: 'https://picsum.photos/id/2/200/200',
    stats: [
      { week: 'Week 1', tasksCompleted: 20, hoursSaved: 8, efficiencyScore: 80 },
      { week: 'Week 2', tasksCompleted: 25, hoursSaved: 12, efficiencyScore: 85 },
      { week: 'Week 3', tasksCompleted: 22, hoursSaved: 11, efficiencyScore: 84 },
      { week: 'Week 4', tasksCompleted: 30, hoursSaved: 15, efficiencyScore: 90 },
    ],
    currentGoals: {
      tasksTarget: 120,
      hoursTarget: 60,
      deadline: '2025-12-31',
    },
    metrics: {
      totalTasks: 97,
      totalHoursSaved: 46,
      avgEfficiency: 85,
      aiToolsUsed: ['Document Reviewer', 'Email Assistant'],
      engagementScore: 9.2,
    },
    completedToneBlueprint: true,
  },
  {
    id: '3',
    name: 'Maria',
    role: 'Staff',
    avatar: 'https://picsum.photos/id/3/200/200',
    stats: [
      { week: 'Week 1', tasksCompleted: 10, hoursSaved: 3, efficiencyScore: 60 },
      { week: 'Week 2', tasksCompleted: 12, hoursSaved: 4, efficiencyScore: 65 },
      { week: 'Week 3', tasksCompleted: 18, hoursSaved: 8, efficiencyScore: 78 },
      { week: 'Week 4', tasksCompleted: 20, hoursSaved: 9, efficiencyScore: 82 },
    ],
    currentGoals: {
      tasksTarget: 80,
      hoursTarget: 40,
      deadline: '2025-12-31',
    },
    metrics: {
      totalTasks: 60,
      totalHoursSaved: 24,
      avgEfficiency: 71,
      aiToolsUsed: ['Drafting Copilot'],
      engagementScore: 7.8,
    },
    completedToneBlueprint: false,
  },
  {
    id: '4',
    name: 'Sandra',
    role: 'Staff',
    avatar: 'https://picsum.photos/id/4/200/200',
    stats: [
      { week: 'Week 1', tasksCompleted: 30, hoursSaved: 15, efficiencyScore: 90 },
      { week: 'Week 2', tasksCompleted: 35, hoursSaved: 18, efficiencyScore: 95 },
      { week: 'Week 3', tasksCompleted: 32, hoursSaved: 16, efficiencyScore: 94 },
      { week: 'Week 4', tasksCompleted: 40, hoursSaved: 22, efficiencyScore: 98 },
    ],
    currentGoals: {
      tasksTarget: 150,
      hoursTarget: 80,
      deadline: '2025-12-31',
    },
    metrics: {
      totalTasks: 137,
      totalHoursSaved: 71,
      avgEfficiency: 94,
      aiToolsUsed: ['All Tools', 'Custom Macros'],
      engagementScore: 9.9,
    },
    completedToneBlueprint: true,
  },
];

export const INITIAL_COMPARISON_DATA: ComparisonRow[] = [
  { metric: 'Tasks Completed (Total)', vic: 67, kelly: 97, maria: 60, sandra: 137 },
  { metric: 'Hours Saved (Total)', vic: 34, kelly: 46, maria: 24, sandra: 71 },
  { metric: 'Avg Efficiency (%)', vic: '84%', kelly: '85%', maria: '71%', sandra: '94%' },
  { metric: 'Engagement Score (1-10)', vic: 9.5, kelly: 9.2, maria: 7.8, sandra: 9.9 },
  { metric: 'Current Goal Completion', vic: '67%', kelly: '80%', maria: '75%', sandra: '91%' },
];

export const INITIAL_TASK_LOGS: TaskLog[] = [
  { 
    id: '1', 
    userId: '4', 
    userName: 'Sandra', 
    toolName: 'Document Reviewer', 
    taskDescription: 'Analyzed 50-page contract for liability clauses.', 
    taskType: 'Review', 
    date: '2023-10-24', 
    timeSaved: 45,
    timestamp: 1698144000000 
  },
  { 
    id: '2', 
    userId: '2', 
    userName: 'Kelly', 
    toolName: 'Email Assistant', 
    taskDescription: 'Drafted responses to 15 client inquiries.', 
    taskType: 'Communication', 
    date: '2023-10-24', 
    timeSaved: 30,
    timestamp: 1698130000000 
  },
  { 
    id: '3', 
    userId: '1', 
    userName: 'Vic', 
    toolName: 'Legal Research AI', 
    taskDescription: 'Summarized recent case law regarding property disputes.', 
    taskType: 'Research', 
    date: '2023-10-23', 
    timeSaved: 60,
    timestamp: 1698054000000 
  },
  { 
    id: '4', 
    userId: '3', 
    userName: 'Maria', 
    toolName: 'Drafting Copilot', 
    taskDescription: 'Created initial draft of NDAs for new partners.', 
    taskType: 'Drafting', 
    date: '2023-10-23', 
    timeSaved: 90,
    timestamp: 1698040000000 
  },
];
