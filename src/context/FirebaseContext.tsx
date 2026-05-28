import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  doc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot,
  getDoc
} from "firebase/firestore";
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider
} from "firebase/auth";
import { db, auth, handleFirestoreError, OperationType } from "../utils/firebase";
import profilePic from "../assets/IMG_5197.jpeg";

interface FirebaseContextType {
  user: any;
  authLoading: boolean;
  citizenProfile: any | null;
  visitorCount: number;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
  updateCitizenProfile: (updates: any) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [citizenProfile, setCitizenProfile] = useState<any | null>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Monitor real Firebase Auth state
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setAuthLoading(true);
      if (firebaseUser) {
        const citizenRef = doc(db, "citizens", firebaseUser.uid);
        try {
          const docSnap = await getDoc(citizenRef);
          if (!docSnap.exists()) {
            // Generate standard funny profile values
            const funnyNames = [
              "Div Centering Guru 🤡",
              "CSS Grid Survivor 💀",
              "Git Push --Force Expert 💣",
              "React Loop Creator 🔄",
              "StackOverflow Historian 🕵️‍♀️",
              "10x Copy-Paster Pro 🚀",
              "TypeScript Any-Caster 🌟",
              "Coffee Optimizer ☕"
            ];
            const randomName = funnyNames[Math.floor(Math.random() * funnyNames.length)];
            const newProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || randomName,
              photoURL: firebaseUser.photoURL || profilePic,
              joinedAt: new Date().toISOString(),
              occupation: "CSS Grid Survivor 💀",
              favoriteBug: "Off-by-one error",
              clearance: "LEVEL OMEGA",
              codingSkill: "Brilliant Chaos",
              address: "Khulna, Sector 7",
              accentColor: "#006a4e",
              sticker: "none",
              email: firebaseUser.email || ""
            };
            await setDoc(citizenRef, newProfile);
            setUser(newProfile);
            setCitizenProfile(newProfile);
          } else {
            const data = docSnap.data();
            setUser(data);
            setCitizenProfile(data);
          }
        } catch (error) {
          console.warn("Failed to retrieve/create citizen profile, using local fallback:", error);
          const fallbackProfile = {
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "Dumb Citizen 🤡",
            photoURL: firebaseUser.photoURL || profilePic,
            joinedAt: new Date().toISOString(),
            occupation: "CSS Grid Survivor 💀",
            favoriteBug: "Off-by-one error",
            clearance: "LEVEL OMEGA",
            codingSkill: "Brilliant Chaos",
            address: "Khulna, Sector 7",
            accentColor: "#006a4e",
            sticker: "none",
            email: firebaseUser.email || ""
          };
          setUser(fallbackProfile);
          setCitizenProfile(fallbackProfile);
        }
      } else {
        const localProfile = localStorage.getItem("dumbland_offline_profile");
        if (localProfile) {
          try {
            const parsed = JSON.parse(localProfile);
            setUser(parsed);
            setCitizenProfile(parsed);
          } catch (e) {
            // Default to Queen Profile if nothing is saved
          }
        } else {
          // If not logged in and no local profile, set to null
          setUser(null);
          setCitizenProfile(null);
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // Monitor and update website visitor count
  useEffect(() => {
    // Keep reference and track if already checked/incremented this session
    const statRef = doc(db, "stats", "global");
    
    // Listen for visitor counter changes in real-time
    const unsubscribeSnapshot = onSnapshot(statRef, (docSnap) => {
      if (docSnap.exists()) {
        setVisitorCount(docSnap.data().visitors || 0);
      }
    }, (error) => {
      console.warn("Unable to subscribe to visitors snapshot:", error);
    });

    // Helper process to safely increment visitor count once per browser session
    const recordVisitorTrack = async () => {
      const alreadyVisited = sessionStorage.getItem("dumb_world_visited");
      if (!alreadyVisited) {
        try {
          const docSnap = await getDoc(statRef);
          if (!docSnap.exists()) {
            await setDoc(statRef, { visitors: 1 });
          } else {
            await updateDoc(statRef, { visitors: increment(1) });
          }
          sessionStorage.setItem("dumb_world_visited", "true");
        } catch (error) {
          // Follow Firebase Skill guidelines error mapping if it fails
          handleFirestoreError(error, OperationType.WRITE, "stats/global");
        }
      }
    };

    recordVisitorTrack();

    return () => unsubscribeSnapshot();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Popup Authentication failed:", error);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Signout failed:", error);
    }
  };

  const updateCitizenProfile = async (updates: any) => {
    if (!auth.currentUser) {
      // Offline mode updates
      setUser((prev: any) => {
        const merged = prev ? { ...prev, ...updates, isOffline: true } : { ...updates, isOffline: true };
        localStorage.setItem("dumbland_offline_profile", JSON.stringify(merged));
        setCitizenProfile(merged);
        return merged;
      });
      return;
    }
    const citizenId = auth.currentUser.uid;
    const citizenRef = doc(db, "citizens", citizenId);
    try {
      await setDoc(citizenRef, updates, { merge: true });
      setUser((prev: any) => {
        const merged = prev ? { ...prev, ...updates } : { ...updates };
        setCitizenProfile(merged);
        return merged;
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `citizens/${citizenId}`);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        authLoading,
        citizenProfile,
        visitorCount,
        loginWithGoogle,
        logoutUser,
        updateCitizenProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};
