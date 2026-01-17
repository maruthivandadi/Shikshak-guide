import React, { useState } from 'react';
import { Home, BookOpen, BarChart2, User, Mic, X, Check, Clock, Users, Save, Edit3 } from 'lucide-react';
import { AppView, UserProfile } from './types';
import { DEFAULT_USER, MOTIVATIONAL_QUOTES } from './constants';
import { Dashboard } from './components/Dashboard';
import { MicroLearning } from './components/MicroLearning';
import { QuerySystem } from './components/QuerySystem';

// --- Small Internal Components for Home View ---

const HomeView: React.FC<{ onAsk: () => void; user: UserProfile }> = ({ onAsk, user }) => {
  const quote = MOTIVATIONAL_QUOTES[0];
  const [isPlanOpen, setIsPlanOpen] = useState(false);
  
  return (
    <div className="p-4 space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
           <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Good Morning</p>
           <h1 className="text-2xl font-bold text-dark mt-1">{user.name.split(' ')[0]} Ma'am <span className="text-2xl">🙏</span></h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold">
           {user.name.charAt(0)}
        </div>
      </div>

      {/* Today Card */}
      <div className="bg-gradient-to-br from-primary to-orange-400 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-lg font-bold mb-2">Today's Focus</h2>
          <p className="opacity-90 leading-relaxed mb-4">
            You have a {user.grade} {user.subject} class at 10 AM. Try the "Group Fraction Activity" we saved yesterday?
          </p>
          <button 
            onClick={() => setIsPlanOpen(true)}
            className="bg-white text-primary px-4 py-2 rounded-full text-sm font-bold shadow-sm active:scale-95 transition-transform"
          >
            View Plan
          </button>
        </div>
        {/* Decorative Circle */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>
      </div>

      {/* Plan Modal */}
      {isPlanOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                   <div>
                     <h3 className="text-xl font-bold text-dark">Group Fraction Activity</h3>
                     <p className="text-sm text-gray-500">{user.grade} • {user.subject}</p>
                   </div>
                   <button onClick={() => setIsPlanOpen(false)} className="p-1 bg-gray-100 rounded-full hover:bg-gray-200">
                     <X className="w-5 h-5 text-gray-600" />
                   </button>
                </div>
                
                <div className="flex gap-4 mb-6">
                   <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      <Clock className="w-3 h-3" /> 15 Mins
                   </div>
                   <div className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      <Users className="w-3 h-3" /> Groups of 4
                   </div>
                </div>

                <div className="space-y-4">
                   <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <h4 className="font-bold text-blue-800 text-sm mb-1">Preparation</h4>
                      <p className="text-sm text-blue-700">Collect 20 small stones or leaves per group before class.</p>
                   </div>

                   <div>
                      <h4 className="font-bold text-dark text-sm mb-2">Steps:</h4>
                      <ol className="list-decimal pl-4 space-y-3 text-sm text-gray-700">
                         <li>Divide class into groups of 4 students each.</li>
                         <li>Ask each group to pick 12 stones.</li>
                         <li>"Show me 1/2 of your stones." (They should separate 6).</li>
                         <li>"Show me 1/4 of your stones." (They should separate 3).</li>
                         <li>Ask them to draw the groups in their notebooks.</li>
                      </ol>
                   </div>
                </div>

                <button onClick={() => setIsPlanOpen(false)} className="w-full bg-secondary text-white font-bold py-3 rounded-xl mt-6 flex items-center justify-center gap-2">
                   <Check className="w-5 h-5" /> I'm Ready!
                </button>
              </div>
           </div>
        </div>
      )}

      {/* Quote */}
      <div className="bg-white p-4 rounded-xl border-l-4 border-accent shadow-sm italic text-gray-600 text-sm">
        "{quote}"
      </div>

      {/* Quick Access Tiles */}
      <div>
        <h3 className="font-semibold text-dark mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
           <button onClick={onAsk} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 aspect-[4/3] active:bg-gray-50">
              <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                <Mic className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-dark">Ask Assistant</span>
           </button>
           <button className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-2 aspect-[4/3] active:bg-gray-50">
              <div className="bg-green-100 p-3 rounded-full text-green-600">
                <BookOpen className="w-6 h-6" />
              </div>
              <span className="font-medium text-sm text-dark">Browse Solutions</span>
           </button>
        </div>
      </div>
    </div>
  );
};

// --- Profile View Component ---

