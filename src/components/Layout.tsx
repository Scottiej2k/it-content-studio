import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { BookOpen, Settings, Home, Layers, PlayCircle, Library, Download, Mic, LogIn, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../AuthProvider';
import { signInWithGoogle, logout } from '../firebase';
import { useGenerationQueue } from '../hooks/useGenerationQueue';

import { useStore } from '../store/useStore';
import { useWakeLock } from '../hooks/useWakeLock';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export function Layout() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const { isGenerating, isBatchRunning, isProcessingQueue, firebaseUsage } = useStore();
  
  const [isCollapsed, setIsCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');

  const toggleSidebar = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  useGenerationQueue();
  useWakeLock(isGenerating || isBatchRunning || isProcessingQueue);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: Home },
    { name: 'World Setup', path: '/world-setup', icon: Layers },
    { name: 'Generate', path: '/generate', icon: PlayCircle },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Export', path: '/export', icon: Download },
    { name: 'TTS', path: '/tts', icon: Mic },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-stone-50 text-stone-900 font-sans relative overflow-hidden">
      {/* Sidebar Toggle Handle */}
      <button
        onClick={toggleSidebar}
        className={cn(
          "absolute top-6 z-40 bg-white hover:bg-indigo-50 border border-stone-200 rounded-full shadow-md w-6 h-6 flex items-center justify-center transition-all duration-300 focus:outline-none hover:border-indigo-300 group cursor-pointer",
          isCollapsed ? "left-4" : "left-[244px]"
        )}
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-indigo-600 transition-colors" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-stone-500 group-hover:text-indigo-600 transition-colors" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "bg-white border-r border-stone-200 flex flex-col transition-all duration-300 shrink-0 relative",
        isCollapsed ? "w-0 overflow-hidden border-r-0" : "w-64"
      )}>
        <div className="p-6 border-b border-stone-200 shrink-0">
          <h1 className="text-xl font-semibold flex items-center gap-2 text-indigo-900">
            <BookOpen className="w-6 h-6 shrink-0" />
            <span className="truncate">Content Studio</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1 truncate">Italian A1-B2 Generator</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-indigo-50 text-indigo-700" 
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-200 shrink-0">
          {user && (
            <div className="mb-4 space-y-3 p-3 bg-stone-50 rounded-lg border border-stone-100 overflow-hidden">
              <div className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider flex justify-between truncate">
                <span>Daily Firebase Quota</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-stone-600 truncate">
                  <span>Reads</span>
                  <span>{firebaseUsage.reads.toLocaleString()} <span className="text-stone-400">/ 50k</span></span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={cn("h-1.5 rounded-full transition-all", firebaseUsage.reads > 40000 ? "bg-red-500" : "bg-indigo-500")} 
                    style={{ width: `${Math.min(100, (firebaseUsage.reads / 50000) * 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-stone-600 truncate">
                  <span>Writes</span>
                  <span>{firebaseUsage.writes.toLocaleString()} <span className="text-stone-400">/ 20k</span></span>
                </div>
                <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={cn("h-1.5 rounded-full transition-all", firebaseUsage.writes > 15000 ? "bg-red-500" : "bg-emerald-500")} 
                    style={{ width: `${Math.min(100, (firebaseUsage.writes / 20000) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div className="min-h-[72px] flex flex-col justify-center">
            {loading ? (
              <div className="flex items-center justify-center p-2">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : user ? (
              <div className="flex flex-col gap-2">
                <div className="text-xs text-stone-500 px-3 truncate">
                  {user.email}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors w-full text-left truncate"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition-colors w-full text-left truncate"
              >
                <LogIn className="w-5 h-5 shrink-0" />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col relative">
        <div className={cn(
          "flex-1 overflow-y-auto transition-all duration-300",
          isCollapsed ? "pl-14 pr-8 py-8" : "p-8"
        )}>
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
