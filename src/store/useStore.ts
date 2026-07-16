import { create } from 'zustand';
import { initialWorldBible } from '../data/worldBible';
import { initialEpisodeOutlines } from '../data/episodeOutlines';
import { auth, db } from '../firebase';
import { doc, updateDoc, setDoc, deleteDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../AuthProvider';

export type ChapterStatus = 'pending' | 'generating' | 'complete' | 'failed' | 'final';

export type GenerationStep = 
  | 'idle'
  | 'title'
  | 'chapter1'
  | 'chapter2'
  | 'chapter3'
  | 'chapter4'
  | 'chapter5'
  | 'wordbank'
  | 'grammar'
  | 'complete';

export interface GenerationProgress {
  currentSection: number;
  totalSections: number;
  statusText: string;
  currentStep?: GenerationStep;
}

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  cefrLevel: string;
  grammarFocus: string;
  episodeJob?: string;
  logline?: string;
  aStory?: string;
  bStory?: string;
  cStory?: string;
  coreLanguageTarget?: string[];
  storyBeats?: string[];
  emotionalMovement?: string;
  writerNotes?: string[];
  storyText?: string;
  wordBankJson?: any[];
  grammarLessonText?: string;
  sideBySideText?: string;
  epubText?: string;
  continuitySummary?: string;
  wordCount: number;
  status: ChapterStatus;
  isGeneratingExtras?: boolean;
  isGeneratingWordBank?: boolean;
  isGeneratingGrammar?: boolean;
  isGeneratingSideBySide?: boolean;
  isGeneratingEpub?: boolean;
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface GenerationTask {
  id: string;
  chapterId: string;
  type: 'wordbank' | 'grammar' | 'sidebyside' | 'epub';
}

export interface FirebaseUsage {
  reads: number;
  writes: number;
  date: string; // YYYY-MM-DD format to track daily resets
}

interface AppState {
  worldBible: typeof initialWorldBible;
  episodeOutlines: typeof initialEpisodeOutlines;
  chapters: Chapter[];
  openRouterApiKey: string;
  googleGeminiApiKey: string;
  aiProvider: 'openrouter' | 'google';
  selectedModel: string;
  baseUrl: string;
  maxTokens: number;
  targetWordCount: number;
  
  isGenerating: boolean;
  generationProgress: GenerationProgress | null;
  abortController: AbortController | null;
  
  generationQueue: GenerationTask[];
  isProcessingQueue: boolean;
  queueCompleted: (GenerationTask & { completedAt: number })[];
  queueFailed: (GenerationTask & { error: string; failedAt: number })[];
  
  batchQueue: number[];
  batchCompleted: number[];
  batchFailed: number[];
  isBatchRunning: boolean;
  
  setWorldBible: (bible: typeof initialWorldBible) => void;
  setEpisodeOutlines: (outlines: typeof initialEpisodeOutlines) => void;
  setOpenRouterApiKey: (key: string) => void;
  setGoogleGeminiApiKey: (key: string) => void;
  setAiProvider: (provider: 'openrouter' | 'google') => void;
  setSelectedModel: (model: string) => void;
  setBaseUrl: (url: string) => void;
  setMaxTokens: (tokens: number) => void;
  setTargetWordCount: (count: number) => void;
  setChapters: (chapters: Chapter[]) => void;
  syncAllChapters: () => Promise<void>;
  syncChapterFromFirestore: (id: string) => Promise<Chapter | null>;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: GenerationProgress | null) => void;
  setAbortController: (controller: AbortController | null) => void;
  
  addToQueue: (task: GenerationTask) => void;
  removeFromQueue: (id: string) => void;
  setIsProcessingQueue: (isProcessing: boolean) => void;
  addToQueueCompleted: (task: GenerationTask) => void;
  addToQueueFailed: (task: GenerationTask, error: string) => void;
  clearQueueStatus: () => void;
  
  setBatchQueue: (queue: number[]) => void;
  setBatchCompleted: (completed: number[]) => void;
  setBatchFailed: (failed: number[]) => void;
  setIsBatchRunning: (isRunning: boolean) => void;

  firebaseUsage: FirebaseUsage;
  incrementReads: (count: number) => void;
  incrementWrites: (count: number) => void;
}

const getTodayString = () => new Date().toISOString().split('T')[0];

const saveToLocalStorageCache = (userId: string, chapters: Chapter[]) => {
  try {
    const lightweightChapters = chapters.map(c => ({
      ...c,
      storyText: c.storyText && c.storyText !== "" ? "__EXISTS__" : "",
      grammarLessonText: c.grammarLessonText && c.grammarLessonText !== "" ? "__EXISTS__" : "",
      sideBySideText: c.sideBySideText && c.sideBySideText !== "" ? "__EXISTS__" : "",
      epubText: c.epubText && c.epubText !== "" ? "__EXISTS__" : "",
      continuitySummary: c.continuitySummary && c.continuitySummary !== "" ? "__EXISTS__" : "",
      wordBankJson: c.wordBankJson && c.wordBankJson.length > 0 ? [{ __exists__: true } as any] : [],
    }));
    localStorage.setItem(`chapters_cache_${userId}`, JSON.stringify(lightweightChapters));
  } catch (e) {
    console.error("Failed to write chapters to localStorage cache:", e);
  }
};

