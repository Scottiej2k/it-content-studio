import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  setPersistence, 
  browserLocalPersistence, 
  indexedDBLocalPersistence,
  onIdTokenChanged
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth with explicitly persistent layers
export const auth = getAuth(app);

// Pin persistence to LOCAL so it survives machine sleep/lock and browser restarts
// We do this immediately to ensure it's applied before any UI logic
setPersistence(auth, indexedDBLocalPersistence).catch((error) => {
  console.error("Error setting auth persistence:", error);
});

// Heartbeat to keep the session active during long generations or idle periods
// This periodically refreshes the ID token to signal activity to Firebase
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (auth.currentUser) {
      auth.currentUser.getIdToken(true).catch(err => {
        console.warn("Token heartbeat refresh failed (likely offline):", err);
      });
    }
  }, 10 * 60 * 1000); // Every 10 minutes
}

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    console.error("Error signing in with Google", error);
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out", error);
  }
};
