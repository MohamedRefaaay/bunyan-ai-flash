
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
  Palette
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeFeature?: string | null;
  onFeatureChange?: (feature: string | null) => void;
}

const Sidebar = ({ activeFeature, onFeatureChange }: SidebarProps) => {
  const menuItems = [
    { id: null, icon: Home, label: 'لوحة التحكم', active: !activeFeature },
    { id: 'document-analyzer', icon: Brain, label: 'محلل المستندات' },
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
  };

  return (
    <Card className="h-fit bg-white border-0 shadow-sm">
      <div className="p-6">
        {/* Profile Section */}
        <div className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">بنيان الذكي</h3>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Button
              key={index}
              variant={item.active || activeFeature === item.id ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                item.active || activeFeature === item.id
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              onClick={() => handleItemClick(item.id)}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </nav>
      </div>
    </Card>
  );
};

export default Sidebar;