const initialUsage: FirebaseUsage = JSON.parse(localStorage.getItem('firebaseUsage') || 'null') || {
  reads: 0,
  writes: 0,
  date: getTodayString()
};
// Reset if date changed
if (initialUsage.date !== getTodayString()) {
  initialUsage.reads = 0;
  initialUsage.writes = 0;
  initialUsage.date = getTodayString();
  localStorage.setItem('firebaseUsage', JSON.stringify(initialUsage));
}

export const useStore = create<AppState>((set, get) => ({
  worldBible: initialWorldBible,
  episodeOutlines: initialEpisodeOutlines,
  chapters: [],
  openRouterApiKey: localStorage.getItem('openRouterApiKey') || '',
  googleGeminiApiKey: localStorage.getItem('googleGeminiApiKey') || '',
  aiProvider: (localStorage.getItem('aiProvider') as 'openrouter' | 'google') || 'google',
  selectedModel: localStorage.getItem('selectedModel') || 'gemini-1.5-flash',
  baseUrl: localStorage.getItem('baseUrl') || 'https://openrouter.ai/api/v1',
  maxTokens: parseInt(localStorage.getItem('maxTokens') || '32000', 10),
  targetWordCount: parseInt(localStorage.getItem('targetWordCount') || '8000', 10),
  
  isGenerating: false,
  generationProgress: null,
  abortController: null,
  
  generationQueue: JSON.parse(localStorage.getItem('generationQueue') || '[]'),
  isProcessingQueue: false,
  queueCompleted: JSON.parse(localStorage.getItem('queueCompleted') || '[]'),
  queueFailed: JSON.parse(localStorage.getItem('queueFailed') || '[]'),

  batchQueue: JSON.parse(localStorage.getItem('batchQueue') || '[]'),
  batchCompleted: JSON.parse(localStorage.getItem('batchCompleted') || '[]'),
  batchFailed: JSON.parse(localStorage.getItem('batchFailed') || '[]'),
  isBatchRunning: localStorage.getItem('isBatchRunning') === 'true',

  firebaseUsage: initialUsage,

  incrementReads: (count: number) => set((state) => {
    const today = getTodayString();
    let newUsage = { ...state.firebaseUsage };
    if (newUsage.date !== today) {
      newUsage = { reads: count, writes: 0, date: today };
    } else {
      newUsage.reads += count;
    }
    localStorage.setItem('firebaseUsage', JSON.stringify(newUsage));
    return { firebaseUsage: newUsage };
  }),

  incrementWrites: (count: number) => set((state) => {
    const today = getTodayString();
    let newUsage = { ...state.firebaseUsage };
    if (newUsage.date !== today) {
      newUsage = { reads: 0, writes: count, date: today };
    } else {
      newUsage.writes += count;
    }
    localStorage.setItem('firebaseUsage', JSON.stringify(newUsage));
    return { firebaseUsage: newUsage };
  }),

  setWorldBible: (bible) => set({ worldBible: bible }),
  setEpisodeOutlines: (outlines) => set({ episodeOutlines: outlines }),
  setOpenRouterApiKey: (key) => {
    localStorage.setItem('openRouterApiKey', key);
    set({ openRouterApiKey: key });
  },
  setGoogleGeminiApiKey: (key) => {
    localStorage.setItem('googleGeminiApiKey', key);
    set({ googleGeminiApiKey: key });
  },
  setAiProvider: (provider) => {
    localStorage.setItem('aiProvider', provider);
    set({ aiProvider: provider });
  },
  setSelectedModel: (model) => {
    localStorage.setItem('selectedModel', model);
    set({ selectedModel: model });
  },
  setBaseUrl: (url) => {
    localStorage.setItem('baseUrl', url);
    set({ baseUrl: url });
  },
  setMaxTokens: (tokens) => {
    localStorage.setItem('maxTokens', tokens.toString());
    set({ maxTokens: tokens });
  },
  setTargetWordCount: (count) => {
    localStorage.setItem('targetWordCount', count.toString());
    set({ targetWordCount: count });
  },
  setChapters: (chapters) => {
    const user = auth.currentUser;
    if (user) {
      saveToLocalStorageCache(user.uid, chapters);
    }
    set({ chapters });
  },
  syncAllChapters: async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const chaptersRef = collection(db, `users/${user.uid}/chapters`);
      const chaptersQuery = query(chaptersRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(chaptersQuery);
      get().incrementReads(Math.max(1, snapshot.size));
      
      const chaptersData = snapshot.docs.map(doc => doc.data() as any);
      chaptersData.sort((a, b) => a.chapterNumber - b.chapterNumber);
      
      set({ chapters: chaptersData });
      saveToLocalStorageCache(user.uid, chaptersData);
    } catch (error) {
      console.error("Failed to sync chapters:", error);
    }
  },
  syncChapterFromFirestore: async (id: string) => {
    const user = auth.currentUser;
    if (!user) return null;
    try {
      const docRef = doc(db, `users/${user.uid}/chapters/${id}`);
      const docSnap = await getDoc(docRef);
      get().incrementReads(1);
      if (docSnap.exists()) {
        const freshData = docSnap.data() as Chapter;
        let updatedChapters: Chapter[] = [];
        set((state) => {
          updatedChapters = state.chapters.map(c => c.id === id ? { ...c, ...freshData } : c);
          saveToLocalStorageCache(user.uid, updatedChapters);
          return { chapters: updatedChapters };
        });
        return freshData;
      }
    } catch (error) {
      console.error(`Error syncing chapter ${id} from Firestore:`, error);
    }
    return null;
  },
  addChapter: async (chapter) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, `users/${user.uid}/chapters/${chapter.id}`);
        // Strip undefined values before saving to Firestore
        const cleanChapter = Object.fromEntries(
          Object.entries(chapter).filter(([_, v]) => v !== undefined)
        );
        await setDoc(docRef, { ...cleanChapter, userId: user.uid });
        get().incrementWrites(1);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/chapters/${chapter.id}`);
      }
    }
    set((state) => {
      const newChapters = [...state.chapters, chapter];
      if (user) {
        saveToLocalStorageCache(user.uid, newChapters);
      }
      return { chapters: newChapters };
    });
  },
  updateChapter: async (id, updates) => {
    let updatedChapters: Chapter[] = [];
    set((state) => {
      updatedChapters = state.chapters.map(c => c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
      const user = auth.currentUser;
      if (user) {
        saveToLocalStorageCache(user.uid, updatedChapters);
      }
      return { chapters: updatedChapters };
    });
    const user = auth.currentUser;
    if (user) {
      try {
        const docRef = doc(db, `users/${user.uid}/chapters/${id}`);
        // Strip undefined values before saving to Firestore
        const cleanUpdates = Object.fromEntries(
          Object.entries(updates).filter(([_, v]) => v !== undefined)
        );
        await updateDoc(docRef, { ...cleanUpdates, updatedAt: new Date().toISOString() });
        get().incrementWrites(1);
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}/chapters/${id}`);
      }
    }
  },
  deleteChapter: async (id) => {
    const user = auth.currentUser;
    set((state) => {
      const newChapters = state.chapters.filter(c => c.id !== id);
      if (user) {
        saveToLocalStorageCache(user.uid, newChapters);
      }
      return { chapters: newChapters };
    });
    if (user) {
      try {
        const docRef = doc(db, `users/${user.uid}/chapters/${id}`);
        await deleteDoc(docRef);
        get().incrementWrites(1);
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `users/${user.uid}/chapters/${id}`);
      }
    }
  },
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (progress) => set({ generationProgress: progress }),
  setAbortController: (controller) => set({ abortController: controller }),
  
  addToQueue: (task) => set((state) => {
    if (state.generationQueue.some(t => t.id === task.id)) return state;
    const newQueue = [...state.generationQueue, task];
    localStorage.setItem('generationQueue', JSON.stringify(newQueue));
    return { generationQueue: newQueue };
  }),
  removeFromQueue: (id) => set((state) => {
    const newQueue = state.generationQueue.filter(t => t.id !== id);
    localStorage.setItem('generationQueue', JSON.stringify(newQueue));
    return { generationQueue: newQueue };
  }),
  setIsProcessingQueue: (isProcessingQueue) => set({ isProcessingQueue }),

  addToQueueCompleted: (task: GenerationTask) => set((state) => {
    const newCompleted = [{ ...task, completedAt: Date.now() }, ...state.queueCompleted].slice(0, 50); // Keep last 50
    localStorage.setItem('queueCompleted', JSON.stringify(newCompleted));
    return { queueCompleted: newCompleted };
  }),
  addToQueueFailed: (task, error) => set((state) => {
    const newFailed = [{ ...task, error, failedAt: Date.now() }, ...state.queueFailed].slice(0, 50); // Keep last 50
    localStorage.setItem('queueFailed', JSON.stringify(newFailed));
    return { queueFailed: newFailed };
  }),
  clearQueueStatus: () => set(() => {
    localStorage.removeItem('queueCompleted');
    localStorage.removeItem('queueFailed');
    return { queueCompleted: [], queueFailed: [] };
  }),
  
  setBatchQueue: (queue) => {
    localStorage.setItem('batchQueue', JSON.stringify(queue));
    set({ batchQueue: queue });
  },
  setBatchCompleted: (completed) => {
    localStorage.setItem('batchCompleted', JSON.stringify(completed));
    set({ batchCompleted: completed });
  },
  setBatchFailed: (failed) => {
    localStorage.setItem('batchFailed', JSON.stringify(failed));
    set({ batchFailed: failed });
  },
  setIsBatchRunning: (isRunning) => {
    localStorage.setItem('isBatchRunning', isRunning.toString());
    set({ isBatchRunning: isRunning });
  },
}));
