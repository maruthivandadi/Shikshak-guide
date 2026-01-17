import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, TrendingUp, Users, Clock } from 'lucide-react';

const data = [
  { name: 'Mon', solved: 2 },
  { name: 'Tue', solved: 4 },
  { name: 'Wed', solved: 3 },
  { name: 'Thu', solved: 5 },
  { name: 'Fri', solved: 4 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-dark">Your Impact</h2>
        <p className="text-gray-500">Weekly progress report</p>
      </header>

      {/* Streak Card */}
      <div className="bg-gradient-to-r from-accent to-yellow-300 rounded-2xl p-6 shadow-md text-dark flex items-center justify-between">
        <div>
          <h3 className="text-3xl font-bold">5 Days</h3>
          <p className="font-medium opacity-80">Weekly Streak</p>
        </div>
        <div className="bg-white/30 p-3 rounded-full">
          <TrendingUp className="w-8 h-8 text-dark" />
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-primary/10 p-2 rounded-full mb-2">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-bold text-dark">120</span>
          <span className="text-xs text-gray-500">Students Impacted</span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
          <div className="bg-secondary/10 p-2 rounded-full mb-2">
            <Clock className="w-6 h-6 text-secondary" />
          </div>
          <span className="text-2xl font-bold text-dark">45m</span>
          <span className="text-xs text-gray-500">Time Saved</span>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold text-dark mb-4">Problems Solved</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
              <Bar dataKey="solved" fill="#4ECDC4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div>
        <h3 className="font-semibold text-dark mb-3">Recent Achievements</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-48">
            <div className="bg-purple-100 p-2 rounded-full">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-dark">Math Master</p>
              <p className="text-[10px] text-gray-500">Solved 10 Math queries</p>
            </div>
          </div>
          <div className="flex-shrink-0 bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 w-48 opacity-60 grayscale">
            <div className="bg-blue-100 p-2 rounded-full">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-sm text-dark">Innovator</p>
              <p className="text-[10px] text-gray-500">Create 5 resources</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};