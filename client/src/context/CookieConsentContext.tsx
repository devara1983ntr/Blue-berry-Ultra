import { createContext, useContext, useState, type ReactNode } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface CookieConsentContextType {
  hasConsented: boolean;
  preferences: CookiePreferences;
  acceptAll: () => void;
  acceptNecessary: () => void;
  savePreferences: (prefs: CookiePreferences) => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
}

const CookieConsentContext = createContext<CookieConsentContextType | undefined>(undefined);

const STORAGE_KEY = 'blueberry_cookie_consent';
const PREFS_KEY = 'blueberry_cookie_preferences';

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  personalization: false,
};

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    }
    return false;
  });

  const [preferences, setPreferences] = useState<CookiePreferences>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(PREFS_KEY);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return defaultPreferences;
        }
      }
    }
    return defaultPreferences;
  });

  const [showBanner, setShowBanner] = useState<boolean>(!hasConsented);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true,
    };
    setPreferences(allAccepted);
    setHasConsented(true);
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(PREFS_KEY, JSON.stringify(allAccepted));
  };

  const acceptNecessary = () => {
    const necessaryOnly: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false,
    };
    setPreferences(necessaryOnly);
    setHasConsented(true);
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(PREFS_KEY, JSON.stringify(necessaryOnly));
  };

  const savePreferences = (prefs: CookiePreferences) => {
    const withNecessary = { ...prefs, necessary: true };
    setPreferences(withNecessary);
    setHasConsented(true);
    setShowBanner(false);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(PREFS_KEY, JSON.stringify(withNecessary));
  };

  return (
    <CookieConsentContext.Provider
      value={{
        hasConsented,
        preferences,
        acceptAll,
        acceptNecessary,
        savePreferences,
        showBanner,
        setShowBanner,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieConsentProvider');
  }
  return context;
}
