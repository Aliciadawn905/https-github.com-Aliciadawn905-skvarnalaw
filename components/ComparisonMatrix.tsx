import React from 'react';
import { UserData, ComparisonRow } from '../types';
import { INITIAL_COMPARISON_DATA } from '../constants';
import { Download, Table } from 'lucide-react';

interface ComparisonMatrixProps {
  users: UserData[];
}

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({ users }) => {
  const handleExport = () => {
    // Generate CSV content
    const headers = ['Metric', 'Vic', 'Kelly', 'Maria', 'Sandra'];
    const rows = INITIAL_COMPARISON_DATA.map(row => 
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
            <h2 className="text-2xl font-bold text-skvarna-blue">Performance Matrix</h2>
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
              {INITIAL_COMPARISON_DATA.map((row, index) => (
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