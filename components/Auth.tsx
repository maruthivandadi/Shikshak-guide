
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignup: (email: string, pass: string, name: string) => Promise<void>;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(false); // Default to Sign Up
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        if (!name.trim()) throw new Error("Please enter your name");
        await onSignup(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
      {/* Added animate-in zoom-in-90 for popup effect */}
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl shadow-indigo-200 border border-white overflow-hidden animate-in zoom-in-90 duration-500 ease-out fill-mode-both">
        {/* Header */}
        <div className="bg-primary p-8 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-2xl font-bold font-serif mb-1 tracking-wide">Shikshak<span className="text-accent">.</span>Guide</h1>
            <p className="text-indigo-100 text-sm">Your Royal Teaching Companion</p>
          </div>
          <div className="absolute top-0 right-0 p-10 bg-indigo-500 rounded-full blur-2xl -mr-10 -mt-10 opacity-50"></div>
          <div className="absolute bottom-0 left-0 p-8 bg-secondary rounded-full blur-xl -ml-8 -mb-8 opacity-30"></div>
        </div>

        {/* Form */}
        <div className="p-8">
          <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-xl">
             {/* Swapped order: Sign Up first */}
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Log In
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1 animate-in slide-in-from-top-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Full Name</label>
                <input
                  type="text"
                  required={!isLogin}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="e.g. Sunita Sharma"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium"
                placeholder="name@school.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 rounded-xl border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all pr-10 text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl font-medium flex items-center gap-2 animate-in slide-in-from-top-1 border border-red-100">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 mt-4 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Welcome Back" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {!isLogin && (
            <div className="mt-6 flex items-start gap-2 text-xs text-indigo-600 bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <p>Creating an account saves your lesson plans, stats, and profile so you can access them from any device.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
