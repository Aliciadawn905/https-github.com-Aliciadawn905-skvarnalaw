import React, { useState, useEffect } from 'react';
import { UserData, TaskLog } from './types';
import { Dashboard } from './components/Dashboard';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { IndividualBreakdown } from './components/IndividualBreakdown';
import { Leaderboard } from './components/Leaderboard';
import { DataEntry } from './components/DataEntry';
import { TaskIdeas } from './components/TaskIdeas';
import { LayoutDashboard, Users, Trophy, Table2, Menu, Bell, ClipboardPlus, Lightbulb } from 'lucide-react';
import { fetchUsers, fetchTaskLogs, addTaskLog, updateUserGoal as dbUpdateUserGoal, toggleBlueprint as dbToggleBlueprint } from './Database';

type View = 'dashboard' | 'comparison' | 'individual' | 'leaderboard' | 'entry' | 'ideas';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [users, setUsers] = useState<UserData[]>([]);
  const [taskLogs, setTaskLogs] = useState<TaskLog[]>([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [weeklyGoal, setWeeklyGoal] = useState<number>(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from database on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [usersData, logsData] = await Promise.all([
        fetchUsers(),
        fetchTaskLogs(),
      ]);
      setUsers(usersData);
      setTaskLogs(logsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to update state (now calls database)
  const updateUserGoal = async (userId: string, type: 'tasksTarget' | 'hoursTarget' | 'deadline', value: any) => {
    try {
      await dbUpdateUserGoal(userId, type, value);
      // Refresh users data
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error updating user goal:', err);
      alert('Failed to update goal. Please try again.');
    }
  };

  const toggleBlueprint = async (userId: string) => {
    try {
      // Get current user to toggle their blueprint status
      const currentUser = users.find(u => u.id === userId);
      const newStatus = !(currentUser?.completedWritingToneBlueprint || currentUser?.completedToneBlueprint || false);
      
      await dbToggleBlueprint(userId, newStatus);
      // Refresh users data
      const usersData = await fetchUsers();
      setUsers(usersData);
    } catch (err) {
      console.error('Error toggling blueprint:', err);
      alert('Failed to update blueprint status. Please try again.');
    }
  };

  const handleAddLog = async (newLog: TaskLog) => {
    try {
      // Convert to database format (snake_case)
      const dbLog = {
        id: newLog.id, // Include the id for Supabase
        user_id: newLog.userId,
        user_name: newLog.userName,
        tool_name: newLog.toolName,
        task_description: newLog.taskDescription,
        task_type: newLog.taskType,
        date: newLog.date,
        timestamp: newLog.timestamp,
        time_saved: newLog.timeSaved || 0,
      };
      
      await addTaskLog(dbLog);
      // Refresh both users and logs
      const [usersData, logsData] = await Promise.all([
        fetchUsers(),
        fetchTaskLogs(),
      ]);
      setUsers(usersData);
      setTaskLogs(logsData);
      return true; // Indicate success
    } catch (err) {
      console.error('Error adding log:', err);
      throw err; // Re-throw so DataEntry can handle it
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entry', label: 'AI Tracking Log', icon: ClipboardPlus },
    { id: 'ideas', label: 'Automation Ideas', icon: Lightbulb },
    { id: 'individual', label: 'Individual Progress', icon: Users },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'comparison', label: 'Comparison Matrix', icon: Table2 },
  ];

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-skvarna-light/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-skvarna-blue mx-auto mb-4"></div>
          <p className="text-skvarna-navy text-lg font-semibold">Loading tracker data...</p>
        </div>
      </div>
    );
  }

  // Show error screen
  if (error) {
    return (
      <div className="min-h-screen bg-skvarna-light/50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-skvarna-navy mb-2">Error Loading Data</h2>
          <p className="text-skvarna-gray mb-4">{error}</p>
          <button
            onClick={loadData}
            className="bg-skvarna-blue text-white px-6 py-2 rounded-lg hover:bg-skvarna-navy transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
            {users.length > 0 && (
              <div className="flex items-center space-x-3">
                <img src={users.find(u => u.role === 'Owner')?.avatar || users[0].avatar} alt="Current User" className="w-10 h-10 rounded-full border-2 border-skvarna-yellow" />
                <div>
                  <p className="text-sm font-bold text-white">{users.find(u => u.role === 'Owner')?.name || users[0].name}</p>
                  <p className="text-xs text-skvarna-steel">{users.find(u => u.role === 'Owner')?.role || users[0].role}</p>
                </div>
              </div>
            )}
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
            {currentView === 'ideas' && <TaskIdeas users={users} />}
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
