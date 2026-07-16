import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { useAuth } from '../AuthProvider';
import { Search, Filter, MoreVertical, Eye, Trash2, X, CheckCircle2, AlertCircle, Loader2, History, Trash, RefreshCw } from 'lucide-react';

export function Library() {
  const { user } = useAuth();
  const chapters = useStore(state => state.chapters);
  const deleteChapter = useStore(state => state.deleteChapter);
  const addToQueue = useStore(state => state.addToQueue);
  const removeFromQueue = useStore(state => state.removeFromQueue);
  const updateChapter = useStore(state => state.updateChapter);
  const generationQueue = useStore(state => state.generationQueue);
  const queueCompleted = useStore(state => state.queueCompleted);
  const queueFailed = useStore(state => state.queueFailed);
  const clearQueueStatus = useStore(state => state.clearQueueStatus);
  const isProcessingQueue = useStore(state => state.isProcessingQueue);
  const syncAllChapters = useStore(state => state.syncAllChapters);
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSyncing(true);
    try {
      await syncAllChapters();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.grammarFocus.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cefrLevel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getChapterInfo = (id: string) => {
    return chapters.find(c => c.id === id);
  };

  return (
    <div className="flex gap-8 items-start h-full">
      <div className="flex-1 space-y-6 min-w-0">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">Episode List</h1>
            <p className="text-stone-500 mt-2">Manage and edit generated content.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input 
                type="text" 
                placeholder="Search episodes..." 
                className="pl-10 pr-4 py-2 border border-stone-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md shadow-sm text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Sync cached episodes with database server"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Database'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-md shadow-sm text-sm font-medium text-stone-700 bg-white hover:bg-stone-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </header>

        <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-x-auto relative">
          <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50 sticky top-0 z-10">
            <tr>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider sticky left-0 bg-stone-50 z-20">Episode Focus</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">CEFR</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Word Bank</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Grammar Lesson</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Side-by-Side</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">EPUB</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Words</th>
              <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Last Modified</th>
              <th scope="col" className="relative px-3 py-3"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-stone-200">
            {filteredChapters.map((chapter) => (
              <tr 
                key={chapter.id} 
                onClick={() => navigate(`/library/${chapter.id}`)}
                className="hover:bg-stone-50 transition-colors group cursor-pointer"
              >
                <td className="px-3 py-2 whitespace-nowrap sticky left-0 bg-white z-10 group-hover:bg-stone-50 transition-colors">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-stone-900">
                      <span className="text-stone-400 mr-2 w-10 inline-block">{chapter.chapterNumber}</span>
                      {chapter.grammarFocus}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">
                    {chapter.cefrLevel}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    chapter.status === 'complete' || chapter.status === 'final' ? 'bg-emerald-100 text-emerald-800' :
                    chapter.status === 'generating' ? 'bg-blue-100 text-blue-800' :
                    chapter.status === 'failed' ? 'bg-red-100 text-red-800' :
                    'bg-stone-100 text-stone-800'
                  }`}>
                    {chapter.status.charAt(0).toUpperCase() + chapter.status.slice(1)}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {chapter.isGeneratingWordBank || generationQueue.some(t => t.id === `${chapter.id}-wordbank`) ? (
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(`${chapter.id}-wordbank`);
                          updateChapter(chapter.id, { isGeneratingWordBank: false });
                        }}
                        className="ml-2 text-stone-400 hover:text-red-500 transition-colors"
                        title="Cancel Generation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : chapter.wordBankJson && chapter.wordBankJson.length > 0 ? (
                    <div className="group/wb relative inline-flex items-center">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 group-hover/wb:hidden">
                        Generated
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue({ id: `${chapter.id}-wordbank`, chapterId: chapter.id, type: 'wordbank' });
                        }}
                        className="hidden group-hover/wb:inline-flex px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue({ id: `${chapter.id}-wordbank`, chapterId: chapter.id, type: 'wordbank' });
                      }}
                      className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      Generate
                    </button>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {chapter.isGeneratingGrammar || generationQueue.some(t => t.id === `${chapter.id}-grammar`) ? (
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(`${chapter.id}-grammar`);
                          updateChapter(chapter.id, { isGeneratingGrammar: false });
                        }}
                        className="ml-2 text-stone-400 hover:text-red-500 transition-colors"
                        title="Cancel Generation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : chapter.grammarLessonText && chapter.grammarLessonText.trim().length > 0 ? (
                    <div className="group/grammar relative inline-flex items-center">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 group-hover/grammar:hidden">
                        Generated
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue({ id: `${chapter.id}-grammar`, chapterId: chapter.id, type: 'grammar' });
                        }}
                        className="hidden group-hover/grammar:inline-flex px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue({ id: `${chapter.id}-grammar`, chapterId: chapter.id, type: 'grammar' });
                      }}
                      className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      Generate
                    </button>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {chapter.isGeneratingSideBySide || generationQueue.some(t => t.id === `${chapter.id}-sidebyside`) ? (
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(`${chapter.id}-sidebyside`);
                          updateChapter(chapter.id, { isGeneratingSideBySide: false });
                        }}
                        className="ml-2 text-stone-400 hover:text-red-500 transition-colors"
                        title="Cancel Generation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : chapter.sideBySideText && chapter.sideBySideText.trim().length > 0 ? (
                    <div className="group/sbs relative inline-flex items-center">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 group-hover/sbs:hidden">
                        Generated
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue({ id: `${chapter.id}-sidebyside`, chapterId: chapter.id, type: 'sidebyside' });
                        }}
                        className="hidden group-hover/sbs:inline-flex px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue({ id: `${chapter.id}-sidebyside`, chapterId: chapter.id, type: 'sidebyside' });
                      }}
                      className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      Generate
                    </button>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {chapter.isGeneratingEpub || generationQueue.some(t => t.id === `${chapter.id}-epub`) ? (
                    <div className="flex items-center gap-2 text-sm text-stone-500">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(`${chapter.id}-epub`);
                          updateChapter(chapter.id, { isGeneratingEpub: false });
                        }}
                        className="ml-2 text-stone-400 hover:text-red-500 transition-colors"
                        title="Cancel Generation"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : chapter.epubText && chapter.epubText.trim().length > 0 ? (
                    <div className="group/epub relative inline-flex items-center">
                      <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800 group-hover/epub:hidden">
                        Generated
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToQueue({ id: `${chapter.id}-epub`, chapterId: chapter.id, type: 'epub' });
                        }}
                        className="hidden group-hover/epub:inline-flex px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                      >
                        Regenerate
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQueue({ id: `${chapter.id}-epub`, chapterId: chapter.id, type: 'epub' });
                      }}
                      className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
                    >
                      Generate
                    </button>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-stone-500">
                  {chapter.wordCount > 0 ? chapter.wordCount.toLocaleString() : '-'}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-sm text-stone-500">
                  {new Date(chapter.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2 transition-opacity">
                    <button className="text-indigo-600 hover:text-indigo-900 p-1"><Eye className="w-4 h-4" /></button>
                    <button 
                      className="text-red-400 hover:text-red-600 p-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setConfirmDeleteId(chapter.id);
                      }}
                      title="Delete Episode"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-stone-400 hover:text-stone-600 p-1"><MoreVertical className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredChapters.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            {!user ? 'Sign in to view your episodes.' : chapters.length === 0 ? 'No episodes found. Generate one to get started!' : 'No episodes found matching your search.'}
          </div>
        )}
      </div>

      <aside className="w-80 h-fit bg-white rounded-xl border border-stone-200 shadow-sm p-5 space-y-6 sticky top-0">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
            <Loader2 className={`w-5 h-5 text-indigo-600 ${isProcessingQueue ? 'animate-spin' : ''}`} />
            Generation Queue
          </h2>
          <p className="text-xs text-stone-500 mt-1">Status of supplemental material generation.</p>
        </div>

        <div className="space-y-4">
          <section className="space-y-2">
            <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex justify-between items-center">
              Active / Queued
              <span className="bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded text-[10px]">
                {generationQueue.length}
              </span>
            </h3>
            {generationQueue.length === 0 ? (
              <p className="text-sm text-stone-400 italic">No active tasks</p>
            ) : (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                {generationQueue.map((task, idx) => {
                  const chapter = getChapterInfo(task.chapterId);
                  const isProcessing = idx === 0 && isProcessingQueue;
                  return (
                    <div key={task.id} className="text-sm p-3 bg-stone-50 rounded-lg border border-stone-100 flex items-center gap-3">
                      {isProcessing ? (
                        <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-stone-200" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-900 truncate">
                          Episode {chapter?.chapterNumber || '?'}: {task.type}
                        </div>
                        <div className="text-[10px] text-stone-500 uppercase">
                          {isProcessing ? 'Processing...' : 'Queued'}
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromQueue(task.id)}
                        className="text-stone-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-stone-400 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <History className="w-3 h-3" />
                History
              </span>
              {(queueCompleted.length > 0 || queueFailed.length > 0) && (
                <button 
                  onClick={clearQueueStatus}
                  className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <Trash className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {queueFailed.map((task) => {
                const chapter = getChapterInfo(task.chapterId);
                return (
                  <div key={`${task.id}-${task.failedAt}`} className="text-sm p-3 bg-red-50/50 rounded-lg border border-red-100 flex items-start gap-3 group">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-red-900 truncate">
                        Episode {chapter?.chapterNumber || '?'}: {task.type}
                      </div>
                      <div className="text-[10px] text-red-600 line-clamp-2 mt-0.5">
                        {task.error}
                      </div>
                    </div>
                  </div>
                );
              })}

              {queueCompleted.map((task) => {
                const chapter = getChapterInfo(task.chapterId);
                return (
                  <div key={`${task.id}-${task.completedAt}`} className="text-sm p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-emerald-900 truncate">
                        Episode {chapter?.chapterNumber || '?'}: {task.type}
                      </div>
                      <div className="text-[10px] text-emerald-600">
                        Complete
                      </div>
                    </div>
                  </div>
                );
              })}

              {queueCompleted.length === 0 && queueFailed.length === 0 && (
                <p className="text-sm text-stone-400 italic">No history</p>
              )}
            </div>
          </section>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4 border border-stone-200">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 bg-red-50 rounded-full">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold">Delete Episode</h3>
            </div>
            <p className="text-stone-600">
              Are you sure you want to delete this episode? This action cannot be undone and all generated content will be lost.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteChapter(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete Episode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
