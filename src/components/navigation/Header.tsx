
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* الشعار */}
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">بنيان الذكي</h1>
              <p className="text-xs text-gray-600">منصة البطاقات التعليمية</p>
            </div>
          </div>

          {/* معلومات المستخدم والقائمة */}
          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-gray-700">
                  {user.user_metadata?.display_name || user.email?.split('@')[0] || 'مستخدم'}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">الإعدادات</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">خروج</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
