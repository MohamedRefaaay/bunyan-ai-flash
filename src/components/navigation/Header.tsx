
import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, Languages } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Header = () => {
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
    <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
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
  );
};

export default Header;
