import { useStore } from '../store/useStore';
import { BookOpen, CheckCircle, Clock, AlertCircle, Globe, LogIn } from 'lucide-react';
import { useAuth } from '../AuthProvider';
import { signInWithGoogle } from '../firebase';

export function Dashboard() {
  const chapters = useStore(state => state.chapters);
  const { user, loading } = useAuth();
  
  const stats = {
    total: chapters.length,
    completed: chapters.filter(c => c.status === 'complete' || c.status === 'final').length,
    generating: chapters.filter(c => c.status === 'generating').length,
    failed: chapters.filter(c => c.status === 'failed').length,
    pending: chapters.filter(c => c.status === 'pending').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 mt-2">Overview of your Italian language curriculum generation.</p>
      </header>

      {!loading && !user && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-center justify-between shadow-sm">
          <div>
            <h2 className="text-lg font-semibold text-indigo-900">Sign in to save your progress</h2>
            <p className="text-indigo-700 mt-1">Your generated chapters will be saved securely to your account.</p>
          </div>
          <button
            onClick={signInWithGoogle}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 text-indigo-600 mb-2">
            <Globe className="w-5 h-5" />
            <h3 className="font-medium">World Bible</h3>
          </div>
          <p className="text-lg font-semibold text-emerald-600">Finalized</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 text-stone-600 mb-2">
            <BookOpen className="w-5 h-5" />
            <h3 className="font-medium">Total Chapters</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.total}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-600 mb-2">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-medium">Completed</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.completed}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 text-amber-600 mb-2">
            <Clock className="w-5 h-5" />
            <h3 className="font-medium">Pending</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.pending}</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <div className="flex items-center gap-3 text-red-600 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-medium">Failed</h3>
          </div>
          <p className="text-3xl font-semibold">{stats.failed}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
          <h2 className="font-semibold text-stone-800">Recent Activity</h2>
        </div>
        <div className="p-6">
          {chapters.length > 0 ? (
            <div className="space-y-4">
              {chapters.slice(0, 5).map(chapter => (
                <div key={chapter.id} className="flex items-center justify-between py-2 border-b border-stone-100 last:border-0">
                  <div>
                    <p className="font-medium text-stone-800">Chapter {chapter.chapterNumber}: {chapter.title}</p>
                    <p className="text-sm text-stone-500">CEFR: {chapter.cefrLevel}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    chapter.status === 'complete' || chapter.status === 'final' ? 'bg-emerald-100 text-emerald-800' :
                    chapter.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                    chapter.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-stone-100 text-stone-800'
                  }`}>
                    {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-8">{!user ? 'Sign in to view your recent activity.' : 'No chapters generated yet.'}</p>
          )}
        </div>
      </div>
    </div>
  );
}
