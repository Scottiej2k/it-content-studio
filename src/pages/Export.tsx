import { useState, useRef } from 'react';
import { Download, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore, Chapter } from '../store/useStore';
import JSZip from 'jszip';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { exportToPdf } from '../lib/pdf-export';
import { exportToEpub } from '../lib/epub-export';

export function Export() {
  const chapters = useStore(state => state.chapters);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState<{ current: number, total: number, status: string } | null>(null);
  
  const [startChapter, setStartChapter] = useState(1);
  const [endChapter, setEndChapter] = useState(30);
  const [includeStory, setIncludeStory] = useState(true);
  const [includeWordBank, setIncludeWordBank] = useState(true);
  const [includeAnki, setIncludeAnki] = useState(true);
  const [includeGrammar, setIncludeGrammar] = useState(true);
  const [includeSideBySide, setIncludeSideBySide] = useState(true);
  const [includeEpub, setIncludeEpub] = useState(true);

  const hiddenRef = useRef<HTMLDivElement>(null);
  const [renderContent, setRenderContent] = useState<string | null>(null);
  const [renderType, setRenderType] = useState<'markdown' | 'wordbank'>('markdown');
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);

  const cleanFilename = (text: string) => {
    return text.replace(/[/\\?%*:|"<>]/g, '-').trim();
  };

  const formatChapterNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  const generateZip = async () => {
    if (isExporting) return;
    
    // Filter chapters based on range
    const selectedChapters = chapters.filter(c => 
      c.chapterNumber >= startChapter && c.chapterNumber <= endChapter
    ).sort((a, b) => a.chapterNumber - b.chapterNumber);

    if (selectedChapters.length === 0) {
      alert("No chapters found in the selected range.");
      return;
    }

    setIsExporting(true);
    setProgress({ current: 0, total: selectedChapters.length, status: 'Syncing database content...' });

    // Fetch full chapter content from Firestore if cached/lightweight
    const fullChapters: Chapter[] = [];
    try {
      for (let i = 0; i < selectedChapters.length; i++) {
        const chapter = selectedChapters[i];
        const needsSync = 
          chapter.storyText === '__EXISTS__' ||
          chapter.grammarLessonText === '__EXISTS__' ||
          chapter.sideBySideText === '__EXISTS__' ||
          chapter.epubText === '__EXISTS__' ||
          chapter.continuitySummary === '__EXISTS__' ||
          (Array.isArray(chapter.wordBankJson) && chapter.wordBankJson.length > 0 && (chapter.wordBankJson[0] as any).__exists__);

        if (needsSync) {
          setProgress({ 
            current: i + 1, 
            total: selectedChapters.length, 
            status: `Fetching Chapter ${chapter.chapterNumber} from database...` 
          });
          const fresh = await useStore.getState().syncChapterFromFirestore(chapter.id);
          if (fresh) {
            fullChapters.push(fresh);
          } else {
            fullChapters.push(chapter);
          }
        } else {
          fullChapters.push(chapter);
        }
      }
    } catch (err) {
      console.error('Failed to pre-fetch chapters from Firestore:', err);
    }

    const zip = new JSZip();
    
    // Define the tasks
    const tasks: { chapter: Chapter, type: 'Story' | 'Word Bank' | 'Grammar Lesson' | 'Side-by-Side' | 'Anki CSV' | 'EPUB' }[] = [];
    
    fullChapters.forEach(chapter => {
      if (includeStory && chapter.storyText) tasks.push({ chapter, type: 'Story' });
      if (includeWordBank && chapter.wordBankJson && chapter.wordBankJson.length > 0) {
        tasks.push({ chapter, type: 'Word Bank' });
      }
      if (includeAnki && chapter.wordBankJson && chapter.wordBankJson.length > 0) {
        tasks.push({ chapter, type: 'Anki CSV' });
      }
      if (includeGrammar && chapter.grammarLessonText) tasks.push({ chapter, type: 'Grammar Lesson' });
      if (includeSideBySide && chapter.sideBySideText) tasks.push({ chapter, type: 'Side-by-Side' });
      if (includeEpub && chapter.epubText) tasks.push({ chapter, type: 'EPUB' });
    });

    if (tasks.length === 0) {
      setIsExporting(false);
      alert("No items selected or generated for export.");
      return;
    }

    setProgress({ current: 0, total: tasks.length, status: 'Initializing...' });

    try {
      for (let i = 0; i < tasks.length; i++) {
        const { chapter, type } = tasks[i];
        
        setProgress({ 
          current: i + 1, 
          total: tasks.length, 
          status: `Processing Chapter ${chapter.chapterNumber}: ${type}` 
        });

        const prefix = `${formatChapterNumber(chapter.chapterNumber)} (${chapter.cefrLevel})`;

        if (type === 'EPUB') {
          const blob = await exportToEpub(chapter, chapter.epubText!, false);
          const fileName = `${prefix} - ${cleanFilename(chapter.grammarFocus)} - EPUB.epub`;
          zip.file(fileName, blob);
          continue;
        }

        if (type === 'Anki CSV') {
          const headers = ['Front', 'Back', 'Tags'];
          const rows = chapter.wordBankJson!.map(word => {
            let frontExample = word.example;
            if (word.italian) {
              const escapedWord = word.italian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
              const regex = new RegExp(`(${escapedWord})`, 'gi');
              frontExample = word.example.replace(regex, '<b>$1</b>');
            }
            const front = `${word.italian}<br>${frontExample}`;
            const back = `${word.english}${word.exampleTranslation ? `<br>${word.exampleTranslation}` : ''}`;
            const tags = `vocabulary,${(word.partOfSpeech || word.pos || '').toLowerCase().replace(/\s+/g, '-')},chapter-${chapter.chapterNumber}`;
            return [
              `"${front.replace(/"/g, '""')}"`,
              `"${back.replace(/"/g, '""')}"`,
              `"${tags.replace(/"/g, '""')}"`
            ].join(',');
          });
          const csvContent = [headers.join(','), ...rows].join('\n');
          const fileName = `${prefix} ${cleanFilename(chapter.grammarFocus)} - Anki.csv`;
          zip.file(fileName, csvContent);
          continue;
        }

        // Set content and type for rendering
        setActiveChapter(chapter);
        if (type === 'Word Bank') {
          setRenderType('wordbank');
          setRenderContent(null); // content is in activeChapter.wordBankJson
        } else {
          setRenderType('markdown');
          setRenderContent(
            type === 'Story' ? chapter.storyText : 
            type === 'Grammar Lesson' ? chapter.grammarLessonText : 
            chapter.sideBySideText
          );
        }

        // Wait for React to render the hidden content
        await new Promise(resolve => setTimeout(resolve, 150));

        const displayType = type === 'Grammar Lesson' ? 'Grammar lesson' : 
                          type === 'Side-by-Side' ? 'side by side' : type;
        
        const glue = type === 'Side-by-Side' ? ' - ' : ' ';
        
        const fileName = `${prefix}${glue}${cleanFilename(chapter.grammarFocus)} - ${displayType}.pdf`;

        if (hiddenRef.current) {
          const pdf = await exportToPdf(hiddenRef.current, {
            filename: fileName,
            type: type === 'Word Bank' ? 'wordbank' : (type === 'Side-by-Side' ? 'sidebyside' : 'markdown')
          });
          
          const pdfBlob = pdf.output('blob');
          zip.file(fileName, pdfBlob);
        }
      }

      setProgress({ current: tasks.length, total: tasks.length, status: 'Finalizing ZIP...' });
      const content = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = `Italian_Curriculum_Batch_${formatChapterNumber(startChapter)}-${formatChapterNumber(endChapter)}.zip`;
      link.click();

    } catch (err) {
      console.error('Batch export failed:', err);
      alert('Batch export failed. Check console for details.');
    } finally {
      setIsExporting(false);
      setProgress(null);
      setRenderContent(null);
      setActiveChapter(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-semibold text-stone-900">Export Content</h1>
        <p className="text-stone-500 mt-2">Export individual chapters or batch download supplemental materials.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center gap-2">
            <Download className="w-5 h-5 text-stone-500" />
            <h2 className="font-semibold text-stone-800">Batch ZIP Export</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Start Chapter</label>
                <input 
                  type="number" 
                  min="1" 
                  value={startChapter}
                  onChange={(e) => setStartChapter(parseInt(e.target.value) || 1)}
                  className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">End Chapter</label>
                <input 
                  type="number" 
                  min="1" 
                  value={endChapter}
                  onChange={(e) => setEndChapter(parseInt(e.target.value) || 1)}
                  className="w-full border-stone-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">Include Supplemental Materials</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeStory}
                    onChange={(e) => setIncludeStory(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-stone-700">Story/Episode Text</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeWordBank}
                    onChange={(e) => setIncludeWordBank(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-stone-700">Word Banks</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeAnki}
                    onChange={(e) => setIncludeAnki(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-stone-700">Anki Flashcard Packs (CSV)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeGrammar}
                    onChange={(e) => setIncludeGrammar(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-stone-700">Grammar Lessons</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeSideBySide}
                    onChange={(e) => setIncludeSideBySide(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-stone-700">Side-by-Side (Italian/English)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={includeEpub}
                    onChange={(e) => setIncludeEpub(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500" 
                  />
                  <span className="text-sm text-stone-700">EPUB Chapters</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button 
                onClick={generateZip}
                disabled={isExporting}
                className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all"
              >
                {isExporting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating ZIP Bundle...</>
                ) : (
                  <><Download className="w-4 h-4" /> Download All Materials (ZIP)</>
                )}
              </button>
            </div>

            {progress && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="flex justify-between text-xs font-medium text-indigo-800 mb-2">
                  <span>{progress.status}</span>
                  <span>{Math.round((progress.current / progress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-300 ease-out" 
                    style={{ width: `${(progress.current / progress.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="bg-stone-50 rounded-xl border border-dashed border-stone-300 p-8 flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 bg-white rounded-full shadow-sm border border-stone-200">
            <FileText className="w-8 h-8 text-stone-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">Graded Reader Book</h3>
            <p className="text-stone-500 text-sm mt-1 max-w-xs">Compile all chapters into a single formatted PDF or Word document with Table of Contents.</p>
          </div>
          <button disabled className="px-6 py-2 bg-stone-200 text-stone-500 rounded-md text-sm font-medium cursor-not-allowed">
            Compile Full Book (Future Phase)
          </button>
        </section>
      </div>

      {/* Hidden Render Area for PDF Generation - positioned off-canvas but not out-of-bounds */}
      <div style={{ position: 'fixed', top: '100%', left: 0, width: '1200px', zIndex: -100, pointerEvents: 'none', overflow: 'hidden' }}>
        <div 
          ref={hiddenRef} 
          className="bg-white" 
          style={{ 
            width: renderType === 'markdown' && renderContent === activeChapter?.sideBySideText ? '1100px' : '800px', 
            visibility: 'visible' 
          }} 
        >
          {renderType === 'markdown' && renderContent && (
            <div className="prose prose-stone prose-indigo max-w-none bg-white p-8">
              <Markdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => <table className="min-w-full divide-y divide-stone-200 border border-stone-200" {...props} />,
                  thead: ({node, ...props}) => <thead className="bg-stone-50" {...props} />,
                  th: ({node, ...props}) => <th className="px-4 py-2 text-left text-xs font-bold text-stone-600 uppercase border border-stone-200" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-stone-200" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-2 text-sm text-stone-900 border border-stone-200" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-indigo-900" {...props} />
                }}
              >
                {renderContent}
              </Markdown>
            </div>
          )}
          {renderType === 'wordbank' && activeChapter?.wordBankJson && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-indigo-900">
                Chapter {activeChapter.chapterNumber}: {activeChapter.title} - Vocabulary
              </h2>
              <table className="min-w-full border-collapse border border-stone-200">
                <thead className="bg-stone-50">
                  <tr>
                    <th className="border border-stone-200 px-4 py-2 text-left text-xs font-bold text-stone-600 uppercase">Italian</th>
                    <th className="border border-stone-200 px-4 py-2 text-left text-xs font-bold text-stone-600 uppercase">English</th>
                    <th className="border border-stone-200 px-4 py-2 text-left text-xs font-bold text-stone-600 uppercase">Part of Speech</th>
                    <th className="border border-stone-200 px-4 py-2 text-left text-xs font-bold text-stone-600 uppercase">Example</th>
                  </tr>
                </thead>
                <tbody>
                  {activeChapter.wordBankJson.map((word, idx) => (
                    <tr key={idx}>
                      <td className="border border-stone-200 px-4 py-2 text-sm font-medium text-indigo-900">{word.italian}</td>
                      <td className="border border-stone-200 px-4 py-2 text-sm text-stone-800">{word.english}</td>
                      <td className="border border-stone-200 px-4 py-2 text-sm text-stone-500 italic">{word.partOfSpeech || word.pos}</td>
                      <td className="border border-stone-200 px-4 py-2 text-sm text-stone-600">
                        <div>{word.example}</div>
                        {word.exampleTranslation && <div className="text-xs text-stone-400 mt-1">{word.exampleTranslation}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
