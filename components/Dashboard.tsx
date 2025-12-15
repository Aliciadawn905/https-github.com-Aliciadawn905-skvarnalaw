import React, { useState } from 'react';
import { UserData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Users, Clock, CheckCircle, Zap, Target, BookOpen, Edit2, Check } from 'lucide-react';

interface DashboardProps {
  users: UserData[];
  weeklyGoal: number;
  onUpdateGoal: (goal: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ users, weeklyGoal, onUpdateGoal }) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempGoal, setTempGoal] = useState(weeklyGoal.toString());

  // Return early if no users data is available
  if (!users || users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-skvarna-gray">Loading user data...</p>
      </div>
    );
  }

  // Aggregate data for the team
  const totalTasks = users.reduce((acc, user) => acc + user.metrics.totalTasks, 0);
  const totalHours = users.reduce((acc, user) => acc + (user.metrics.totalHoursSaved || 0), 0);
  const avgEfficiency = users.length > 0 ? Math.round(users.reduce((acc, user) => acc + user.metrics.avgEfficiency, 0) / users.length) : 0;
  const blueprintCompletionCount = users.filter(u => u.completedWritingToneBlueprint || u.completedToneBlueprint).length;
  
  // Transform data for charts - ensure we have at least 4 users with stats
  const teamProgressData = users[0]?.stats ? [0, 1, 2, 3].map(index => {
    const weekData: any = {
      name: users[0].stats[index]?.week || `Week ${index + 1}`,
    };
    users.forEach(user => {
      weekData[user.name] = user.stats[index]?.tasksCompleted || 0;
    });
    return weekData;
  }) : [];

  const aggregateEfficiencyData = users[0]?.stats ? [0, 1, 2, 3].map(index => {
      const weekName = users[0].stats[index]?.week || `Week ${index + 1}`;
      const teamAvg = users.length > 0 ? Math.round(users.reduce((acc, u) => acc + (u.stats[index]?.efficiencyScore || 0), 0) / users.length) : 0;
      return { name: weekName, TeamEfficiency: teamAvg };
  }) : [];

  const handleSaveGoal = () => {
    const val = parseInt(tempGoal);
    if (!isNaN(val) && val > 0) {
        onUpdateGoal(val);
    } else {
        setTempGoal(weeklyGoal.toString());
    }
    setIsEditingGoal(false);
  };

  const StatCard = ({ icon: Icon, label, value, color, subtitle }: { icon: any, label: string, value: string | number, color: string, subtitle?: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-skvarna-gray font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-skvarna-blue">{value}</h3>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Team Goal Banner */}
      <div className="bg-gradient-to-r from-skvarna-navy to-skvarna-blue rounded-xl p-4 text-white shadow-md flex items-center justify-between">
        <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
                <Target className="text-skvarna-yellow" size={24} />
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">Team Goal:</h3>
                    {isEditingGoal ? (
                        <div className="flex items-center">
                            <input 
                                type="number" 
                                value={tempGoal}
                                onChange={(e) => setTempGoal(e.target.value)}
                                className="w-16 px-1 py-0.5 text-skvarna-navy rounded text-center font-bold"
                                autoFocus
                            />
                            <button onClick={handleSaveGoal} className="ml-2 hover:bg-white/20 rounded p-1">
                                <Check size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center group cursor-pointer" onClick={() => setIsEditingGoal(true)}>
                            <span className="font-bold text-lg border-b border-transparent group-hover:border-white/50 transition-all">
                                {weeklyGoal} AI Uses
                            </span>
                            <Edit2 size={14} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    <h3 className="font-bold text-lg">Per Week Per Person</h3>
                </div>
                <p className="text-skvarna-steel text-sm">Consistent adoption drives efficiency.</p>
            </div>
        </div>
        <div className="hidden md:block text-right">
            <div className="text-2xl font-bold text-skvarna-yellow">{users.length * weeklyGoal}</div>
            <div className="text-xs text-white/80">Total Weekly Target</div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-2">
        <div>
            <h2 className="text-2xl font-bold text-skvarna-blue">Firm Overview</h2>
            <p className="text-skvarna-gray">Tracking AI impact across Skvarna Law</p>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded border border-green-400">
          Last Updated: Just now
        </span>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={CheckCircle} label="Total AI Uses Logged" value={totalTasks} color="bg-skvarna-blue" />
        <StatCard icon={Clock} label="Total Hours Saved" value={totalHours} color="bg-skvarna-yellow" subtitle="Across all tools" />
        <StatCard icon={Zap} label="Avg. Team Efficiency" value={`${avgEfficiency}%`} color="bg-purple-600" />
        <StatCard 
            icon={BookOpen} 
            label="Writing Tone Blueprints" 
            value={`${blueprintCompletionCount}/${users.length}`} 
            color="bg-skvarna-navy" 
            subtitle="Completed by Dec 31"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Team Task Output */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light">
          <h3 className="text-lg font-bold text-skvarna-navy mb-4">Task Completion by Staff</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEFF2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5E6163'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5E6163'}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend />
                <Bar dataKey="Vic" fill="#215F8B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Kelly" fill="#F7C355" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Maria" fill="#AEC4D9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sandra" fill="#004F7F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light">
          <h3 className="text-lg font-bold text-skvarna-navy mb-4">Overall Efficiency Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={aggregateEfficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEff" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#215F8B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#215F8B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5E6163'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5E6163'}} domain={[0, 100]} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEFF2" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
                <Area type="monotone" dataKey="TeamEfficiency" stroke="#215F8B" fillOpacity={1} fill="url(#colorEff)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
