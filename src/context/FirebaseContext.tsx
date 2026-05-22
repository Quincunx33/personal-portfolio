import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment, 
  onSnapshot,
  getDocFromServer
} from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../utils/firebase";

interface FirebaseContextType {
  user: User | null;
  authLoading: boolean;
  citizenProfile: any | null;
  visitorCount: number;
  loginWithGoogle: () => Promise<void>;
  logoutUser: () => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [citizenProfile, setCitizenProfile] = useState<any | null>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);

  // Monitor Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (usersData) => {
      setUser(usersData);
      setAuthLoading(false);

      if (usersData) {
        if (!usersData.emailVerified) {
          console.warn("User email is not verified. Some features might be restricted.");
        }
        // Log of Dumb Citizen Profile
        const citizenRef = doc(db, "citizens", usersData.uid);
        try {
          const docSnap = await getDoc(citizenRef);
          if (!docSnap.exists()) {
            const newCitizen = {
              uid: usersData.uid,
              displayName: usersData.displayName || "Dumb Citizen",
              photoURL: usersData.photoURL || null,
              joinedAt: new Date().toISOString(),
            };
            await setDoc(citizenRef, newCitizen);
            setCitizenProfile(newCitizen);
          } else {
            setCitizenProfile(docSnap.data());
          }
        } catch (err) {
          console.error("Error setting up citizen profile: ", err);
        }
      } else {
        setCitizenProfile(null);
      }
    });

    return () => unsubscribe();
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
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login Error: ", error);
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error: ", error);
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
