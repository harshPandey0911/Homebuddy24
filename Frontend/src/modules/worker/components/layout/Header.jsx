import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBell, FiSearch } from 'react-icons/fi';
import { gsap } from 'gsap';
import { workerTheme as themeColors } from '../../../../theme';
import { animateLogo } from '../../../../utils/gsapAnimations';
import Logo from '../../../../components/common/Logo';
import api from '../../../../services/api';

const Header = ({
  title,
  onBack,
  showBack = true,
  showSearch = false,
  showNotifications = true,
  notificationCount = 0
}) => {
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const bellRef = useRef(null);
  const bellButtonRef = useRef(null);
  const [count, setCount] = useState(notificationCount);

  // Sync prop changes
  useEffect(() => {
    if (typeof notificationCount !== 'undefined') {
      setCount(notificationCount);
    }
  }, [notificationCount]);

  // Fetch unread count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/notifications/worker');
        if (res.data.success && typeof res.data.unreadCount === 'number') {
          setCount(res.data.unreadCount);
        }
      } catch (error) {
        // Silent fail
      }
    };

    if (showNotifications) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
      return () => clearInterval(interval);
    }
  }, [showNotifications]);

  useEffect(() => {
    if (logoRef.current && !showBack) {
      animateLogo(logoRef.current);
      gsap.fromTo(logoRef.current,
        {
          opacity: 0,
          scale: 0.8,
          y: -10
        },
        {
          opacity: 1,
          scale: 1.0,
          y: 0,
          duration: 0.6,
          ease: 'back.out(1.7)'
        }
      );
    }
  }, [showBack]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleNotifications = () => {
    navigate('/worker/notifications');
  };

  const handleLogoClick = () => {
    navigate('/worker/dashboard');
  };

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: themeColors.primary,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <div className="px-5 py-3 flex items-center justify-between">
        {/* Left: Back button or Logo */}
        <div className="flex items-center gap-4">
          {showBack ? (
            <button
              onClick={handleBack}
              className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 active:scale-90 transition-all"
            >
              <FiArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : (
            <div
              className="cursor-pointer active:scale-95 transition-all"
              onClick={handleLogoClick}
            >
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-1">
                Worker<span className="text-white/40">Hub</span>
              </h1>
            </div>
          )}
          {showBack && <h1 className="text-lg font-black text-white tracking-tight">{title || 'Worker'}</h1>}
        </div>

        {/* Right: Search and Notifications */}
        <div className="flex items-center gap-3">
          {showSearch && (
            <button
              className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10 active:scale-90 transition-all"
              onClick={() => navigate('/worker/jobs')}
            >
              <FiSearch className="w-5 h-5 text-white" />
            </button>
          )}
          {showNotifications && (
            <div
              className="relative cursor-pointer active:scale-90 transition-all"
              onClick={handleNotifications}
            >
              <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                <FiBell className="w-5 h-5 text-white" />
              </div>
              {count > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center z-20 border-2"
                  style={{
                    minWidth: '20px',
                    height: '20px',
                    borderColor: themeColors.primary
                  }}
                >
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
