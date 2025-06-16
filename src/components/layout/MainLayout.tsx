
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import AuthPage from '@/components/auth/AuthPage';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { useLanguage } from '@/contexts/LanguageContext';

interface MainLayoutProps {
  children: React.ReactNode;
  activeFeature?: string | null;
  onFeatureChange?: (feature: string | null) => void;
  showSidebar?: boolean;
}

const MainLayout = ({ children, activeFeature, onFeatureChange, showSidebar }: MainLayoutProps) => {
  const { user, loading } = useAuth();
  const { isRTL } = useLanguage();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <ResponsiveLayout
        activeFeature={activeFeature}
        onFeatureChange={onFeatureChange}
        showSidebar={showSidebar}
      >
        {children}
      </ResponsiveLayout>
    </div>
  );
};

export default MainLayout;
