
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, User, Settings, LogOut, Languages, Menu } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuToggle?: () => void;
  isMobile?: boolean;
}

const Header = ({ onMenuToggle, isMobile = false }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { isRTL, toggleRTL } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('تم تسجيل الخروج بنجاح');
    } catch (error) {
      toast.error('حدث خطأ أثناء تسجيل الخروج');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-blue-200 sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu Button */}
            {isMobile && onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden h-8 w-8 p-0"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 lg:gap-3">
              <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <div>
                <h1 className="text-lg lg:text-xl font-bold text-gray-900">بنيان الذكي</h1>
                <p className="text-xs text-gray-600 hidden sm:block">منصة البطاقات التعليمية</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {/* Navigation Links - Hidden on mobile */}
            {user && (
              <div className="hidden md:flex items-center gap-2 lg:gap-4">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/">الرئيسية</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/dashboard">لوحة التحكم</Link>
                </Button>
              </div>
            )}

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRTL}
              className="gap-1 lg:gap-2 text-xs lg:text-sm"
            >
              <Languages className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">{isRTL ? 'English' : 'العربية'}</span>
            </Button>

            {/* User Info & Actions */}
            {user && (
              <>
                {/* User Info - Hidden on small screens */}
                <div className="hidden lg:flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-700">
                    {user.user_metadata?.display_name || user.email?.split('@')[0] || 'مستخدم'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 lg:gap-2">
                  {/* Settings Button */}
                  <Button asChild variant="ghost" size="sm" className="gap-1 lg:gap-2 text-xs lg:text-sm">
                    <Link to="/settings">
                      <Settings className="h-3 w-3 lg:h-4 lg:w-4" />
                      <span className="hidden sm:inline">الإعدادات</span>
                    </Link>
                  </Button>
                  
                  {/* Sign Out Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="gap-1 lg:gap-2 text-xs lg:text-sm"
                  >
                    <LogOut className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden sm:inline">خروج</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
