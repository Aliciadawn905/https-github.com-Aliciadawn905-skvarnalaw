import React from 'react';
import { UserData } from '../types';
import { Trophy, TrendingUp, Clock, Medal } from 'lucide-react';

interface LeaderboardProps {
  users: UserData[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  // Sort users by efficiency for the main ranking
  const sortedUsers = [...users].sort((a, b) => b.metrics.avgEfficiency - a.metrics.avgEfficiency);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-skvarna-blue">Efficiency Leaderboard</h2>
          <p className="text-skvarna-gray">Celebrating top performers in AI adoption</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-8">
        {/* First Place */}
        <div className="order-1 md:order-2 bg-gradient-to-b from-yellow-50 to-white border-2 border-skvarna-yellow rounded-xl p-6 flex flex-col items-center shadow-md transform md:-translate-y-4">
            <Medal className="w-12 h-12 text-skvarna-yellow mb-2" />
            <img src={sortedUsers[0].avatar} alt={sortedUsers[0].name} className="w-20 h-20 rounded-full border-4 border-white shadow-sm mb-3" />
            <h3 className="text-xl font-bold text-skvarna-navy">{sortedUsers[0].name}</h3>
            <p className="text-skvarna-blue font-bold text-2xl mt-2">{sortedUsers[0].metrics.avgEfficiency}%</p>
            <p className="text-xs text-skvarna-gray uppercase tracking-widest mt-1">Efficiency Score</p>
        </div>

        {/* Second Place */}
        <div className="order-2 md:order-1 bg-white border border-skvarna-light rounded-xl p-6 flex flex-col items-center shadow-sm mt-4">
             <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mb-2">2</div>
             <img src={sortedUsers[1].avatar} alt={sortedUsers[1].name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm mb-3 grayscale hover:grayscale-0 transition-all" />
            <h3 className="text-lg font-bold text-skvarna-navy">{sortedUsers[1].name}</h3>
            <p className="text-skvarna-blue font-bold text-xl mt-2">{sortedUsers[1].metrics.avgEfficiency}%</p>
        </div>

        {/* Third Place */}
        <div className="order-3 md:order-3 bg-white border border-skvarna-light rounded-xl p-6 flex flex-col items-center shadow-sm mt-4">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-orange-700 mb-2">3</div>
             <img src={sortedUsers[2].avatar} alt={sortedUsers[2].name} className="w-16 h-16 rounded-full border-2 border-white shadow-sm mb-3 grayscale hover:grayscale-0 transition-all" />
            <h3 className="text-lg font-bold text-skvarna-navy">{sortedUsers[2].name}</h3>
            <p className="text-skvarna-blue font-bold text-xl mt-2">{sortedUsers[2].metrics.avgEfficiency}%</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-skvarna-light overflow-hidden">
          <div className="p-4 bg-skvarna-light border-b border-skvarna-steel font-bold text-skvarna-navy flex justify-between">
              <span>Full Team Standings</span>
              <span>Metric: Hours Saved</span>
          </div>
          {users.sort((a,b) => (b.metrics.totalHoursSaved || 0) - (a.metrics.totalHoursSaved || 0)).map((user, idx) => (
              <div key={user.id} className="flex items-center justify-between p-4 border-b border-skvarna-light last:border-0 hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                      <span className="text-skvarna-gray font-mono font-bold w-6 text-center">{idx + 1}</span>
                      <img src={user.avatar} className="w-10 h-10 rounded-full" alt={user.name} />
                      <span className="font-medium text-skvarna-navy">{user.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-skvarna-blue" />
                      <span className="font-bold text-skvarna-navy">{user.metrics.totalHoursSaved || 0} hrs</span>
                  </div>
              </div>
          ))}
      </div>
    </div>
  );
};