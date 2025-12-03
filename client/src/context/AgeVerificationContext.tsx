import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useLocation } from 'wouter';

interface AgeVerificationContextType {
  isVerified: boolean;
  verifyAge: () => void;
  exitSite: () => void;
  hasSeenWelcome: boolean;
  setHasSeenWelcome: (seen: boolean) => void;
  isFirstVisit: boolean;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

const AGE_STORAGE_KEY = 'blueberry_age_verified';
const WELCOME_STORAGE_KEY = 'blueberry_welcome_seen';
const FIRST_VISIT_KEY = 'blueberry_first_visit';

export function AgeVerificationProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AGE_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [hasSeenWelcome, setHasSeenWelcomeState] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(WELCOME_STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [isFirstVisit, setIsFirstVisit] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = localStorage.getItem(FIRST_VISIT_KEY);
      if (!hasVisited) {
        localStorage.setItem(FIRST_VISIT_KEY, 'true');
        return true;
      }
      return false;
    }
    return true;
  });

  const verifyAge = () => {
    setIsVerified(true);
    localStorage.setItem(AGE_STORAGE_KEY, 'true');
    
    if (!hasSeenWelcome) {
      setTimeout(() => {
        navigate('/welcome');
      }, 100);
    }
  };

  const exitSite = () => {
    window.location.href = 'https://www.google.com';
  };

  const setHasSeenWelcome = (seen: boolean) => {
    setHasSeenWelcomeState(seen);
    localStorage.setItem(WELCOME_STORAGE_KEY, seen ? 'true' : 'false');
    setIsFirstVisit(false);
  };

  return (
    <AgeVerificationContext.Provider value={{ 
      isVerified, 
      verifyAge, 
      exitSite, 
      hasSeenWelcome, 
      setHasSeenWelcome,
      isFirstVisit 
    }}>
      {children}
    </AgeVerificationContext.Provider>
  );
}

export function useAgeVerification() {
  const context = useContext(AgeVerificationContext);
  if (!context) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
}
