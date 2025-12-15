import React, { useState } from 'react';
import { UserData } from '../types';
import { Lightbulb, Plus, Trash2, User, Edit, Check, X } from 'lucide-react';

interface TaskIdea {
  id: string;
  userId: string;
  userName: string;
  idea: string;
  timestamp: number;
}

interface TaskIdeasProps {
  users: UserData[];
}

// Example automation ideas for Trust, Estate & Elderly Law
const EXAMPLE_IDEAS: Omit<TaskIdea, 'id'>[] = [
  {
    userId: '1',
    userName: 'Vic',
    idea: 'Automate client intake forms for estate planning - AI can help draft initial questionnaires based on client type (trust, will, power of attorney)',
    timestamp: Date.now() - 86400000 * 3
  },
  {
    userId: '2',
    userName: 'Kelly',
    idea: 'Use AI to summarize medical records for Medicaid planning cases - could save hours of review time',
    timestamp: Date.now() - 86400000 * 2
  },
  {
    userId: '3',
    userName: 'Maria',
    idea: 'Create template responses for common probate court filings using AI to customize based on case specifics',
    timestamp: Date.now() - 86400000
  }
];

export const TaskIdeas: React.FC<TaskIdeasProps> = ({ users }) => {
  const [ideas, setIdeas] = useState<TaskIdea[]>(
    EXAMPLE_IDEAS.map((example, index) => ({
      ...example,
      id: `example-${index}`
    }))
  );
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newIdea, setNewIdea] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim() || !selectedUserId) {
      alert('Please select a user and enter an automation idea');
      return;
    }

    setIsSubmitting(true);

    const user = users.find(u => u.id === selectedUserId);
    const idea: TaskIdea = {
      id: Math.random().toString(36).substr(2, 9),
      userId: selectedUserId,
      userName: user?.name || 'Unknown',
      idea: newIdea.trim(),
      timestamp: Date.now(),
    };

    setIdeas([idea, ...ideas]);
    setNewIdea('');
    setSelectedUserId('');
    setIsSubmitting(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this automation idea?')) {
      setIdeas(ideas.filter(idea => idea.id !== id));
    }
  };

  const handleEdit = (idea: TaskIdea) => {
    setEditingId(idea.id);
    setEditText(idea.idea);
  };

  const handleSaveEdit = (id: string) => {
    if (!editText.trim()) {
      alert('Idea cannot be empty');
      return;
    }
    
    setIdeas(ideas.map(idea => 
      idea.id === id ? { ...idea, idea: editText.trim() } : idea
    ));
    setEditingId(null);
    setEditText('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-skvarna-blue flex items-center gap-2">
            Automation Ideas 
            <span className="text-lg font-normal text-skvarna-gray">({ideas.length})</span>
          </h2>
          <p className="text-skvarna-gray">Collect ideas for tasks that could be automated with AI tools</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-skvarna-light sticky top-6">
            <h3 className="text-lg font-bold text-skvarna-navy mb-4 flex items-center space-x-2">
              <Plus size={20} className="text-skvarna-yellow" />
              <span>Add New Idea</span>
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* User Selection */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                  <User size={12}/> Who has this idea?
                </label>
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

              {/* Task Idea */}
              <div>
                <label className="block text-xs font-bold text-skvarna-gray uppercase mb-1 flex items-center gap-1">
                  <Lightbulb size={12} /> Automation Idea
                </label>
                <textarea
                  value={newIdea}
                  onChange={(e) => setNewIdea(e.target.value)}
                  placeholder="Describe a task that could be automated with AI..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-skvarna-blue/20 focus:border-skvarna-blue min-h-[120px] resize-none"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">Be specific about the task and desired outcome</p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2.5 rounded-lg font-bold text-white shadow-sm transition-all flex justify-center items-center ${
                  isSubmitting ? 'bg-skvarna-steel cursor-not-allowed' : 'bg-skvarna-blue hover:bg-skvarna-navy hover:shadow-md'
                }`}
              >
                {isSubmitting ? 'Adding...' : 'Add Idea'}
              </button>
            </form>
          </div>
        </div>

        {/* Ideas Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-skvarna-light overflow-hidden">
            <div className="p-4 bg-skvarna-light/50 border-b border-skvarna-light">
              <h3 className="font-bold text-skvarna-navy flex items-center space-x-2">
                <Lightbulb size={18} className="text-skvarna-yellow" />
                <span>All Automation Ideas</span>
              </h3>
            </div>

            <div className="overflow-x-auto">
              {ideas.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-skvarna-gray">No automation ideas yet. Add your first idea!</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 text-xs text-skvarna-gray uppercase border-b border-gray-200">
                    <tr>
                      <th className="p-4 font-semibold w-32">Date</th>
                      <th className="p-4 font-semibold w-32">Submitted By</th>
                      <th className="p-4 font-semibold">Automation Idea</th>
                      <th className="p-4 font-semibold text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {ideas.sort((a, b) => b.timestamp - a.timestamp).map(idea => (
                      <tr key={idea.id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="p-4 text-sm text-skvarna-gray whitespace-nowrap">
                          {new Date(idea.timestamp).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-skvarna-steel/30 flex items-center justify-center text-xs font-bold text-skvarna-navy">
                              {idea.userName.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-skvarna-navy">{idea.userName}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {editingId === idea.id ? (
                            <div className="space-y-2">
                              <textarea
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                className="w-full p-2 border border-skvarna-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-skvarna-blue/20"
                                rows={3}
                              />
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleSaveEdit(idea.id)}
                                  className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm font-medium"
                                >
                                  <Check size={16} /> Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="text-gray-500 hover:text-gray-600 flex items-center gap-1 text-sm font-medium"
                                >
                                  <X size={16} /> Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm text-skvarna-navy">{idea.idea}</p>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-2">
                            {editingId !== idea.id && (
                              <>
                                <button
                                  onClick={() => handleEdit(idea)}
                                  className="text-skvarna-blue hover:text-skvarna-navy transition-colors p-1"
                                  title="Edit idea"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDelete(idea.id)}
                                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                                  title="Delete idea"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
