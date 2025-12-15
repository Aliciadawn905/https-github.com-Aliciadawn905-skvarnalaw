import React, { useState } from 'react';
import { UserData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Send, Calendar, Target, Award, BookOpen, CheckSquare, Square, ChevronRight } from 'lucide-react';

interface IndividualBreakdownProps {
  users: UserData[];
  updateUserGoal: (userId: string, type: 'tasksTarget' | 'hoursTarget' | 'deadline', value: any) => void;
  toggleBlueprint: (userId: string) => void;
}

export const IndividualBreakdown: React.FC<IndividualBreakdownProps> = ({ users, updateUserGoal, toggleBlueprint }) => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const selectedUser = selectedUserId ? users.find(u => u.id === selectedUserId) : null;

  const handleGoalChange = (type: 'tasksTarget' | 'hoursTarget', val: string) => {
    if (!selectedUser) return;
    updateUserGoal(selectedUser.id, type, parseInt(val));
  };
  
  const handleDeadlineChange = (val: string) => {
    if (!selectedUser) return;
    updateUserGoal(selectedUser.id, 'deadline', val);
  };

  // If no user selected, show grid of all users
  if (!selectedUser) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="text-2xl font-bold text-skvarna-blue">Individual Progress</h2>
          <p className="text-skvarna-gray">Select a team member to view their detailed progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map(user => (
            <div 
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light hover:shadow-lg hover:border-skvarna-blue transition-all cursor-pointer group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-20 h-20 rounded-full border-4 border-skvarna-light group-hover:border-skvarna-yellow transition-colors object-cover"
                  />
                  <span className="absolute bottom-0 right-0 bg-skvarna-blue text-white text-xs px-2 py-1 rounded-full border-2 border-white">
                    {user.metrics.engagementScore}/10
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-skvarna-navy mb-1">{user.name}</h3>
                <p className="text-xs text-skvarna-gray mb-4">{user.role}</p>

                <div className="w-full space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-skvarna-gray">Total Tasks</span>
                    <span className="font-bold text-skvarna-blue">{user.metrics.totalTasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-skvarna-gray">Efficiency</span>
                    <span className="font-bold text-green-600">{user.metrics.avgEfficiency}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-skvarna-gray">Hours Saved</span>
                    <span className="font-bold text-skvarna-yellow">{user.metrics.totalHoursSaved || 0} hrs</span>
                  </div>
                </div>

                <div className="flex items-center text-skvarna-blue text-sm font-semibold group-hover:text-skvarna-navy">
                  View Details
                  <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Engagement Data for Pie Chart
  const engagementData = [
    { name: 'Active Usage', value: selectedUser.metrics.engagementScore * 10 },
    { name: 'Potential', value: 100 - (selectedUser.metrics.engagementScore * 10) },
  ];
  const COLORS = ['#215F8B', '#EBEFF2'];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => setSelectedUserId(null)}
            className="text-skvarna-blue hover:text-skvarna-navy mb-2 flex items-center text-sm font-medium"
          >
            ← Back to All Team Members
          </button>
          <h2 className="text-2xl font-bold text-skvarna-blue">Individual Breakdown</h2>
          <p className="text-skvarna-gray">Deep dive into personal progress and goals</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile & Quick Stats */}
        <div className="col-span-1 bg-white p-6 rounded-xl shadow-sm border border-skvarna-light flex flex-col items-center text-center">
            <div className="relative">
                <img 
                    src={selectedUser.avatar} 
                    alt={selectedUser.name} 
                    className="w-24 h-24 rounded-full border-4 border-skvarna-yellow mb-4 object-cover"
                />
                <span className="absolute bottom-4 right-0 bg-skvarna-blue text-white text-xs px-2 py-1 rounded-full border border-white">
                    {selectedUser.metrics.engagementScore}/10
                </span>
            </div>
            <h3 className="text-xl font-bold text-skvarna-navy">{selectedUser.name}</h3>
            <p className="text-sm text-skvarna-gray mb-6">{selectedUser.role}</p>

            <div className="w-full space-y-4">
                <div className="flex justify-between text-sm">
                    <span className="text-skvarna-gray">Total Tasks</span>
                    <span className="font-bold text-skvarna-blue">{selectedUser.metrics.totalTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-skvarna-gray">Efficiency</span>
                    <span className="font-bold text-green-600">{selectedUser.metrics.avgEfficiency}%</span>
                </div>
                
                {/* Blueprint Tracker */}
                <div className="bg-skvarna-light/30 rounded-lg p-3 border border-skvarna-light cursor-pointer hover:bg-skvarna-light/50 transition-colors"
                     onClick={() => toggleBlueprint(selectedUser.id)}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                             <BookOpen size={16} className="text-skvarna-navy" />
                             <span className="text-sm font-bold text-skvarna-navy">Writing Tone Blueprint</span>
                        </div>
                        {selectedUser.completedToneBlueprint || selectedUser.completedWritingToneBlueprint
                            ? <CheckSquare className="text-green-500" size={20} />
                            : <Square className="text-gray-300" size={20} />
                        }
                    </div>
                    <p className="text-xs text-left mt-1 text-gray-500">
                        {selectedUser.completedToneBlueprint || selectedUser.completedWritingToneBlueprint ? "Completed" : "Due: Dec 31"}
                    </p>
                </div>

                <div className="border-t border-skvarna-light pt-4">
                    <p className="text-xs text-skvarna-gray mb-2 uppercase tracking-wide font-bold">Tools Used</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {selectedUser.metrics.aiToolsUsed.map(tool => (
                            <span key={tool} className="bg-skvarna-light text-skvarna-navy text-xs px-2 py-1 rounded">
                                {tool}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Performance Chart */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light h-64">
                <h4 className="text-lg font-bold text-skvarna-navy mb-2">Weekly Efficiency Trend</h4>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedUser.stats}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEFF2" />
                        <XAxis dataKey="week" axisLine={false} tickLine={false} />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip />
                        <Line type="monotone" dataKey="efficiencyScore" stroke="#F7C355" strokeWidth={3} dot={{r: 4, fill:'#215F8B'}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Goal Management Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light">
                <div className="flex items-center space-x-2 mb-4">
                    <Target className="text-skvarna-blue" />
                    <h4 className="text-lg font-bold text-skvarna-navy">Goal Management</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1">Target Tasks</label>
                        <input 
                            type="number" 
                            value={selectedUser.currentGoals.tasksTarget}
                            onChange={(e) => handleGoalChange('tasksTarget', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-skvarna-navy focus:border-skvarna-blue outline-none"
                        />
                         <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                                className="bg-skvarna-blue h-1.5 rounded-full" 
                                style={{ width: `${Math.min((selectedUser.metrics.totalTasks / selectedUser.currentGoals.tasksTarget) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Progress: {Math.round((selectedUser.metrics.totalTasks / selectedUser.currentGoals.tasksTarget) * 100)}%</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1">Target Hours Saved</label>
                        <input 
                            type="number" 
                            value={selectedUser.currentGoals.hoursTarget || 0}
                            onChange={(e) => handleGoalChange('hoursTarget', e.target.value)}
                            className="w-full border border-gray-300 rounded p-2 text-skvarna-navy focus:border-skvarna-blue outline-none"
                        />
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                            <div 
                                className="bg-skvarna-yellow h-1.5 rounded-full" 
                                style={{ width: `${Math.min(((selectedUser.metrics.totalHoursSaved || 0) / (selectedUser.currentGoals.hoursTarget || 1)) * 100, 100)}%` }}
                            ></div>
                        </div>
                         <p className="text-xs text-gray-400 mt-1">Progress: {Math.round(((selectedUser.metrics.totalHoursSaved || 0) / (selectedUser.currentGoals.hoursTarget || 1)) * 100)}%</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1">Completion Deadline</label>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="date" 
                                value={selectedUser.currentGoals.deadline || ''}
                                onChange={(e) => handleDeadlineChange(e.target.value)}
                                className="w-full border border-gray-300 rounded p-2 text-skvarna-navy focus:border-skvarna-blue outline-none"
                            />
                        </div>
                        <button className="text-xs text-skvarna-blue mt-2 underline hover:text-skvarna-navy">
                            Extend Timeframe
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