const ProfileView: React.FC<{ user: UserProfile; onUpdate: (u: UserProfile) => void }> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <div className="p-4 space-y-6 pb-24">
       <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-dark">My Profile</h2>
          <p className="text-gray-500">Manage your classroom settings</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`p-2 rounded-full ${isEditing ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
        >
          {isEditing ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
        </button>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
         <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary text-3xl font-bold mb-4">
            {formData.name.charAt(0)}
         </div>
         {isEditing ? (
            <input 
              className="text-center font-bold text-lg border-b border-gray-300 focus:border-primary outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
         ) : (
            <h3 className="text-xl font-bold text-dark">{user.name}</h3>
         )}
         <p className="text-gray-500 text-sm">{user.school}</p>
      </div>

      <div className="space-y-4">
         <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-semibold text-dark mb-4 text-sm uppercase tracking-wide">Classroom Context</h3>
            <div className="grid grid-cols-1 gap-4">
               <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Grade</label>
                  {isEditing ? (
                     <input 
                        className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                        value={formData.grade}
                        onChange={(e) => setFormData({...formData, grade: e.target.value})}
                     />
                  ) : (
                     <p className="text-dark font-medium">{user.grade}</p>
                  )}
               </div>
               <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Subject</label>
                  {isEditing ? (
                     <input 
                        className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                     />
                  ) : (
                     <p className="text-dark font-medium">{user.subject}</p>
                  )}
               </div>
               <div>
                  <label className="text-xs text-gray-400 font-medium block mb-1">Language Preference</label>
                  {isEditing ? (
                     <select 
                        className="w-full p-2 bg-gray-50 rounded-lg border border-gray-200"
                        value={formData.language}
                        onChange={(e) => setFormData({...formData, language: e.target.value})}
                     >
                        <option>Hindi</option>
                        <option>English</option>
                        <option>Tamil</option>
                        <option>Telugu</option>
                     </select>
                  ) : (
                     <p className="text-dark font-medium">{user.language}</p>
                  )}
               </div>
            </div>
         </div>
      </div>
      
      {isEditing && (
        <p className="text-center text-xs text-primary animate-pulse">Save changes to update Assistant context.</p>
      )}
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-50 relative shadow-2xl overflow-hidden">
      
      {/* Top Status Bar Simulator */}
      <div className="bg-white px-4 py-2 flex justify-between items-center text-[10px] font-bold text-gray-400 sticky top-0 z-20 border-b border-gray-50">
        <span>SHIKSHA SAHAYAK</span>
        <div className="flex gap-2 items-center">
            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded">ONLINE</span>
            <span>ENG</span>
        </div>
      </div>

      {/* Content Rendering */}
      <main className="min-h-screen bg-gray-50">
        {currentView === AppView.HOME && <HomeView onAsk={() => setIsQueryOpen(true)} user={user} />}
        {currentView === AppView.LEARN && <MicroLearning />}
        {currentView === AppView.DASHBOARD && <Dashboard />}
        {currentView === AppView.PROFILE && (
           <ProfileView user={user} onUpdate={setUser} />
        )}
      </main>

      {/* Floating Action Button (FAB) - Centered */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
        <button 
          onClick={() => setIsQueryOpen(true)}
          className="bg-primary hover:bg-red-500 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ring-4 ring-white"
        >
          <Mic className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-20">
        <div className="flex justify-between items-center px-6 py-3 max-w-md mx-auto">
          <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.HOME ? 'text-primary' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(AppView.LEARN)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.LEARN ? 'text-primary' : 'text-gray-400'}`}
          >
            <BookOpen className="w-6 h-6" />
            <span className="text-[10px] font-medium">Learn</span>
          </button>

          {/* Spacer for FAB */}
          <div className="w-12"></div>

          <button 
            onClick={() => setCurrentView(AppView.DASHBOARD)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.DASHBOARD ? 'text-primary' : 'text-gray-400'}`}
          >
            <BarChart2 className="w-6 h-6" />
            <span className="text-[10px] font-medium">Stats</span>
          </button>

          <button 
            onClick={() => setCurrentView(AppView.PROFILE)}
            className={`flex flex-col items-center gap-1 ${currentView === AppView.PROFILE ? 'text-primary' : 'text-gray-400'}`}
          >
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav>

      {/* Query System Overlay */}
      {isQueryOpen && (
        <QuerySystem 
            onClose={() => setIsQueryOpen(false)} 
            user={user} 
        />
      )}
    </div>
  );
};

export default App;