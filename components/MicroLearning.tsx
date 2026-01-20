
import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, ExternalLink, CheckCircle, FileText } from 'lucide-react';
import { MOCK_RESOURCES } from '../constants';
import { UserProfile } from '../types';

interface MicroLearningProps {
    user?: UserProfile;
    onActivity: () => void;
}

export const MicroLearning: React.FC<MicroLearningProps> = ({ user, onActivity }) => {
  const categories = ['All', 'Pedagogy', 'Math', 'Science', 'English', 'Hindi', 'Social Studies', 'Management'];
  
  // Initial state logic: If user has a subject, use it as the default filter
  const [filter, setFilter] = useState(() => {
    if (user?.subject && categories.includes(user.subject)) {
        return user.subject;
    }
    return 'All';
  });
  
  const [search, setSearch] = useState('');

  // Update filter when user subject changes (e.g. after profile edit)
  useEffect(() => {
    if (user?.subject && categories.includes(user.subject)) {
        setFilter(user.subject);
    }
  }, [user?.subject]);

  const filteredResources = MOCK_RESOURCES.filter(r => {
      const matchesCategory = filter === 'All' || r.category === filter;
      const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
  });

  const handleResourceClick = (link?: string) => {
      if (link) {
          onActivity();
          window.open(link, '_blank');
      }
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <header>
        <h2 className="text-2xl font-bold text-dark">Teacher's Library</h2>
        <p className="text-gray-500 text-sm">Curated resources for {user?.grade ? `${user.grade} ${user.subject}` : 'modern teaching'}</p>
      </header>

      {/* Search & Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search topics (e.g., Fractions)..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 shadow-sm text-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button 
                key={cat} 
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    filter === cat 
                    ? 'bg-dark text-white shadow-lg shadow-dark/20' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {filteredResources.length === 0 ? (
            <div className="text-center py-10 opacity-50">
                <p>No resources found for {filter}.</p>
                {filter !== 'All' && (
                    <button onClick={() => setFilter('All')} className="text-secondary font-bold text-sm mt-2">View All Resources</button>
                )}
            </div>
        ) : filteredResources.map((resource) => (
          <div 
            key={resource.id} 
            onClick={() => handleResourceClick(resource.link)}
            className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-4 active:scale-[0.98] transition-transform cursor-pointer group hover:shadow-md ${user?.subject === resource.category ? 'ring-2 ring-secondary/20' : ''}`}
          >
            <div className="relative w-28 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
               <img src={resource.thumbnail} alt={resource.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
               <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                 {resource.type === 'video' ? <PlayCircle className="text-white w-8 h-8 drop-shadow-lg" /> : <FileText className="text-white w-8 h-8 drop-shadow-lg" />}
               </div>
               <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded font-medium backdrop-blur-sm">
                 {resource.duration}
               </div>
            </div>
            
            <div className="flex flex-col justify-between flex-1 py-1">
              <div>
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      resource.category === 'Math' ? 'bg-blue-50 text-blue-600' :
                      resource.category === 'Pedagogy' ? 'bg-purple-50 text-purple-600' :
                      resource.category === 'Science' ? 'bg-green-50 text-green-600' :
                      resource.category === 'Hindi' ? 'bg-orange-50 text-orange-600' :
                      'bg-gray-50 text-gray-600'
                  }`}>
                      {resource.category}
                  </span>
                  {user?.subject === resource.category && (
                      <span className="text-[10px] font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">Recommended</span>
                  )}
                </div>
                <h3 className="font-bold text-dark text-sm leading-tight line-clamp-2">{resource.title}</h3>
              </div>
              
              <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                 <span className="text-[10px] text-gray-400 font-medium">{resource.difficulty}</span>
                 <div className="text-gray-400 group-hover:text-primary transition-colors flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide">
                   <span>Watch</span>
                   <ExternalLink className="w-3 h-3" />
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Weekly Goal Widget */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl flex items-center gap-4 border border-blue-100">
         <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
            <CheckCircle className="w-6 h-6" />
         </div>
         <div className="flex-1">
            <p className="text-sm font-bold text-blue-900">Weekly Goal</p>
            <div className="w-full bg-blue-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full w-1/3"></div>
            </div>
            <p className="text-[10px] text-blue-600 mt-1 font-medium">1 of 3 resources completed</p>
         </div>
      </div>
    </div>
  );
};
