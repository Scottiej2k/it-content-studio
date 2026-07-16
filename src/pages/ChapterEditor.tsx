import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore, Chapter } from '../store/useStore';
import { ArrowLeft, Save, Play, Download, Lock, Unlock, Mic, Copy, FileText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { exportToPdf } from '../lib/pdf-export';
import { exportToEpub } from '../lib/epub-export';

function getAudioVersionText(chapter: Chapter, storyText: string) {
  // Extract the story content (everything after the chapter title)
  // Usually the chapter title is "# Chapter X: ..." or "## Chapter X: ..."
  const chapterTitleMatch = storyText.match(/#{1,2}\s*((?:Chapter|Capitolo)\s+\d+)(?:\s*[:\-]\s*|\s+)(.*?)(?:\n|$)/i);
  
  let storyContent = storyText;
  let chapterTitle = `Capitolo ${chapter.chapterNumber}`;
  
  if (chapterTitleMatch) {
    let chapterPrefix = chapterTitleMatch[1]; // e.g., "Chapter 1" or "Capitolo 1"
    chapterPrefix = chapterPrefix.replace(/Chapter/i, 'Capitolo');
    const storyTitle = chapterTitleMatch[2]; // e.g., "Il primo passo / The First Step"
    chapterTitle = `${chapterPrefix} - ${storyTitle}`;
    const splitIndex = storyText.indexOf(chapterTitleMatch[0]) + chapterTitleMatch[0].length;
    storyContent = storyText.substring(splitIndex).trim();
  } else {
    // Fallback: try to remove Examples, Title, and Description
    storyContent = storyText.replace(/\*\*Examples:\*\*.*?\n+/i, '').replace(/\*\*Title:\*\*.*?\n+/i, '').replace(/\*\*Description:\*\*.*?\n+/i, '').trim();
  }

  // Extract Description from storyText
  const descriptionMatch = storyText.match(/\*\*Description:\*\*\s*(.*?)(?:\n\n|\n#|$)/is);
  const description = descriptionMatch ? descriptionMatch[1].trim() : (chapter.logline || '');

  // Clean up grammar focus (remove "1.1 - " etc)
  const cleanGrammarFocus = chapter.grammarFocus.replace(/^\d+\.\d+\s*-\s*/, '').replace(/^\d+\.\d+\s*/, '').toLowerCase();
  const displayGrammarFocus = chapter.grammarFocus.replace(/^\d+\.\d+\s*-\s*/, '').replace(/^\d+\.\d+\s*/, '');

  // Try to extract episode title from the **Title:** line or fallback to the first line if it's a single # header
  let episodeTitle = chapter.title;
  const titleMatch = storyText.match(/\*\*Title:\*\*\s*(.*?)(?:\n|$)/i);
  if (titleMatch) {
    episodeTitle = titleMatch[1].trim();
  } else {
    const firstLineMatch = storyText.trim().match(/^#\s+(.*?)(?:\n|$)/);
    if (firstLineMatch && (!chapterTitleMatch || firstLineMatch[0].trim() !== chapterTitleMatch[0].trim())) {
      episodeTitle = firstLineMatch[1].trim();
    }
  }

  return `The following story focuses on ${cleanGrammarFocus}.

# ${displayGrammarFocus}

${episodeTitle}
${description}

## ${chapterTitle}

${storyContent}`;
}

export function ChapterEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chapters = useStore(state => state.chapters);
  const chapter = chapters.find(c => c.id === id);
  const updateChapter = useStore(state => state.updateChapter);
  const generationQueue = useStore(state => state.generationQueue);

  // Sort chapters by chapterNumber to ensure sequential navigation
  const sortedChapters = [...chapters].sort((a, b) => a.chapterNumber - b.chapterNumber);
  const currentIndex = sortedChapters.findIndex(c => c.id === id);
  const prevChapter = currentIndex > 0 ? sortedChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex !== -1 && currentIndex < sortedChapters.length - 1 ? sortedChapters[currentIndex + 1] : null;

  const [storyText, setStoryText] = useState(chapter?.storyText === '__EXISTS__' ? '' : (chapter?.storyText || ''));
  const [grammarLessonText, setGrammarLessonText] = useState(chapter?.grammarLessonText === '__EXISTS__' ? '' : (chapter?.grammarLessonText || ''));
  const [sideBySideText, setSideBySideText] = useState(chapter?.sideBySideText === '__EXISTS__' ? '' : (chapter?.sideBySideText || ''));
  const [continuitySummary, setContinuitySummary] = useState(chapter?.continuitySummary === '__EXISTS__' ? '' : (chapter?.continuitySummary || ''));
  const [copied, setCopied] = useState(false);
  const [copiedWordBank, setCopiedWordBank] = useState(false);
  const [copiedGrammar, setCopiedGrammar] = useState(false);
  const [copiedSideBySide, setCopiedSideBySide] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingWordBank, setIsExportingWordBank] = useState(false);
  const [isExportingGrammar, setIsExportingGrammar] = useState(false);
  const [isExportingSideBySide, setIsExportingSideBySide] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'edit' | 'audio'>('preview');
  const [grammarViewMode, setGrammarViewMode] = useState<'preview' | 'edit'>('preview');
  const [sideBySideViewMode, setSideBySideViewMode] = useState<'preview' | 'edit'>('preview');
  const [epubText, setEpubText] = useState(chapter?.epubText === '__EXISTS__' ? '' : (chapter?.epubText || ''));
  const [epubViewMode, setEpubViewMode] = useState<'preview' | 'edit'>('preview');
  
  // Sync this specific chapter from Firestore on mount/id change
  useEffect(() => {
    if (id) {
      useStore.getState().syncChapterFromFirestore(id);
    }
  }, [id]);

  useEffect(() => {
    if (chapter) {
      setStoryText(chapter.storyText === '__EXISTS__' ? '' : (chapter.storyText || ''));
      setGrammarLessonText(chapter.grammarLessonText === '__EXISTS__' ? '' : (chapter.grammarLessonText || ''));
      setSideBySideText(chapter.sideBySideText === '__EXISTS__' ? '' : (chapter.sideBySideText || ''));
      setEpubText(chapter.epubText === '__EXISTS__' ? '' : (chapter.epubText || ''));
      setContinuitySummary(chapter.continuitySummary === '__EXISTS__' ? '' : (chapter.continuitySummary || ''));
    }
  }, [chapter?.id, chapter?.storyText, chapter?.grammarLessonText, chapter?.sideBySideText, chapter?.epubText, chapter?.continuitySummary]);

  const pdfContentRef = useRef<HTMLDivElement>(null);
  const wordBankPdfRef = useRef<HTMLDivElement>(null);
  const grammarPdfRef = useRef<HTMLDivElement>(null);
  const sideBySidePdfRef = useRef<HTMLDivElement>(null);

  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  const handleCopyContent = async (ref: React.RefObject<HTMLDivElement>, rawText: string, setCopiedState: (val: boolean) => void) => {
    try {
      if (ref.current) {
        // Clone the element to manipulate it for the clipboard
        const clone = ref.current.cloneNode(true) as HTMLElement;
        const originalElements = ref.current.querySelectorAll('*');
        const cloneElements = clone.querySelectorAll('*');

        // Helper to avoid oklch in clipboard (Google Docs doesn't support it)
        const safeColor = (color: string) => color.includes('oklch') ? '#1c1917' : color;
        const safeBg = (color: string) => color.includes('oklch') ? 'transparent' : color;

        // Inline essential styles from computed styles
        const containerStyle = window.getComputedStyle(ref.current);
        clone.style.color = safeColor(containerStyle.color);
        clone.style.backgroundColor = safeBg(containerStyle.backgroundColor);
        clone.style.fontFamily = containerStyle.fontFamily;
        clone.style.padding = '20px';

        originalElements.forEach((el, i) => {
          const element = el as HTMLElement;
          const cloneEl = cloneElements[i] as HTMLElement;
          const style = window.getComputedStyle(element);

          // Copy formatting that Google Docs respects
          cloneEl.style.color = safeColor(style.color);
          cloneEl.style.backgroundColor = safeBg(style.backgroundColor);
          cloneEl.style.fontWeight = style.fontWeight;
          cloneEl.style.fontStyle = style.fontStyle;
          cloneEl.style.fontSize = style.fontSize;
          cloneEl.style.textDecoration = style.textDecoration;
          
          // Table specific formatting
          if (element.tagName === 'TABLE') {
            cloneEl.style.borderCollapse = 'collapse';
            cloneEl.style.width = '100%';
            cloneEl.style.marginBottom = '1em';
            cloneEl.setAttribute('border', '1');
          }
          if (element.tagName === 'TH' || element.tagName === 'TD') {
            cloneEl.style.border = '1px solid #e7e5e4';
            cloneEl.style.padding = '8px';
            cloneEl.style.textAlign = style.textAlign;
          }
          if (element.tagName === 'TH') {
            cloneEl.style.backgroundColor = '#f5f3ff';
            cloneEl.style.fontWeight = 'bold';
          }
          
          // Ensure headers look like headers
          if (/^H[1-6]$/.test(element.tagName)) {
            cloneEl.style.display = 'block';
            cloneEl.style.marginBottom = '0.5em';
            cloneEl.style.marginTop = '1em';
          }
        });

        const htmlContent = clone.outerHTML;
        const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>${htmlContent}</body></html>`;
        const blobHtml = new Blob([html], { type: 'text/html' });
        const blobText = new Blob([rawText], { type: 'text/plain' });
        
        try {
          const data = [new ClipboardItem({
            'text/html': blobHtml,
            'text/plain': blobText,
          })];
          await navigator.clipboard.write(data);
        } catch (e) {
          // Fallback for browsers that don't support ClipboardItem well
          await navigator.clipboard.writeText(rawText);
        }
      } else {
        await navigator.clipboard.writeText(rawText);
      }
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleExportPDFContent = async (ref: React.RefObject<HTMLDivElement>, filenameSuffix: string, setExportingState: (val: boolean) => void) => {
    if (!ref.current) return;
    
    setExportingState(true);
    try {
      const element = ref.current;
      const filename = `Chapter_${chapter.chapterNumber}_${chapter.title}_${filenameSuffix}.pdf`;
      
      const normalizedSuffix = filenameSuffix.toLowerCase().replace(/[^a-z]/g, '');
      const pdfType = normalizedSuffix === 'wordbank' 
        ? 'wordbank' 
        : normalizedSuffix === 'sidebyside' 
          ? 'sidebyside' 
          : 'markdown';

      const pdf = await exportToPdf(element, {
        filename,
        type: pdfType
      });
      
      pdf.save(filename);
    } catch (err) {
      console.error('Failed to export PDF: ', err);
    } finally {
      setExportingState(false);
    }
  };

  const audioText = chapter ? getAudioVersionText(chapter, storyText) : '';
  const currentText = viewMode === 'audio' ? audioText : storyText;

  const handleCopy = () => handleCopyContent(pdfContentRef, currentText, setCopied);
  const handleExportPDF = () => handleExportPDFContent(pdfContentRef, 'Story', setIsExporting);

  const handleCopyWordBank = () => {
    const rawText = chapter.wordBankJson?.map(w => `${w.italian} - ${w.english} (${w.partOfSpeech || w.pos})\nExample: ${w.example}${w.exampleTranslation ? `\nTranslation: ${w.exampleTranslation}` : ''}`).join('\n\n') || '';
    handleCopyContent(wordBankPdfRef, rawText, setCopiedWordBank);
  };

  const handleExportAnkiCSV = () => {
    if (!chapter.wordBankJson) return;

    const headers = ['Front', 'Back', 'Tags'];
    const rows = chapter.wordBankJson.map(word => {
      // Bold the word in the example sentence
      let frontExample = word.example;
      if (word.italian) {
        const escapedWord = word.italian.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedWord})`, 'gi');
        frontExample = word.example.replace(regex, '<b>$1</b>');
      }

      const front = `${word.italian}<br>${frontExample}`;
      const back = `${word.english}${word.exampleTranslation ? `<br>${word.exampleTranslation}` : ''}`;
      const tags = `vocabulary,${(word.partOfSpeech || word.pos || '').toLowerCase().replace(/\s+/g, '-')}`;

      return [
        `"${front.replace(/"/g, '""')}"`,
        `"${back.replace(/"/g, '""')}"`,
        `"${tags.replace(/"/g, '""')}"`
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Chapter_${chapter.chapterNumber}_Anki_Export.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDFWordBank = () => handleExportPDFContent(wordBankPdfRef, 'WordBank', setIsExportingWordBank);

  const handleCopyGrammar = () => handleCopyContent(grammarPdfRef, grammarLessonText, setCopiedGrammar);
  const handleExportPDFGrammar = () => handleExportPDFContent(grammarPdfRef, 'Grammar', setIsExportingGrammar);

  const handleCopySideBySide = () => handleCopyContent(sideBySidePdfRef, sideBySideText, setCopiedSideBySide);
  const handleExportPDFSideBySide = () => handleExportPDFContent(sideBySidePdfRef, 'SideBySide', setIsExportingSideBySide);

  const handleSave = () => {
    updateChapter(chapter.id, {
      storyText,
      grammarLessonText,
      sideBySideText,
      epubText,
      continuitySummary,
      updatedAt: new Date().toISOString()
    });
  };

  const toggleFinal = () => {
    updateChapter(chapter.id, {
      status: chapter.status === 'final' ? 'complete' : 'final'
    });
  };

  const isLocked = chapter.status === 'final';
  const isSyncingFromFirestore = 
    !!chapter && (
      chapter.storyText === '__EXISTS__' ||
      chapter.grammarLessonText === '__EXISTS__' ||
      chapter.sideBySideText === '__EXISTS__' ||
      chapter.epubText === '__EXISTS__' ||
      chapter.continuitySummary === '__EXISTS__' ||
      (Array.isArray(chapter.wordBankJson) && chapter.wordBankJson.length > 0 && (chapter.wordBankJson[0] as any).__exists__)
    );

  return (
    <div className="space-y-6 h-[calc(100vh-4rem)] flex flex-col">
      <header className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 border-r border-stone-200 pr-2 mr-2">
            <button 
              onClick={() => navigate('/library')}
              title="Back to Library"
              className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-stone-200 mx-1"></div>
            <button
              onClick={() => prevChapter && navigate(`/library/${prevChapter.id}`)}
              disabled={!prevChapter}
              title="Previous Episode"
              className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => nextChapter && navigate(`/library/${nextChapter.id}`)}
              disabled={!nextChapter}
              title="Next Episode"
              className="p-1.5 hover:bg-stone-100 rounded-full transition-colors text-stone-500 disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-stone-900">
                Chapter {chapter.chapterNumber}: {chapter.title}
              </h1>
              <span className="px-2.5 py-1 rounded bg-indigo-100 text-indigo-800 text-xs font-bold">
                {chapter.cefrLevel}
              </span>
              <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                chapter.status === 'final' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-800'
              }`}>
                {chapter.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1">{chapter.wordCount} words • ~{Math.ceil(chapter.wordCount / 150)} min read</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleFinal}
            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isLocked 
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' 
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {isLocked ? <><Unlock className="w-4 h-4" /> Unlock</> : <><Lock className="w-4 h-4" /> Mark Final</>}
          </button>
          <button 
            onClick={handleSave}
            disabled={isLocked}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </header>

      <Tabs.Root defaultValue="story" className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <Tabs.List className="flex border-b border-stone-200 bg-stone-50 shrink-0">
          <Tabs.Trigger value="story" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            Story
          </Tabs.Trigger>
          <Tabs.Trigger value="wordbank" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            Word Bank
          </Tabs.Trigger>
          <Tabs.Trigger value="grammar" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            Grammar Lesson
          </Tabs.Trigger>
          <Tabs.Trigger value="sidebyside" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            Side-by-Side Text
          </Tabs.Trigger>
          <Tabs.Trigger value="epub" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            EPUB Text
          </Tabs.Trigger>
          <Tabs.Trigger value="summary" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            Summary
          </Tabs.Trigger>
          <Tabs.Trigger value="tts" className="px-6 py-3 text-sm font-medium text-stone-600 hover:text-stone-900 data-[state=active]:text-indigo-600 data-[state=active]:border-b-2 data-[state=active]:border-indigo-600">
            TTS
          </Tabs.Trigger>
        </Tabs.List>

        <div className="flex-1 overflow-y-auto p-6 relative">
          {isSyncingFromFirestore && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md z-50">
              <div className="flex flex-col items-center max-w-md p-6 text-center animate-fade-in">
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
                <h3 className="text-lg font-semibold text-stone-800">Downloading Content from Cloud...</h3>
                <p className="text-stone-500 text-sm mt-2 leading-relaxed">
                  The application is retrieving the full text story, comprehensive grammar lesson, side-by-side files, and word bank lists from our server.
                </p>
                <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-stone-100 rounded-full text-xs font-mono text-stone-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Firebase Session
                </div>
              </div>
            </div>
          )}
          <Tabs.Content value="story" className="h-full outline-none flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0 print:hidden">
              <div className="flex bg-stone-100 p-1 rounded-md">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewMode === 'preview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Preview
                </button>
                <button
                  onClick={() => setViewMode('edit')}
                  disabled={isLocked}
                  className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewMode === 'edit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewMode('audio')}
                  className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${viewMode === 'audio' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                >
                  Audio Version
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
            </div>
            
            {viewMode === 'preview' || viewMode === 'audio' || isLocked ? (
              <div className="flex-1 overflow-y-auto p-4 border border-stone-200 rounded-lg bg-stone-50 prose prose-stone max-w-none">
                <div className="bg-white p-8" ref={pdfContentRef}>
                  <Markdown remarkPlugins={[remarkGfm]}>{currentText}</Markdown>
                </div>
              </div>
            ) : (
              <>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="w-full flex-1 p-4 border border-stone-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-serif text-lg leading-relaxed"
                  placeholder="Story content will appear here..."
                />
                <div className="absolute opacity-0 pointer-events-none -z-10">
                  <div className="bg-white p-8" ref={pdfContentRef}>
                    <Markdown remarkPlugins={[remarkGfm]}>{currentText}</Markdown>
                  </div>
                </div>
              </>
            )}
          </Tabs.Content>

          <Tabs.Content value="wordbank" className="h-full outline-none flex flex-col">
            {chapter.wordBankJson && chapter.wordBankJson.length > 0 ? (
              <>
                <div className="flex justify-end mb-4 shrink-0 print:hidden">
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyWordBank}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedWordBank ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                      onClick={handleExportAnkiCSV}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Export Anki CSV
                    </button>
                    <button
                      onClick={handleExportPDFWordBank}
                      disabled={isExportingWordBank}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      {isExportingWordBank ? 'Exporting...' : 'Export PDF'}
                    </button>
                  </div>
                </div>
                <div className="border border-stone-200 rounded-lg overflow-y-auto flex-1 bg-white markdown-body" ref={wordBankPdfRef}>
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Italian</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">English</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Example</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase">Part of Speech</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-stone-200">
                      {chapter.wordBankJson.map((word, idx) => (
                        <tr key={idx}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-900">{word.italian}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{word.english}</td>
                          <td className="px-6 py-4 text-sm text-stone-600">
                            <div>{word.example}</div>
                            {word.exampleTranslation && (
                              <div className="text-xs text-stone-400 mt-1 italic">{word.exampleTranslation}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500 italic">{word.partOfSpeech || word.pos}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-stone-400">
                {chapter.status === 'generating' || chapter.isGeneratingWordBank || generationQueue.some(t => t.id === `${chapter.id}-wordbank`) ? (
                  <>
                    <Loader2 className="w-8 h-8 mb-4 opacity-50 animate-spin" />
                    <p>Generating vocabulary...</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <p>No vocabulary generated yet.</p>
                    <button
                      onClick={() => useStore.getState().addToQueue({ id: `${chapter.id}-wordbank`, chapterId: chapter.id, type: 'wordbank' })}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Generate Vocabulary
                    </button>
                  </div>
                )}
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="grammar" className="h-full outline-none flex flex-col">
            {chapter.status === 'generating' || chapter.isGeneratingGrammar || generationQueue.some(t => t.id === `${chapter.id}-grammar`) ? (
              <div className="h-full overflow-y-auto p-4 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center text-stone-400">
                <Loader2 className="w-8 h-8 mb-4 opacity-50 animate-spin" />
                <p>Generating grammar lesson...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 shrink-0 print:hidden">
                  <div className="flex bg-stone-100 p-1 rounded-md">
                    <button
                      onClick={() => setGrammarViewMode('preview')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${grammarViewMode === 'preview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setGrammarViewMode('edit')}
                      disabled={isLocked}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${grammarViewMode === 'edit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyGrammar}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedGrammar ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                      onClick={handleExportPDFGrammar}
                      disabled={isExportingGrammar}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      {isExportingGrammar ? 'Exporting...' : 'Export PDF'}
                    </button>
                  </div>
                </div>

                {grammarViewMode === 'preview' || isLocked ? (
                  <div className="flex-1 overflow-y-auto p-6 border border-stone-200 rounded-lg bg-stone-50">
                    {grammarLessonText ? (
                      <div className="prose prose-stone prose-indigo max-w-none bg-white p-8 rounded-xl shadow-sm border border-stone-100" ref={grammarPdfRef}>
                        <Markdown remarkPlugins={[remarkGfm]}>{grammarLessonText}</Markdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4 mt-12 bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                        <p>No grammar lesson generated yet.</p>
                        <button
                          onClick={() => useStore.getState().addToQueue({ id: `${chapter.id}-grammar`, chapterId: chapter.id, type: 'grammar' })}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline"
                        >
                          Generate Grammar Lesson
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={grammarLessonText}
                    onChange={(e) => setGrammarLessonText(e.target.value)}
                    className="w-full flex-1 p-4 border border-stone-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm leading-relaxed"
                    placeholder="Grammar lesson markdown will appear here..."
                  />
                )}
              </>
            )}
          </Tabs.Content>

          <Tabs.Content value="sidebyside" className="h-full outline-none flex flex-col">
            {chapter.status === 'generating' || chapter.isGeneratingSideBySide || generationQueue.some(t => t.id === `${chapter.id}-sidebyside`) ? (
              <div className="h-full overflow-y-auto p-4 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center text-stone-400">
                <Loader2 className="w-8 h-8 mb-4 opacity-50 animate-spin" />
                <p>Generating side-by-side text...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 shrink-0 print:hidden">
                  <div className="flex bg-stone-100 p-1 rounded-md">
                    <button
                      onClick={() => setSideBySideViewMode('preview')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${sideBySideViewMode === 'preview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setSideBySideViewMode('edit')}
                      disabled={isLocked}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${sideBySideViewMode === 'edit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopySideBySide}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      {copiedSideBySide ? 'Copied!' : 'Copy Text'}
                    </button>
                    <button
                      onClick={handleExportPDFSideBySide}
                      disabled={isExportingSideBySide}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors disabled:opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      {isExportingSideBySide ? 'Exporting...' : 'Export PDF'}
                    </button>
                  </div>
                </div>

                {sideBySideViewMode === 'preview' || isLocked ? (
                  <div className="flex-1 overflow-y-auto p-6 border border-stone-200 rounded-lg bg-stone-50">
                    {sideBySideText ? (
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100" ref={sideBySidePdfRef}>
                        <Markdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({node, ...props}) => <table className="min-w-full divide-y divide-stone-200" {...props} />,
                            thead: ({node, ...props}) => <thead className="bg-stone-50" {...props} />,
                            th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase" {...props} />,
                            tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-stone-200" {...props} />,
                            td: ({node, ...props}) => <td className="px-6 py-4 text-sm text-stone-900" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-indigo-900" {...props} />
                          }}
                        >
                          {sideBySideText}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4 mt-12 bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                        <p>No side-by-side text generated yet.</p>
                        <button
                          onClick={() => useStore.getState().addToQueue({ id: `${chapter.id}-sidebyside`, chapterId: chapter.id, type: 'sidebyside' })}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline"
                        >
                          Generate Side-by-Side Text
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={sideBySideText}
                    onChange={(e) => setSideBySideText(e.target.value)}
                    className="w-full flex-1 p-4 border border-stone-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm leading-relaxed"
                    placeholder="Side-by-side markdown table will appear here..."
                  />
                )}
              </>
            )}
          </Tabs.Content>

          <Tabs.Content value="epub" className="h-full outline-none flex flex-col">
            {chapter.status === 'generating' || chapter.isGeneratingEpub || generationQueue.some(t => t.id === `${chapter.id}-epub`) ? (
              <div className="h-full overflow-y-auto p-4 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center text-stone-400">
                <Loader2 className="w-8 h-8 mb-4 opacity-50 animate-spin" />
                <p>Generating EPUB text...</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4 shrink-0 print:hidden">
                  <div className="flex bg-stone-100 p-1 rounded-md">
                    <button
                      onClick={() => setEpubViewMode('preview')}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${epubViewMode === 'preview' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setEpubViewMode('edit')}
                      disabled={isLocked}
                      className={`px-3 py-1.5 text-sm font-medium rounded-sm transition-colors ${epubViewMode === 'edit' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      Edit
                    </button>
                  </div>
                  <button
                    onClick={() => exportToEpub(chapter, epubText)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export EPUB
                  </button>
                </div>

                {epubViewMode === 'preview' || isLocked ? (
                  <div className="flex-1 overflow-y-auto p-6 border border-stone-200 rounded-lg bg-stone-50">
                    {epubText ? (
                      <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                        <Markdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            table: ({node, ...props}) => <table className="min-w-full divide-y divide-stone-200 border-separate border-spacing-x-4 border-spacing-y-2" {...props} />,
                            thead: ({node, ...props}) => <thead className="bg-stone-50" {...props} />,
                            th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase" {...props} />,
                            tbody: ({node, ...props}) => <tbody className="bg-white" {...props} />,
                            td: ({node, ...props}) => <td className="py-2 text-sm text-stone-900 border-b border-stone-100" {...props} />,
                            strong: ({node, ...props}) => <strong className="font-bold text-indigo-900" {...props} />
                          }}
                        >
                          {epubText}
                        </Markdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-4 mt-12 bg-white p-8 rounded-xl shadow-sm border border-stone-100">
                        <p>No EPUB text generated yet.</p>
                        <button
                          onClick={() => useStore.getState().addToQueue({ id: `${chapter.id}-epub`, chapterId: chapter.id, type: 'epub' })}
                          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors no-underline"
                        >
                          Generate EPUB Text
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <textarea
                    value={epubText}
                    onChange={(e) => setEpubText(e.target.value)}
                    className="w-full flex-1 p-4 border border-stone-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm leading-relaxed"
                    placeholder="EPUB markdown content will appear here..."
                  />
                )}
              </>
            )}
          </Tabs.Content>

          <Tabs.Content value="summary" className="h-full outline-none">
            {chapter.status === 'generating' ? (
              <div className="w-full h-full p-4 border border-stone-200 rounded-lg bg-stone-50 flex flex-col items-center justify-center text-stone-400">
                <Loader2 className="w-8 h-8 mb-4 opacity-50 animate-spin" />
                <p>Generating continuity summary...</p>
              </div>
            ) : (
              <textarea
                value={continuitySummary}
                onChange={(e) => setContinuitySummary(e.target.value)}
                disabled={isLocked}
                className="w-full h-full p-4 border border-stone-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-sans text-base leading-relaxed disabled:bg-stone-50 disabled:text-stone-700"
                placeholder={isLocked ? "No continuity summary generated yet." : "Continuity summary will appear here..."}
              />
            )}
          </Tabs.Content>

          <Tabs.Content value="tts" className="h-full outline-none">
            <div className="flex flex-col items-center justify-center h-full text-stone-500 space-y-4">
              <Mic className="w-12 h-12 text-stone-300" />
              <p className="text-lg font-medium text-stone-700">Audio Playback</p>
              <p className="text-sm text-center max-w-md">Per-chapter TTS playback will be available here once the QWEN3TTS backend is integrated.</p>
              <button disabled className="mt-4 flex items-center gap-2 px-4 py-2 bg-stone-200 text-stone-500 rounded-md text-sm font-medium cursor-not-allowed">
                <Play className="w-4 h-4" />
                Generate Audio
              </button>
            </div>
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
