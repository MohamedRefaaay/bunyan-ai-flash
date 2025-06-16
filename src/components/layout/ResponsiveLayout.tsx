
import React, { useState, useEffect } from 'react';
import Header from '@/components/navigation/Header';
import Sidebar from '@/components/dashboard/Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  activeFeature?: string | null;
  onFeatureChange?: (feature: string | null) => void;
  showSidebar?: boolean;
}

const ResponsiveLayout = ({ 
  children, 
  activeFeature, 
  onFeatureChange, 
  showSidebar = true 
}: ResponsiveLayoutProps) => {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopSidebarCollapsed, setDesktopSidebarCollapsed] = useState(false);

  // Close mobile sidebar when screen becomes desktop
  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setDesktopSidebarCollapsed(!desktopSidebarCollapsed);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 w-full">
      {/* Header */}
      <Header 
        onMenuToggle={showSidebar ? toggleSidebar : undefined}
        isMobile={isMobile}
      />

      {/* Main Layout */}
      <div className="flex w-full">
        {/* Sidebar */}
        {showSidebar && (
          <Sidebar
            activeFeature={activeFeature}
            onFeatureChange={onFeatureChange}
            isOpen={isMobile ? sidebarOpen : !desktopSidebarCollapsed}
            onToggle={toggleSidebar}
            isMobile={isMobile}
          />
        )}

        {/* Main Content */}
        <main className={cn(
          "flex-1 min-h-[calc(100vh-4rem)] w-full overflow-x-hidden",
          !isMobile && showSidebar && !desktopSidebarCollapsed && "lg:pr-64",
          !isMobile && showSidebar && desktopSidebarCollapsed && "lg:pr-16"
        )}>
          <div className="p-3 sm:p-4 lg:p-6 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
