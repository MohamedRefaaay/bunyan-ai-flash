
import React from 'react';
import Header from '@/components/navigation/Header';
import ModernSidebar from '@/components/dashboard/ModernSidebar';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookOpen, Menu } from 'lucide-react';

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
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 w-full flex">
        {/* Sidebar */}
        {showSidebar && (
          <ModernSidebar
            activeFeature={activeFeature}
            onFeatureChange={onFeatureChange}
          />
        )}

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col min-w-0">
          {/* Header with Sidebar Trigger */}
          <header className="bg-white/95 backdrop-blur-md border-b border-blue-200/50 sticky top-0 z-40 w-full shadow-sm">
            <div className="w-full px-3 sm:px-4 lg:px-6 py-3">
              <div className="flex items-center justify-between w-full">
                {/* Mobile Sidebar Trigger & Logo */}
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  {showSidebar && (
                    <SidebarTrigger className="lg:hidden h-10 w-10 p-2 flex-shrink-0 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-105" />
                  )}
                  
                  {/* Logo */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 hover:scale-110 transition-transform duration-300">
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                        بنيان الذكي
                      </h1>
                      <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate">
                        منصة البطاقات التعليمية الذكية
                      </p>
                    </div>
                  </div>
                </div>

                {/* Header Actions */}
                <div className="flex-shrink-0">
                  <Header />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-4 lg:p-6 w-full max-w-full overflow-x-hidden animate-fade-in">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ResponsiveLayout;
