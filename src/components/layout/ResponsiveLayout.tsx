
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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <Header 
        onMenuToggle={showSidebar ? toggleSidebar : undefined}
        isMobile={isMobile}
      />

      {/* Main Layout */}
      <div className="flex">
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
          "flex-1 min-h-[calc(100vh-4rem)]",
          showSidebar && !isMobile && !desktopSidebarCollapsed && "lg:ml-0",
          showSidebar && !isMobile && desktopSidebarCollapsed && "lg:ml-0"
        )}>
          <div className="p-4 lg:p-6 max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsiveLayout;
