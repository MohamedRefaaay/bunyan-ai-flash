
import React from 'react';
import Header from '@/components/navigation/Header';
import ModernSidebar from '@/components/dashboard/ModernSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen } from 'lucide-react';

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

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-muted/30 w-full flex">
        {/* Sidebar */}
        {showSidebar && (
          <ModernSidebar
            activeFeature={activeFeature}
            onFeatureChange={onFeatureChange}
          />
        )}

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Header with Sidebar Trigger */}
          <header className="bg-white/95 backdrop-blur-md border-b border-blue-200 sticky top-0 z-40 w-full">
            <div className="w-full px-3 sm:px-4 lg:px-6 py-3">
              <div className="flex items-center justify-between w-full">
                {/* Mobile Sidebar Trigger & Logo */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {showSidebar && (
                    <SidebarTrigger className="lg:hidden h-8 w-8 p-0 flex-shrink-0" />
                  )}
                  
                  {/* Logo */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
                    <div className="min-w-0">
                      <h1 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 truncate">بنيان الذكي</h1>
                      <p className="text-xs text-gray-600 hidden sm:block truncate">منصة البطاقات التعليمية</p>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <Header />
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ResponsiveLayout;
