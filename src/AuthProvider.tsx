import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, setDoc, writeBatch, query, where } from 'firebase/firestore';
import { useStore, Chapter } from './store/useStore';
import { initialEpisodeOutlines } from './data/episodeOutlines';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const setChapters = useStore(state => state.setChapters);
  const userRef = React.useRef<User | null>(user);
  userRef.current = user;

  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      try {
        await getDoc(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    };
    testConnection();

    let logoutTimer: NodeJS.Timeout;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Clear any pending logout timer
      if (logoutTimer) clearTimeout(logoutTimer);

      const handleUserUpdate = () => {
        setUser(prevUser => {
          if (prevUser?.uid === currentUser?.uid) return prevUser;
          return currentUser;
        });
      };

      if (!currentUser && userRef.current) {
        // Debounce logout to survive wake-up transients (machine sleep/unlock)
        logoutTimer = setTimeout(() => {
          handleUserUpdate();
          setChapters([]);
          setLoading(false);
        }, 5000);
      } else {
        handleUserUpdate();
      }
      
      if (currentUser) {
        const cacheKey = `chapters_cache_${currentUser.uid}`;
        const cachedStr = localStorage.getItem(cacheKey);
        
        if (cachedStr) {
          try {
            const cachedChapters = JSON.parse(cachedStr);
            if (Array.isArray(cachedChapters) && cachedChapters.length > 0) {
              setChapters(cachedChapters);
              setLoading(false);
              return;
            }
          } catch (e) {
            console.error("Error loading cached chapters:", e);
          }
        }

        // Fetch once from Firebase if empty or no cache
        const chaptersRef = collection(db, `users/${currentUser.uid}/chapters`);
        const chaptersQuery = query(chaptersRef, where("userId", "==", currentUser.uid));
        
        let isInitializing = false;
        
        const fetchAndInitialize = async () => {
          try {
            const snapshot = await getDocs(chaptersQuery);
            useStore.getState().incrementReads(Math.max(1, snapshot.size));
            
            if (snapshot.empty) {
              if (isInitializing) return;
              isInitializing = true;
              
              const batch = writeBatch(db);
              const initialChapters = initialEpisodeOutlines.map(outline => {
                const chapter = {
                  id: `chapter-${outline.chapterNumber}`,
                  chapterNumber: outline.chapterNumber,
                  title: outline.title,
                  cefrLevel: outline.cefrLevel,
                  grammarFocus: outline.grammarFocus,
                  episodeJob: outline.episodeJob,
                  logline: outline.logline,
                  aStory: outline.aStory,
                  bStory: outline.bStory,
                  cStory: outline.cStory,
                  coreLanguageTarget: outline.coreLanguageTarget,
                  storyBeats: outline.storyBeats,
                  emotionalMovement: outline.emotionalMovement,
                  writerNotes: outline.writerNotes,
                  wordCount: 0,
                  status: 'pending',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  userId: currentUser.uid
                };
                return Object.fromEntries(
                  Object.entries(chapter).filter(([_, v]) => v !== undefined)
                ) as unknown as Chapter;
              });
              
              initialChapters.forEach(chapter => {
                const docRef = doc(db, `users/${currentUser.uid}/chapters`, chapter.id);
                batch.set(docRef, chapter);
              });
              
              await batch.commit();
              useStore.getState().incrementWrites(initialChapters.length);
              
              initialChapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
              setChapters(initialChapters);
              setLoading(false);
            } else {
              const chaptersData = snapshot.docs.map(doc => doc.data() as any);
              chaptersData.sort((a, b) => a.chapterNumber - b.chapterNumber);
              setChapters(chaptersData);
              setLoading(false);
            }
          } catch (error) {
            console.error("Error fetching chapters on signin:", error);
            setLoading(false);
            try {
              handleFirestoreError(error, OperationType.LIST, `users/${currentUser.uid}/chapters`);
            } catch (e) {}
          } finally {
            isInitializing = false;
          }
        };

        await fetchAndInitialize();
      } else {
        setChapters([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [setChapters]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
