
import React, { useState, useEffect } from 'react';
import { Home, BookOpen, BarChart2, User, Mic, X, Check, Clock, Users, Save, Edit3, ChevronRight, AlertTriangle, Sparkles, ThumbsUp } from 'lucide-react';
import { AppView, UserProfile, UserStats, DailyActivity } from './types';
import { DEFAULT_USER, DEFAULT_STATS, MOTIVATIONAL_QUOTES, SUBJECT_PLANS, SCHOOL_OPTIONS } from './constants';
import { Dashboard } from './components/Dashboard';
import { MicroLearning } from './components/MicroLearning';
import { QuerySystem } from './components/QuerySystem';

// --- Helper for Storage ---
const loadData = () => {
    const savedUser = localStorage.getItem('shiksha_user');
    const savedStats = localStorage.getItem('shiksha_stats');
    return {
        user: savedUser ? JSON.parse(savedUser) : DEFAULT_USER,
        stats: savedStats ? JSON.parse(savedStats) : DEFAULT_STATS
    };
};

const saveData = (user: UserProfile, stats: UserStats) => {
    localStorage.setItem('shiksha_user', JSON.stringify(user));
    localStorage.setItem('shiksha_stats', JSON.stringify(stats));
};

// --- Home View ---

const HomeView: React.FC<{ 
    onAsk: () => void; 
    user: UserProfile; 
    onNavigate: (view: AppView) => void;
}> = ({ onAsk, user, onNavigate }) => {
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  
  // State to track if user wants extra tasks and completion flow
  const [planOffset, setPlanOffset] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const displayName = user.name ? user.name.split(' ')[0] : "Teacher";
  const isProfileComplete = user.grade && user.subject;
  
  // Logic to rotate plans daily: Use day of year + offset to pick an index
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  
  const availablePlans = (isProfileComplete && SUBJECT_PLANS[user.subject]) 
      ? SUBJECT_PLANS[user.subject] 
      : SUBJECT_PLANS["default"];
      
  const plan = availablePlans[(dayOfYear + planOffset) % availablePlans.length];

  const handleCloseModal = () => {
      setIsPlanOpen(false);
      setShowCompletion(false);
  };

  const handleNextTask = () => {
      setPlanOffset(prev => prev + 1);
      setShowCompletion(false);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
           <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Shiksha Sahayak</p>
           <h1 className="text-2xl font-bold text-dark mt-1">Namaste, {displayName} <span className="text-2xl">🙏</span></h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-400 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
           {displayName.charAt(0)}
        </div>
      </div>

      {/* Today Card */}
      <div className="bg-dark rounded-2xl p-6 text-white shadow-xl shadow-dark/20 relative overflow-hidden group">
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
             <h2 className="text-lg font-bold">Today's Focus</h2>
             <span className="bg-white/20 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-semibold">Priority</span>
          </div>
          
          <p className="opacity-90 leading-relaxed mb-6 text-sm">
            {isProfileComplete 
                ? `You have a ${user.grade} ${user.subject} class. We have prepared a lesson plan for you.`
                : "Complete your profile to get personalized class plans for today."}
          </p>
          
          {isProfileComplete ? (
              <button 
                onClick={() => setIsPlanOpen(true)}
                className="bg-white text-dark px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform flex items-center gap-2 group-hover:gap-3"
              >
                View {user.subject || "Daily"} Plan <ChevronRight className="w-4 h-4" />
              </button>
          ) : (
             <button 
                onClick={() => onNavigate(AppView.PROFILE)}
                className="bg-white text-dark px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg animate-pulse active:scale-95 transition-transform flex items-center gap-2"
             >
                Setup Profile Now <ChevronRight className="w-4 h-4" />
             </button>
          )}
        </div>
        {/* Decorative Circle */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-t from-primary to-transparent rounded-full opacity-30 blur-2xl group-hover:opacity-50 transition-opacity"></div>
      </div>

      {/* Plan Modal */}
      {isPlanOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-5">
                {!showCompletion ? (
                    <>
                        <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-dark">{plan.title}</h3>
                            <p className="text-sm text-gray-500">{user.grade} • {user.subject}</p>
                        </div>
                        <button onClick={handleCloseModal} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        </div>
                        
                        <div className="flex gap-4 mb-6">
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Clock className="w-3 h-3" /> {plan.duration}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                            <Users className="w-3 h-3" /> {plan.groupSize}
                        </div>
                        </div>

                        <div className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-sm mb-1">Preparation</h4>
                            <p className="text-sm text-blue-700">{plan.prep}</p>
                        </div>

                        <div>
                            <h4 className="font-bold text-dark text-sm mb-2">Steps:</h4>
                            <ol className="list-decimal pl-4 space-y-3 text-sm text-gray-700">
                                {plan.steps.map((step: string, idx: number) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ol>
                        </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button 
                                onClick={handleCloseModal} 
                                className="flex-1 bg-white border border-gray-200 text-gray-700 font-bold py-3 rounded-xl shadow-sm active:scale-95 transition-transform"
                            >
                                Close
                            </button>
                            <button 
                                onClick={() => setShowCompletion(true)} 
                                className="flex-1 bg-secondary text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 active:scale-95 transition-transform"
                            >
                                <Check className="w-5 h-5" /> Mark Done
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <ThumbsUp className="w-10 h-10 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-dark mb-2">Great Job, {displayName}! 🎉</h3>
                        <p className="text-sm text-gray-500 mb-8 max-w-[250px]">
                            You've completed this activity. Would you like to see another task for today?
                        </p>
                        
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={handleNextTask}
                                className="w-full bg-secondary text-white font-bold py-3.5 rounded-xl shadow-lg shadow-secondary/20 active:scale-95 transition-transform flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-5 h-5" /> Yes, Give me another
                            </button>
                            <button 
                                onClick={handleCloseModal}
                                className="w-full bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl active:scale-95 transition-transform"
                            >
                                No, I'm done for now
                            </button>
                        </div>
                    </div>
                )}
              </div>
           </div>
        </div>
      )}

      {/* Quick Access Tiles */}
      <div>
        <h3 className="font-semibold text-dark mb-3 text-sm text-gray-500 uppercase tracking-wide">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
           <button onClick={onAsk} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 aspect-[4/3] active:bg-gray-50 active:scale-95 transition-all group">
              <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:bg-blue-100 transition-colors">
                <Mic className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-dark">Ask Assistant</span>
           </button>
           <button onClick={() => onNavigate(AppView.LEARN)} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 aspect-[4/3] active:bg-gray-50 active:scale-95 transition-all group">
              <div className="bg-green-50 p-4 rounded-full text-green-600 group-hover:bg-green-100 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-bold text-sm text-dark">Browse Solutions</span>
           </button>
        </div>
      </div>
      
      {/* Quote */}
      <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-3 items-start">
        <span className="text-4xl text-gray-300 font-serif leading-none">"</span>
        <p className="italic text-gray-600 text-sm mt-1">{quote}</p>
      </div>

    </div>
  );
};

// --- Profile View Component ---

const ProfileView: React.FC<{ 
    user: UserProfile; 
    onUpdate: (u: UserProfile) => void;
    onNavigate: (view: AppView) => void; 
}> = ({ user, onUpdate, onNavigate }) => {
  const [formData, setFormData] = useState(user);
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  
  // Calculate profile completion
  const fields = [formData.name, formData.grade, formData.subject, formData.school, formData.language];
  const filledFields = fields.filter(f => f && f.trim().length > 0 && f !== "Not Set").length;
  const progress = Math.round((filledFields / fields.length) * 100);

  // Check if form has changed from saved data
  useEffect(() => {
    const isChanged = JSON.stringify(formData) !== JSON.stringify(user);
    setIsDirty(isChanged);
    // Reset saved state if user modifies form again
    if (isChanged) setSaved(false);
  }, [formData, user]);

  const getProgressColor = () => {
      if (progress < 50) return 'bg-red-500';
      if (progress < 80) return 'bg-yellow-500';
      return 'bg-green-500';
  };

  const handleSave = () => {
    onUpdate(formData);
    setSaved(true);
    setIsDirty(false); // Reset dirty state as it is now saved
    
    // Redirect after a short delay
    setTimeout(() => {
        onNavigate(AppView.HOME);
    }, 1500);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
       <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark">My Profile</h2>
          <p className="text-gray-500 text-sm">Customize your AI Coach</p>
        </div>
      </header>

      {/* Profile Completion Card */}
      <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 relative overflow-hidden">
         <div className="flex justify-between items-center mb-2 relative z-10">
            <span className="text-sm font-bold text-dark flex items-center gap-2">
                {progress === 100 ? <Sparkles className="w-4 h-4 text-accent" /> : <AlertTriangle className="w-4 h-4 text-orange-400" />}
                Profile Strength
            </span>
            <span className={`text-sm font-bold ${progress === 100 ? 'text-green-600' : 'text-gray-600'}`}>{progress}%</span>
         </div>
         
         <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-3 relative z-10">
            <div 
                className={`h-3 rounded-full transition-all duration-1000 ease-out ${getProgressColor()}`} 
                style={{ width: `${progress}%` }}
            ></div>
         </div>
         
         <p className="text-xs text-gray-500 leading-relaxed relative z-10">
            {progress === 100 
                ? "Excellent! Your AI coach is fully personalized for your classroom." 
                : "Add details like School and Grade to get specific, localized advice."}
         </p>

         {progress === 100 && (
             <div className="absolute top-0 right-0 p-10 bg-green-50 rounded-full blur-2xl -mr-10 -mt-10"></div>
         )}
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-dark text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Basic Info</h3>
            
            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">Your Name</label>
                <input 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-dark placeholder:text-gray-400 font-medium"
                    placeholder="e.g. Sunita Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
            </div>

            <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">School Name</label>
                <input 
                    list="school-options"
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none transition-all text-dark placeholder:text-gray-400 font-medium"
                    placeholder="Select or Type School Name"
                    value={formData.school}
                    onChange={(e) => setFormData({...formData, school: e.target.value})}
                />
                <datalist id="school-options">
                    {SCHOOL_OPTIONS.map((school, index) => (
                        <option key={index} value={school} />
                    ))}
                </datalist>
            </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="font-bold text-dark text-sm uppercase tracking-wide border-b border-gray-100 pb-2">Classroom Context</h3>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Grade</label>
                    <select 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-secondary outline-none text-dark font-medium"
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                    >
                        <option value="">Select</option>
                        <option value="Grade 1">Grade 1</option>
                        <option value="Grade 2">Grade 2</option>
                        <option value="Grade 3">Grade 3</option>
                        <option value="Grade 4">Grade 4</option>
                        <option value="Grade 5">Grade 5</option>
                    </select>
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
                    <select 
                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-secondary outline-none text-dark font-medium"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    >
                        <option value="">Select</option>
                        <option value="Math">Math</option>
                        <option value="Science">Science</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Social Studies">Social Studies</option>
                    </select>
                </div>
            </div>

             <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">App Language</label>
                <select 
                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-secondary outline-none text-dark font-medium"
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                </select>
            </div>
        </div>
      </div>
      
      {/* Floating Save Button */}
      <button 
        onClick={handleSave}
        disabled={!isDirty && !saved}
        className={`w-full text-white font-bold py-4 rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 
            ${saved ? 'bg-green-500' : (!isDirty ? 'bg-gray-400 cursor-not-allowed' : 'bg-dark shadow-dark/20')}`}
      >
        {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
        {saved ? "Saved! Redirecting..." : "Save Profile"}
      </button>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [stats, setStats] = useState<UserStats>(DEFAULT_STATS);

  // Initialize Data from Storage
  useEffect(() => {
    const { user, stats } = loadData();
    setUser(user);
    setStats(stats);
  }, []);

  // Update logic to save to storage
  const updateUser = (newUser: UserProfile) => {
      setUser(newUser);
      saveData(newUser, stats);
  };

  const updateStats = (action: 'query' | 'view_resource') => {
      const today = new Date().toISOString().split('T')[0];
      const newStats = { ...stats };
      
      // Update basic counters
      if (action === 'query') newStats.totalQueries++;
      if (action === 'view_resource') newStats.resourcesViewed++;

      // Update Streak
      if (newStats.lastActiveDate !== today) {
         // Naive streak logic: if yesterday was active, inc, else reset (omitted complex date math for brevity)
         // For now, just increment usage on new days
         newStats.lastActiveDate = today;
         newStats.currentStreak++;
      }

      // Update Weekly Activity
      const dayName = new Date().toLocaleDateString('en-US', { weekday: 'short' });
      // Find today's entry in weekly activity or add it
      const existingDay = newStats.weeklyActivity.find(d => d.date === dayName);
      if (existingDay) {
          existingDay.count++;
      } else {
          newStats.weeklyActivity.push({ date: dayName, count: 1 });
          // Keep only last 7 days
          if (newStats.weeklyActivity.length > 7) newStats.weeklyActivity.shift();
      }

      setStats(newStats);
      saveData(user, newStats);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative shadow-2xl overflow-hidden font-sans">
      
      {/* Top Status Bar Simulator */}
      <div className="bg-white px-4 py-2 flex justify-between items-center text-[10px] font-bold text-gray-400 sticky top-0 z-20 border-b border-gray-50 backdrop-blur-sm bg-white/90">
        <span>SHIKSHA SAHAYAK v1.3</span>
        <div className="flex gap-2 items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span>ONLINE</span>
        </div>
      </div>

      {/* Content Rendering */}
      <main className="min-h-screen bg-gray-50">
        {currentView === AppView.HOME && (
            <HomeView 
                onAsk={() => setIsQueryOpen(true)} 
                user={user} 
                onNavigate={setCurrentView} 
            />
        )}
        {currentView === AppView.LEARN && (
            <MicroLearning user={user} onActivity={() => updateStats('view_resource')} />
        )}
        {currentView === AppView.DASHBOARD && (
            <Dashboard stats={stats} />
        )}
        {currentView === AppView.PROFILE && (
           <ProfileView user={user} onUpdate={updateUser} onNavigate={setCurrentView} />
        )}
      </main>

      {/* Floating Action Button (FAB) - Centered */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <button 
          onClick={() => setIsQueryOpen(true)}
          className="bg-primary hover:bg-[#ff5252] text-white w-16 h-16 rounded-full shadow-xl shadow-primary/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ring-4 ring-white"
        >
          <Mic className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-20 shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-between items-center px-6 py-3 max-w-md mx-auto">
          <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.HOME ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Home className={`w-6 h-6 ${currentView === AppView.HOME ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(AppView.LEARN)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.LEARN ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BookOpen className={`w-6 h-6 ${currentView === AppView.LEARN ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Learn</span>
          </button>

          {/* Spacer for FAB */}
          <div className="w-12"></div>

          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.DASHBOARD ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <BarChart2 className={`w-6 h-6 ${currentView === AppView.DASHBOARD ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Stats</span>
          </button>

          <button 
            onClick={() => setCurrentView(AppView.PROFILE)}
            className={`flex flex-col items-center gap-1 transition-colors ${currentView === AppView.PROFILE ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <User className={`w-6 h-6 ${currentView === AppView.PROFILE ? 'fill-current' : ''}`} />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Query System Overlay */}
      {isQueryOpen && (
        <QuerySystem 
            onClose={() => setIsQueryOpen(false)} 
            user={user} 
            onActivity={() => updateStats('query')}
        />
      )}
    </div>
  );
};

export default App;
