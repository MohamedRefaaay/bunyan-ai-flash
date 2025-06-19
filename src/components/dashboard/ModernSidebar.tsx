
import React from 'react';
import { 
  Home, 
  Upload, 
  BookOpen, 
  Settings,
  Brain,
  Bot,
  BarChart3,
  Users,
  Cloud,
  BookText,
  Lightbulb,
  Palette,
  Youtube
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

interface ModernSidebarProps {
  activeFeature?: string | null;
  onFeatureChange?: (feature: string | null) => void;
}

const ModernSidebar = ({ activeFeature, onFeatureChange }: ModernSidebarProps) => {
  const navigate = useNavigate();

  const mainMenuItems = [
    { id: null, icon: Home, label: 'لوحة التحكم', active: !activeFeature },
    { id: 'document-analyzer', icon: Brain, label: 'محلل المستندات' },
    { id: 'youtube', icon: Youtube, label: 'تلخيص يوتيوب' },
    { id: 'upload', icon: Upload, label: 'رفع الملفات الصوتية' },
  ];

  const aiToolsItems = [
    { id: 'summary', icon: BookText, label: 'التحليل الذكي' },
    { id: 'generator', icon: Bot, label: 'مولد البطاقات' },
    { id: 'preview', icon: BookOpen, label: 'معاينة البطاقات' },
    { id: 'editor', icon: Bot, label: 'محرر البطاقات' },
    { id: 'visual', icon: Bot, label: 'البطاقات المرئية' },
  ];

  const analyticsItems = [
    { id: 'analytics', icon: BarChart3, label: 'تحليل الأداء' },
    { id: 'recommendations', icon: Lightbulb, label: 'التوصيات الذكية' },
    { id: 'personalization', icon: Palette, label: 'التخصيص الشخصي' },
  ];

  const communityItems = [
    { id: 'community', icon: Users, label: 'مجتمع التعلم' },
    { id: 'cloud', icon: Cloud, label: 'التكامل السحابي' },
  ];

  const handleItemClick = (itemId: string | null, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    console.log('Sidebar item clicked:', itemId);
    
    // Force focus management for mobile
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.blur) {
      activeElement.blur();
    }
    
    // Always call onFeatureChange to update the active feature
    if (onFeatureChange) {
      onFeatureChange(itemId);
    }
    
    // Navigate to dashboard if not already there
    const currentPath = window.location.pathname;
    if (currentPath !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const handleSettingsClick = (event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    navigate('/settings');
  };

  const renderMenuGroup = (items: any[], groupLabel: string) => (
    <SidebarGroup className="animate-fade-in">
      <SidebarGroupLabel className="text-right text-sm font-semibold text-gray-700 mb-2 px-2 py-1 transition-colors duration-200 hover:text-blue-600">
        {groupLabel}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item, index) => (
            <SidebarMenuItem key={item.id || 'dashboard'} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <SidebarMenuButton
                onClick={(event) => handleItemClick(item.id, event)}
                isActive={item.active || activeFeature === item.id}
                className={`w-full justify-start gap-3 text-right transition-all duration-300 ease-in-out cursor-pointer rounded-lg p-3 group hover:scale-[1.02] transform min-h-[48px] touch-manipulation select-none ${
                  (item.active || activeFeature === item.id) 
                    ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-r-4 border-blue-600 shadow-md' 
                    : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-blue-700 hover:shadow-sm'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleItemClick(item.id);
                  }
                }}
              >
                <item.icon className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${
                  (item.active || activeFeature === item.id) 
                    ? 'text-blue-600' 
                    : 'text-gray-500 group-hover:text-blue-600'
                }`} />
                <span className="font-medium transition-all duration-200 group-hover:translate-x-1 flex-1 text-right truncate">
                  {item.label}
                </span>
                {(item.active || activeFeature === item.id) && (
                  <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full animate-pulse flex-shrink-0"></div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar side="right" className="w-80 border-l border-gray-200 bg-white/95 backdrop-blur-md">
      <SidebarHeader className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3 animate-scale-in">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 transform flex-shrink-0">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              بنيان الذكي
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1 truncate">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></span>
              مدعوم بـ Google Gemini
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overscroll-contain">
        {renderMenuGroup(mainMenuItems, 'الأدوات الرئيسية')}
        {renderMenuGroup(aiToolsItems, 'أدوات الذكاء الاصطناعي')}
        {renderMenuGroup(analyticsItems, 'التحليلات والتوصيات')}
        {renderMenuGroup(communityItems, 'المجتمع والتكامل')}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={(event) => handleSettingsClick(event)}
              className="w-full justify-start gap-3 text-right transition-all duration-300 hover:bg-gradient-to-r hover:from-gray-100 hover:to-blue-100 hover:text-gray-800 cursor-pointer text-gray-700 rounded-lg p-3 group hover:scale-[1.02] transform hover:shadow-sm min-h-[48px] touch-manipulation select-none"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSettingsClick();
                }
              }}
            >
              <Settings className="h-5 w-5 text-gray-500 group-hover:text-blue-600 transition-all duration-300 group-hover:rotate-45 flex-shrink-0" />
              <span className="font-medium transition-all duration-200 group-hover:translate-x-1 flex-1 text-right truncate">
                إعدادات Gemini
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ModernSidebar;
