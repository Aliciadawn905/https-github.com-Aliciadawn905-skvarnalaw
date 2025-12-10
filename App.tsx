import React, { useState } from 'react';
import { USERS, INITIAL_TASK_LOGS } from './constants';
import { UserData, TaskLog } from './types';
import { Dashboard } from './components/Dashboard';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { IndividualBreakdown } from './components/IndividualBreakdown';
import { Leaderboard } from './components/Leaderboard';
import { DataEntry } from './components/DataEntry';
import { LayoutDashboard, Users, Trophy, Table2, Menu, Bell, ClipboardPlus } from 'lucide-react';

type View = 'dashboard' | 'comparison' | 'individual' | 'leaderboard' | 'entry';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [users, setUsers] = useState<UserData[]>(USERS);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>(INITIAL_TASK_LOGS);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(10);

  // Helper to update state (simulating backend update)
  const updateUserGoal = (userId: string, type: 'tasksTarget' | 'hoursTarget' | 'deadline', value: any) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          currentGoals: {
            ...u.currentGoals,
            [type]: value
          }
        };
      }
      return u;
    }));
  };

  const toggleBlueprint = (userId: string) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          completedToneBlueprint: !u.completedToneBlueprint
        };
      }
      return u;
    }));
  };

  const handleAddLog = (newLog: TaskLog) => {
    setTaskLogs(prev => [newLog, ...prev]);

    // Side effect: Automatically mark Writing Tone Blueprint as completed if logged
    if (newLog.taskType === 'Writing Tone Blueprint') {
        setUsers(prevUsers => prevUsers.map(u => {
            if (u.id === newLog.userId) {
                return { ...u, completedToneBlueprint: true };
            }
            return u;
        }));
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entry', label: 'Data Entry', icon: ClipboardPlus },
    { id: 'individual', label: 'Individual Progress', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'comparison', label: 'Comparison Matrix', icon: Table2 },
  ];

  return (
    <div className="min-h-screen bg-skvarna-light/50 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-skvarna-blue text-white p-4 flex justify-between items-center shadow-md z-20">
        <div className="font-bold text-xl tracking-tight">SKVARNA LAW</div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)}>
          <Menu />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-10 w-64 bg-skvarna-navy text-white transform transition-transform duration-300 ease-in-out shadow-xl
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Area */}
          <div className="p-6 border-b border-skvarna-blue bg-skvarna-blue">
            <h1 className="text-2xl font-extrabold tracking-wider">SKVARNA LAW</h1>
            <p className="text-xs text-skvarna-steel mt-1 uppercase tracking-widest">AI Tracker</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as View);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${currentView === item.id 
                    ? 'bg-skvarna-yellow text-skvarna-navy font-bold shadow-lg' 
                    : 'text-skvarna-steel hover:bg-skvarna-blue hover:text-white'
                  }
                `}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Profile Snippet (Current User - Vic) */}
          <div className="p-4 border-t border-skvarna-blue bg-skvarna-blue/20">
            <div className="flex items-center space-x-3">
              <img src={users[0].avatar} alt="Vic" className="w-10 h-10 rounded-full border-2 border-skvarna-yellow" />
              <div>
                <p className="text-sm font-bold text-white">Vic Skvarna</p>
                <p className="text-xs text-skvarna-steel">Owner</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="bg-white h-16 border-b border-skvarna-light flex items-center justify-between px-8 shadow-sm">
            <h2 className="text-xl font-bold text-skvarna-navy capitalize">
              {navItems.find(n => n.id === currentView)?.label}
            </h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-skvarna-gray hover:text-skvarna-blue relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              </button>
            </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'dashboard' && <Dashboard users={users} weeklyGoal={weeklyGoal} onUpdateGoal={setWeeklyGoal} />}
            {currentView === 'comparison' && <ComparisonMatrix users={users} />}
            {currentView === 'individual' && <IndividualBreakdown users={users} updateUserGoal={updateUserGoal} toggleBlueprint={toggleBlueprint} />}
            {currentView === 'leaderboard' && <Leaderboard users={users} />}
            {currentView === 'entry' && <DataEntry users={users} logs={taskLogs} onAddLog={handleAddLog} />}
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
