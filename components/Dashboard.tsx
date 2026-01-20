
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts';
import { Award, TrendingUp, Users, Clock, Target, Zap } from 'lucide-react';
import { UserStats } from '../types';

interface DashboardProps {
    stats: UserStats;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats }) => {
  // Format weekly activity for chart, ensure we have at least some data points for display
  const chartData = stats.weeklyActivity.length > 0 
      ? stats.weeklyActivity.map(d => ({ name: d.date, value: d.count }))
      : [{ name: 'Today', value: 0 }];

  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-dark">Impact Report</h2>
        <p className="text-gray-500 text-sm">Your actual classroom insights</p>
      </header>

      {/* Streak Card */}
      <div className="bg-gradient-to-r from-secondary to-teal-600 rounded-2xl p-6 shadow-lg shadow-teal-500/20 text-white flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
             <Zap className="w-4 h-4 text-accent animate-pulse" />
             <span className="text-xs font-bold uppercase tracking-wider opacity-80">Current Streak</span>
          </div>
          <h3 className="text-4xl font-bold">{stats.currentStreak} Days</h3>
          <p className="text-sm opacity-90 mt-1">Keep it up! 🔥</p>
        </div>
        <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm relative z-10">
          <TrendingUp className="w-8 h-8 text-white" />
        </div>
        {/* Decor */}
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <span className="text-2xl font-bold text-dark block">{stats.totalQueries}</span>
            <span className="text-xs text-gray-500 font-medium">Questions Asked</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-primary/5 rounded-full"></div>
        </div>
        
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <span className="text-2xl font-bold text-dark block">{stats.resourcesViewed}</span>
            <span className="text-xs text-gray-500 font-medium">Lessons Viewed</span>
          </div>
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-orange-50 rounded-full"></div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-dark text-sm">Your Activity</h3>
            <span className="text-xs bg-gray-50 rounded-lg p-1 text-gray-500">Last 7 Days</span>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ECDC4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#4ECDC4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#9ca3af'}} axisLine={false} tickLine={false} dy={10} />
              <YAxis hide />
              <Tooltip 
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} 
                labelStyle={{color: '#6b7280', fontSize: '12px', marginBottom: '4px'}}
              />
              <Area type="monotone" dataKey="value" stroke="#4ECDC4" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-bold text-dark mb-4 text-sm">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-56">
            <div className="bg-purple-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-dark">Methodology Master</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5">
                 <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${Math.min(stats.resourcesViewed * 10, 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{Math.min(stats.resourcesViewed * 10, 100)}% Complete</p>
            </div>
          </div>
          
          <div className="flex-shrink-0 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-56">
            <div className="bg-blue-100 p-3 rounded-full">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-dark">Super Asker</p>
              <div className="w-full bg-gray-100 h-1.5 rounded-full mt-1.5">
                 <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(stats.totalQueries * 5, 100)}%` }}></div>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{Math.min(stats.totalQueries * 5, 100)}% Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
