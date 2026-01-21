
import React from 'react';
import { BookOpen, ArrowRight, Star } from 'lucide-react';

export const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark via-indigo-950 to-dark flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract Royal Background */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(67,56,202,0.15),transparent_70%)]" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
        
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#fbbf24 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center animate-in zoom-in duration-700 fade-in fill-mode-both">
            
            {/* Logo Construction */}
            <div className="mb-12 relative group cursor-pointer animate-float" onClick={onComplete}>
                {/* Decorative outer ring */}
                <div className="absolute inset-0 border border-accent/30 rounded-full scale-150 animate-pulse-slow"></div>
                
                {/* Main Logo Shield */}
                <div className="w-32 h-32 bg-gradient-to-br from-gray-900 to-black rounded-3xl rotate-45 border-2 border-accent/40 shadow-[0_0_50px_-10px_rgba(251,191,36,0.3)] flex items-center justify-center relative z-10 transition-transform duration-500 ease-out group-hover:scale-105">
                    <div className="-rotate-45 relative flex items-center justify-center">
                        <BookOpen className="w-14 h-14 text-accent drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]" />
                        {/* Centered Star */}
                        <Star className="w-6 h-6 text-white absolute -top-4 left-1/2 transform -translate-x-1/2 fill-current animate-pulse" />
                    </div>
                </div>
                
                {/* Gold Glow behind logo */}
                <div className="absolute inset-0 bg-accent/20 rounded-3xl rotate-45 blur-2xl -z-10 group-hover:bg-accent/40 transition-colors duration-500" />
            </div>

            <h1 className="text-5xl font-serif font-bold text-white mb-4 tracking-tight drop-shadow-xl">
                Shikshak<span className="text-accent">.</span>Guide
            </h1>
            
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-accent to-transparent mb-8 rounded-full"></div>

            <p className="text-indigo-200 text-base max-w-[280px] leading-relaxed mb-12 font-medium">
                Empowering the Royal Educators of India with AI Wisdom & Tools.
            </p>

            <button
                onClick={onComplete}
                className="group relative bg-white text-dark pl-8 pr-2 py-2 rounded-full font-bold text-sm tracking-wide shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all active:scale-95 flex items-center gap-4 overflow-hidden"
            >
                <span className="relative z-10 uppercase text-xs tracking-widest py-2">Enter Classroom</span>
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center relative z-10 group-hover:bg-accent group-hover:text-dark transition-colors shadow-lg">
                     <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
            </button>
        </div>
    </div>
  );
};
