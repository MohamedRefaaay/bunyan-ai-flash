
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Upload, 
  BookOpen, 
  Clock, 
  Settings,
  User,
  Brain,
  Bot,
  BarChart3,
  Users,
  Cloud,
  BookText,
  Lightbulb,
  Palette,
  Youtube,
  X,
  Menu
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeFeature?: string | null;
  onFeatureChange?: (feature: string | null) => void;
  isOpen?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

const Sidebar = ({ activeFeature, onFeatureChange, isOpen = true, onToggle, isMobile = false }: SidebarProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: null, icon: Home, label: 'لوحة التحكم', active: !activeFeature },
    { id: 'document-analyzer', icon: Brain, label: 'محلل المستندات' },
    { id: 'youtube', icon: Youtube, label: 'تلخيص يوتيوب' },
    { id: 'upload', icon: Upload, label: 'رفع الملفات الصوتية' },
    { id: 'summary', icon: BookText, label: 'التحليل الذكي' },
    { id: 'generator', icon: Bot, label: 'مولد البطاقات' },
    { id: 'preview', icon: BookOpen, label: 'معاينة البطاقات' },
    { id: 'editor', icon: Bot, label: 'محرر البطاقات' },
    { id: 'analytics', icon: BarChart3, label: 'تحليل الأداء' },
    { id: 'recommendations', icon: Lightbulb, label: 'التوصيات الذكية' },
    { id: 'personalization', icon: Palette, label: 'التخصيص الشخصي' },
    { id: 'visual', icon: Bot, label: 'البطاقات المرئية' },
    { id: 'community', icon: Users, label: 'مجتمع التعلم' },
    { id: 'cloud', icon: Cloud, label: 'التكامل السحابي' },
  ];

  const handleItemClick = (itemId: string | null) => {
    if (onFeatureChange) {
      onFeatureChange(itemId);
    }
    // Close sidebar on mobile after selection
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    if (isMobile && onToggle) {
      onToggle();
    }
  };

  // Mobile overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={cn(
          "fixed top-0 right-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden",
          "shadow-2xl border-l border-gray-200 overflow-y-auto",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}>
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">بنيان الذكي</h3>
                <p className="text-xs text-gray-500">منصة التعلم الذكي</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="p-4 pb-20">
            <nav className="space-y-1">
              {menuItems.map((item, index) => (
                <Button
                  key={index}
                  variant={item.active || activeFeature === item.id ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-12 text-right",
                    item.active || activeFeature === item.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                  onClick={() => handleItemClick(item.id)}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm truncate">{item.label}</span>
                </Button>
              ))}
              
              {/* Settings Button */}
              <div className="pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  onClick={handleSettingsClick}
                >
                  <Settings className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm">إعدادات التطبيق</span>
                </Button>
              </div>
            </nav>
          </div>
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <div className={cn(
      "fixed right-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 z-30",
      isOpen ? "w-64" : "w-16"
    )}>
      <Card className="h-full bg-white border-0 shadow-sm overflow-y-auto">
        <div className="p-4">
          {/* Profile Section */}
          <div className={cn(
            "flex items-center gap-3 mb-6 pb-4 border-b border-gray-100",
            !isOpen && "justify-center"
          )}>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            {isOpen && (
              <div className="min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">بنيان الذكي</h3>
                <p className="text-xs text-gray-500 truncate">منصة التعلم الذكي</p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map((item, index) => (
              <Button
                key={index}
                variant={item.active || activeFeature === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full gap-3 h-10",
                  item.active || activeFeature === item.id
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
                  isOpen ? "justify-start" : "justify-center px-2"
                )}
                onClick={() => handleItemClick(item.id)}
                title={!isOpen ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {isOpen && <span className="text-sm truncate">{item.label}</span>}
              </Button>
            ))}
            
            {/* Settings Button */}
            <div className="pt-4 border-t border-gray-100">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 h-10 text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  isOpen ? "justify-start" : "justify-center px-2"
                )}
                onClick={handleSettingsClick}
                title={!isOpen ? "إعدادات التطبيق" : undefined}
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                {isOpen && <span className="text-sm">إعدادات التطبيق</span>}
              </Button>
            </div>
          </nav>
        </div>
      </Card>
    </div>
  );
};

export default Sidebar;
