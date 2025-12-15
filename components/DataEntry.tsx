import React, { useState } from 'react';
import { UserData, TaskLog, TaskType } from '../types';
import { AI_TOOLS, TASK_TYPES } from '../constants';
import { PlusCircle, History, User as UserIcon, Briefcase, PenTool, FileText, Filter, Clock, CheckCircle } from 'lucide-react';

interface DataEntryProps {
  users: UserData[];
  logs: TaskLog[];
  onAddLog: (log: TaskLog) => void;
}

export const DataEntry: React.FC<DataEntryProps> = ({ users, logs, onAddLog }) => {
  // Form State
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [toolName, setToolName] = useState<string>('');
  const [taskType, setTaskType] = useState<TaskType>('Client Email/Letter');
  const [description, setDescription] = useState<string>('');
  const [timeSaved, setTimeSaved] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter State
  const [filterUser, setFilterUser] = useState<string>('All');
  const [filterTool, setFilterTool] = useState<string>('All');

  const toolOptions = AI_TOOLS as unknown as string[];
  const typeOptions = TASK_TYPES as unknown as TaskType[];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !selectedUserId || !toolName) {
      alert('Please fill in all required fields (User, Tool, and Description)');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = users.find(u => u.id === selectedUserId);
      const newLog: TaskLog = {
        id: Math.random().toString(36).substr(2, 9),
        userId: selectedUserId,
        userName: user?.name || 'Unknown',
        toolName,
        taskType,
        taskDescription: description,
        date: new Date().toISOString().split('T')[0],
        timeSaved: parseInt(timeSaved) || 0,
        timestamp: Date.now(),
      };

      await onAddLog(newLog);
      
      // Show custom success message
      const minutes = parseInt(timeSaved) || 0;
      setSuccessMessage(`${user?.name} just logged ${minutes} minutes saved using ${toolName}! 🚀`);
      setShowSuccess(true);
      
      // Auto-hide success message after 4 seconds
      setTimeout(() => setShowSuccess(false), 4000);
      
      // Only reset form if submission was successful
      setDescription('');
      setTimeSaved('');
      setSelectedUserId('');
      setToolName('');
    } catch (err: any) {
      console.error('Form submission error:', err);
      // Show the actual error message from the database
      const errorMessage = err?.message || 'Failed to add log. Please try again.';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter Logic
  const filteredLogs = logs.filter(log => {
    const userMatch = filterUser === 'All' || log.userId === filterUser;
    const toolMatch = filterTool === 'All' || log.toolName === filterTool;
    return userMatch && toolMatch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Adjust for timezone offset to ensure the date matches the input string
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(adjustedDate);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Success Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-gradient-to-r from-skvarna-blue to-skvarna-navy text-white px-6 py-4 rounded-lg shadow-2xl border-2 border-skvarna-yellow flex items-center space-x-3 max-w-md">
            <CheckCircle size={32} className="text-skvarna-yellow flex-shrink-0" />
            <div>
              <p className="font-bold text-lg">Success!</p>
              <p className="text-sm">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-skvarna-blue">AI Tracking Log</h2>
          <p className="text-skvarna-gray">Record AI tool usage and task details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light sticky top-6">
            <h3 className="text-lg font-bold text-skvarna-navy mb-4 flex items-center space-x-2">
              <PlusCircle size={20} className="text-skvarna-yellow" />
              <span>Log New Activity</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                    <UserIcon size={12}/> User
                </label>
                <div className="relative">
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skvarna-blue/20 focus:border-skvarna-blue bg-white"
                        required
                    >
                        <option value="">Select a user</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                </div>
              </div>

              {/* Tool Selection */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                    <PenTool size={12} /> Tool Used
                </label>
                <select
                    value={toolName}
                    onChange={(e) => setToolName(e.target.value)}
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skvarna-blue/20 focus:border-skvarna-blue bg-white"
                    required
                >
                    <option value="">Select a tool</option>
                    {toolOptions.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Time Saved */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                    <Clock size={12} /> Time Saved (Minutes)
                </label>
                <input
                    type="number"
                    value={timeSaved}
                    onChange={(e) => setTimeSaved(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skvarna-blue/20 focus:border-skvarna-blue"
                />
              </div>

              {/* Task Type */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                    <Briefcase size={12} /> Task Type
                </label>
                <div className="flex flex-wrap gap-2">
                    {typeOptions.map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => setTaskType(type)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all ${
                                taskType === type 
                                ? 'bg-skvarna-blue text-white border-skvarna-blue shadow-sm' 
                                : 'bg-white text-skvarna-gray border-gray-200 hover:border-skvarna-blue'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                    <FileText size={12} /> Task Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what was accomplished..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skvarna-blue/20 focus:border-skvarna-blue min-h-[100px] resize-none"
                    required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-lg font-bold text-white shadow-sm transition-all flex justify-center items-center ${
                    isSubmitting ? 'bg-skvarna-steel cursor-not-allowed' : 'bg-skvarna-blue hover:bg-skvarna-navy hover:shadow-md'
                }`}
              >
                {isSubmitting ? 'Logging...' : 'Submit Entry'}
              </button>
            </form>
          </div>
        </div>

        {/* History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-skvarna-light overflow-hidden">
             <div className="p-4 bg-skvarna-light/50 border-b border-skvarna-light flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-skvarna-navy flex items-center space-x-2">
                        <History size={18} className="text-skvarna-blue" />
                        <span>Recent Activity Log</span>
                    </h3>
                    <span className="text-xs text-skvarna-gray bg-white px-2 py-1 rounded border border-gray-200">
                        {filteredLogs.length} Entries
                    </span>
                </div>
                
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                   <div className="flex items-center gap-1 text-xs text-skvarna-gray font-semibold">
                      <Filter size={12} />
                      <span>Filter:</span>
                   </div>
                   <select 
                      value={filterUser}
                      onChange={(e) => setFilterUser(e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-skvarna-blue bg-white"
                   >
                      <option value="All">All Users</option>
                      {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                   </select>
                   <select 
                      value={filterTool}
                      onChange={(e) => setFilterTool(e.target.value)}
                      className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-skvarna-blue bg-white"
                   >
                      <option value="All">All Tools</option>
                      {toolOptions.map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 text-xs text-skvarna-gray uppercase border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">User</th>
                            <th className="p-4 font-semibold">Tool & Type</th>
                            <th className="p-4 font-semibold">Task</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredLogs.sort((a,b) => b.timestamp - a.timestamp).map(log => (
                            <tr key={log.id} className="hover:bg-blue-50/30 transition-colors animate-fade-in">
                                <td className="p-4 text-sm text-skvarna-gray whitespace-nowrap">{formatDate(log.date)}</td>
                                <td className="p-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-6 h-6 rounded-full bg-skvarna-steel/30 flex items-center justify-center text-xs font-bold text-skvarna-navy">
                                            {log.userName.charAt(0)}
                                        </div>
                                        <span className="text-sm font-medium text-skvarna-navy">{log.userName}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-col items-start gap-1">
                                        <span className="text-sm font-semibold text-skvarna-blue">{log.toolName}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-skvarna-light text-skvarna-gray border border-gray-200">
                                                {log.taskType}
                                            </span>
                                            {log.timeSaved > 0 && (
                                                <span className="text-xs text-green-600 font-medium flex items-center">
                                                    <Clock size={10} className="mr-1" />
                                                    {log.timeSaved}m
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600 max-w-xs">{log.taskDescription}</td>
                            </tr>
                        ))}
                        {filteredLogs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400 italic">
                                    {logs.length > 0 ? "No entries match your filters." : "No activity logged yet."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
