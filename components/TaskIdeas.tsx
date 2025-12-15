import React, { useState } from 'react';
import { UserData } from '../types';
import { Lightbulb, Plus, Trash2, User } from 'lucide-react';

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

export const TaskIdeas: React.FC<TaskIdeasProps> = ({ users }) => {
  const [ideas, setIdeas] = useState<TaskIdea[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [newIdea, setNewIdea] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.trim() || !selectedUserId) {
      alert('Please select a user and enter a task idea');
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
    if (confirm('Delete this task idea?')) {
      setIdeas(ideas.filter(idea => idea.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-skvarna-blue">Task Ideas to Automate</h2>
        <p className="text-skvarna-gray">Collect ideas for tasks that could be automated with AI tools</p>
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
                  <Lightbulb size={12} /> Task Idea
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

        {/* Ideas List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-skvarna-light overflow-hidden">
            <div className="p-4 bg-skvarna-light/50 border-b border-skvarna-light">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-skvarna-navy flex items-center space-x-2">
                  <Lightbulb size={18} className="text-skvarna-yellow" />
                  <span>All Task Ideas</span>
                </h3>
                <span className="text-xs text-skvarna-gray bg-white px-2 py-1 rounded border border-gray-200">
                  {ideas.length} {ideas.length === 1 ? 'Idea' : 'Ideas'}
                </span>
              </div>
            </div>

            <div className="p-4">
              {ideas.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-skvarna-gray">No task ideas yet. Add your first idea!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ideas.map(idea => (
                    <div 
                      key={idea.id}
                      className="bg-skvarna-light/30 rounded-lg p-4 border border-skvarna-light hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-skvarna-navy">{idea.userName}</span>
                          <span className="text-xs text-skvarna-gray">
                            {new Date(idea.timestamp).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDelete(idea.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Delete idea"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-skvarna-navy">{idea.idea}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
