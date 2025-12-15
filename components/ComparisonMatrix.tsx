import React from 'react';
import { UserData, ComparisonRow } from '../types';
import { INITIAL_COMPARISON_DATA } from '../constants';
import { Download, Table } from 'lucide-react';

interface ComparisonMatrixProps {
  users: UserData[];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ users }) => {
  // Get user data by name
  const getUserMetric = (name: string, metric: 'tasks' | 'hours' | 'efficiency' | 'engagement') => {
    const user = users.find(u => u.name === name);
    if (!user) return 0;
    
    switch(metric) {
      case 'tasks':
        return user.metrics.totalTasks || 0;
      case 'hours':
        return user.metrics.totalHoursSaved?.toFixed(1) || '0.0';
      case 'efficiency':
        return user.metrics.avgEfficiency ? `${user.metrics.avgEfficiency}%` : '0%';
      case 'engagement':
        return user.metrics.engagementScore || 0;
      default:
        return 0;
    }
  };

  const comparisonData = [
    {
      metric: 'AI Activities Logged (Total)',
      vic: getUserMetric('Vic', 'tasks'),
      kelly: getUserMetric('Kelly', 'tasks'),
      maria: getUserMetric('Maria', 'tasks'),
      sandra: getUserMetric('Sandra', 'tasks'),
    },
    {
      metric: 'Weekly Goal Progress',
      vic: `${getUserMetric('Vic', 'tasks')}/10`,
      kelly: `${getUserMetric('Kelly', 'tasks')}/10`,
      maria: `${getUserMetric('Maria', 'tasks')}/10`,
      sandra: `${getUserMetric('Sandra', 'tasks')}/10`,
    },
    {
      metric: 'Efficiency (%)',
      vic: getUserMetric('Vic', 'efficiency'),
      kelly: getUserMetric('Kelly', 'efficiency'),
      maria: getUserMetric('Maria', 'efficiency'),
      sandra: getUserMetric('Sandra', 'efficiency'),
    },
    {
      metric: 'Engagement Score (1-10)',
      vic: getUserMetric('Vic', 'engagement'),
      kelly: getUserMetric('Kelly', 'engagement'),
      maria: getUserMetric('Maria', 'engagement'),
      sandra: getUserMetric('Sandra', 'engagement'),
    },
  ];

  const handleExport = () => {
    // Generate CSV content
    const headers = ['Metric', 'Vic', 'Kelly', 'Maria', 'Sandra'];
    const rows = comparisonData.map(row => 
      [row.metric, row.vic, row.kelly, row.maria, row.sandra].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "skvarna_ai_stats.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert("Exporting CSV file...");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-skvarna-blue">Team Metrics</h2>
            <p className="text-skvarna-gray">Side-by-side comparison of team metrics</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 bg-skvarna-blue hover:bg-skvarna-navy text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
        >
          <Download size={18} />
          <span>Export CSV</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-skvarna-light overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-skvarna-light border-b border-skvarna-steel">
                <th className="p-4 text-skvarna-navy font-bold uppercase text-xs tracking-wider">Metric</th>
                <th className="p-4 text-skvarna-navy font-bold text-center">Vic</th>
                <th className="p-4 text-skvarna-navy font-bold text-center">Kelly</th>
                <th className="p-4 text-skvarna-navy font-bold text-center">Maria</th>
                <th className="p-4 text-skvarna-navy font-bold text-center">Sandra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-skvarna-light">
              {comparisonData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-skvarna-gray flex items-center space-x-2">
                    <Table size={16} className="text-skvarna-blue opacity-50" />
                    <span>{row.metric}</span>
                  </td>
                  <td className="p-4 text-center font-semibold text-skvarna-blue">{row.vic}</td>
                  <td className="p-4 text-center font-semibold text-skvarna-blue">{row.kelly}</td>
                  <td className="p-4 text-center font-semibold text-skvarna-blue">{row.maria}</td>
                  <td className="p-4 text-center font-semibold text-skvarna-blue">{row.sandra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-skvarna-yellow/10 border border-skvarna-yellow rounded-lg p-4 mt-4">
        <h4 className="font-bold text-skvarna-navy mb-2">Insight</h4>
        <p className="text-sm text-skvarna-gray">
          Sandra is currently leading in both efficiency and total hours saved. Maria has shown a 30% increase in task completion since Week 1, indicating strong adoption progress.
        </p>
      </div>
    </div>
  );
};