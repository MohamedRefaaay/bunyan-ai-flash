
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
    <header className="bg-white/95 backdrop-blur-md border-b border-blue-200 sticky top-0 z-40 w-full">
      <div className="w-full px-3 sm:px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between w-full">
          {/* Mobile Menu Toggle & Logo */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden h-8 w-8 p-0 flex-shrink-0"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 min-w-0 flex-1">
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-xl font-bold text-gray-900 truncate">بنيان الذكي</h1>
                <p className="text-xs text-gray-600 hidden sm:block truncate">منصة البطاقات التعليمية</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
            {/* Navigation Links - Hidden on mobile */}
            {user && (
              <div className="hidden md:flex items-center gap-1 lg:gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs lg:text-sm">
                  <Link to="/">الرئيسية</Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-xs lg:text-sm">
                  <Link to="/dashboard">لوحة التحكم</Link>
                </Button>
              </div>
            )}

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRTL}
              className="gap-1 text-xs h-8 px-2 sm:px-3"
            >
              <Languages className="h-3 w-3" />
              <span className="hidden sm:inline text-xs">{isRTL ? 'EN' : 'ع'}</span>
            </Button>

            {/* User Info & Actions */}
            {user && (
              <>
                {/* User Info - Hidden on small screens */}
                <div className="hidden lg:flex items-center gap-2 text-sm min-w-0">
                  <User className="h-4 w-4 text-gray-600 flex-shrink-0" />
                  <span className="text-gray-700 truncate max-w-24">
                    {user.user_metadata?.display_name || user.email?.split('@')[0] || 'مستخدم'}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  {/* Settings Button */}
                  <Button asChild variant="ghost" size="sm" className="h-8 px-2 sm:px-3">
                    <Link to="/settings" className="flex items-center gap-1">
                      <Settings className="h-3 w-3" />
                      <span className="hidden sm:inline text-xs">إعدادات</span>
                    </Link>
                  </Button>
                  
                  {/* Sign Out Button */}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSignOut}
                    className="h-8 px-2 sm:px-3 gap-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span className="hidden sm:inline text-xs">خروج</span>
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
