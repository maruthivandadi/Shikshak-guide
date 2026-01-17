
import React from 'react';
import { Search, PlayCircle, ExternalLink, CheckCircle } from 'lucide-react';
import { MOCK_RESOURCES } from '../constants';

export const MicroLearning: React.FC = () => {
  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-dark">Learn</h2>
        <p className="text-gray-500">Practical videos for your classroom</p>
      </header>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search topics..." 
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {['Recommended', 'Activities', 'Math', 'Management'].map((filter, idx) => (
            <button key={idx} className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${idx === 0 ? 'bg-secondary text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {MOCK_RESOURCES.map((resource) => (
          <div 
            key={resource.id} 
            onClick={() => resource.link && window.open(resource.link, '_blank')}
            className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-4 active:scale-[0.98] transition-transform cursor-pointer group"
          >
            <div className="relative w-28 h-20 flex-shrink-0 bg-gray-200 rounded-lg overflow-hidden">
               <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                 <PlayCircle className="text-white w-8 h-8 opacity-90 group-hover:scale-110 transition-transform" />
               </div>
            </div>
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{resource.category}</span>
                  <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">{resource.duration}</span>
                </div>
                <h3 className="font-semibold text-dark text-sm mt-1 leading-tight line-clamp-2">{resource.title}</h3>
              </div>
              <div className="flex justify-between items-center mt-2">
                 <span className="text-xs text-gray-400">{resource.difficulty}</span>
                 <div className="text-gray-400 group-hover:text-primary transition-colors flex items-center gap-1 text-xs">
                   <span>Watch</span>
                   <ExternalLink className="w-3 h-3" />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-3">
         <CheckCircle className="text-blue-500 w-6 h-6" />
         <div>
            <p className="text-sm font-bold text-blue-800">Learning Goal</p>
            <p className="text-xs text-blue-600">You've watched 1 of 3 recommended videos this week.</p>
         </div>
      </div>
    </div>
  );
};
