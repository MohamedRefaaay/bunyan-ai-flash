
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
  SidebarProvider,
  SidebarTrigger
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

  const handleItemClick = (itemId: string | null) => {
    if (onFeatureChange) {
      onFeatureChange(itemId);
    }
    // Navigate to dashboard if not already there
    if (window.location.pathname !== '/dashboard') {
      navigate('/dashboard');
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const renderMenuGroup = (items: any[], groupLabel: string) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-right text-sm font-semibold text-gray-700">{groupLabel}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id || 'dashboard'}>
              <SidebarMenuButton
                onClick={() => handleItemClick(item.id)}
                isActive={item.active || activeFeature === item.id}
                className={`w-full justify-start gap-3 text-right transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 cursor-pointer ${
                  (item.active || activeFeature === item.id) 
                    ? 'bg-blue-100 text-blue-800 border-r-2 border-blue-600' 
                    : 'text-gray-700 hover:text-blue-700'
                }`}
              >
                <item.icon className={`h-5 w-5 ${
                  (item.active || activeFeature === item.id) ? 'text-blue-600' : 'text-gray-500'
                }`} />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar side="right" className="w-80 border-l border-gray-200">
      <SidebarHeader className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">بنيان الذكي</h3>
            <p className="text-xs text-gray-500">مدعوم بـ Google Gemini</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 space-y-2">
        {renderMenuGroup(mainMenuItems, 'الأدوات الرئيسية')}
        {renderMenuGroup(aiToolsItems, 'أدوات الذكاء الاصطناعي')}
        {renderMenuGroup(analyticsItems, 'التحليلات والتوصيات')}
        {renderMenuGroup(communityItems, 'المجتمع والتكامل')}
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSettingsClick}
              className="w-full justify-start gap-3 text-right transition-all duration-200 hover:bg-gray-50 hover:text-gray-800 cursor-pointer text-gray-700"
            >
              <Settings className="h-5 w-5 text-gray-500" />
              <span className="font-medium">إعدادات Gemini</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default ModernSidebar;
