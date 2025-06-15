
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Home, 
  Upload, 
  BookOpen, 
  Clock, 
  Settings,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const menuItems = [
    { icon: Home, label: 'لوحة التحكم', active: true },
    { icon: Upload, label: 'رفع الملفات' },
    { icon: BookOpen, label: 'البطاقات التعليمية' },
    { icon: Clock, label: 'السجل' },
    { icon: Settings, label: 'الإعدادات' }
  ];

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
              variant={item.active ? "default" : "ghost"}
              className={`w-full justify-start gap-3 ${
                item.active 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
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
