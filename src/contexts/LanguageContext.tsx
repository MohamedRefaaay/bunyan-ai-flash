
import { createContext, useState, useContext, ReactNode, useMemo } from 'react';

interface LanguageContextType {
  isRTL: boolean;
  toggleRTL: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [isRTL, setIsRTL] = useState(true);

  const toggleRTL = () => {
    setIsRTL(prev => !prev);
  };
  
  const value = useMemo(() => ({ isRTL, toggleRTL }), [isRTL]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
