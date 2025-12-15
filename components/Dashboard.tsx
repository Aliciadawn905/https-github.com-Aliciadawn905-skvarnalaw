import React, { useState } from 'react';
import { UserData } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
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
  
  // Create chart data with minutes saved per person
  const teamProgressData = users.map(user => ({
    name: user.name,
    minutes: Math.round((user.metrics.totalHoursSaved || 0) * 60),
  }));

  // Pie chart data and colors - matching color scheme across both charts
  const COLORS = ['#F7C355', '#215F8B', '#64748B', '#0EA5E9']; // Kelly, Maria, Sandra, Vic
  const getColorForUser = (name: string) => {
    const colorMap: { [key: string]: string } = {
      'Kelly': '#F7C355',
      'Maria': '#215F8B',
      'Sandra': '#64748B',
      'Vic': '#0EA5E9'
    };
    return colorMap[name] || '#215F8B';
  };
  
  const efficiencyPieData = users.map((user, index) => ({
    name: user.name,
    value: user.metrics.totalTasks || 1, // Show at least 1 to display the segment
    efficiency: user.metrics.avgEfficiency,
  }));

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
        
        {/* Minutes Saved by Staff */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light">
          <h3 className="text-lg font-bold text-skvarna-navy mb-4">Minutes Saved by Team Member</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={teamProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EBEFF2" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#5E6163'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#5E6163'}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value) => [`${value} min`, 'Minutes Saved']}
                />
                <Bar dataKey="minutes" radius={[4, 4, 0, 0]}>
                  {teamProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getColorForUser(entry.name)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Efficiency Distribution - Circular */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light">
          <h3 className="text-lg font-bold text-skvarna-navy mb-4">Task Distribution by Team Member</h3>
          <div className="h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={efficiencyPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, value}) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {efficiencyPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
