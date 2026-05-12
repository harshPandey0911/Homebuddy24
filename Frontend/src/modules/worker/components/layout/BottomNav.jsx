import React, { useRef, useEffect, useState, memo, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUser, FiDollarSign } from 'react-icons/fi';
import { HiHome, HiBriefcase, HiUser } from 'react-icons/hi';
import { FiBell } from 'react-icons/fi';
import { gsap } from 'gsap';
import { workerTheme as themeColors } from '../../../../theme';
import api from '../../../../services/api';

const BottomNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const iconRefs = useRef({});
  const activeAnimations = useRef({});
  const [pendingJobsCount, setPendingJobsCount] = useState(0);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  // Load counts
  useEffect(() => {
    const updatePendingCount = () => {
      try {
        // Count pending assigned jobs (waiting for accept/reject)
        const assignedJobs = JSON.parse(localStorage.getItem('workerAssignedJobs') || '[]');
        const pendingJobs = assignedJobs.filter(job =>
          job.workerStatus === 'PENDING'
        );
        setPendingJobsCount(pendingJobs.length);
      } catch (error) {
        console.error('Error reading pending jobs:', error);
      }
    };

    const fetchUnreadCount = async () => {
      try {
        const res = await api.get('/notifications/worker');
        if (res.data.success && typeof res.data.unreadCount === 'number') {
          setUnreadNotificationsCount(res.data.unreadCount);
        }
      } catch (error) {
        // Silent fail
      }
    };

    updatePendingCount();
    fetchUnreadCount();

    window.addEventListener('storage', updatePendingCount);
    window.addEventListener('workerJobsUpdated', updatePendingCount);

    const interval = setInterval(fetchUnreadCount, 60000);

    return () => {
      window.removeEventListener('storage', updatePendingCount);
      window.removeEventListener('workerJobsUpdated', updatePendingCount);
      clearInterval(interval);
    };
  }, []);

  const navItems = useMemo(() => {
    return [
      { path: '/worker/dashboard', icon: FiHome, activeIcon: HiHome, label: 'Home' },
      { path: '/worker/jobs', icon: FiBriefcase, activeIcon: HiBriefcase, label: 'Jobs', badge: pendingJobsCount },
      { path: '/worker/wallet', icon: FiDollarSign, activeIcon: FiDollarSign, label: 'Wallet' },
      { path: '/worker/notifications', icon: FiBell, activeIcon: FiBell, label: 'Alerts', badge: unreadNotificationsCount },
      { path: '/worker/profile', icon: FiUser, activeIcon: HiUser, label: 'Profile' },
    ];
  }, [pendingJobsCount, unreadNotificationsCount]);

  const handleNavClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };



  return (
    <nav
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50 transition-all duration-500"
    >
      <div 
        className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-[32px] px-2 py-3 shadow-2xl shadow-black/10 flex items-center justify-around"
      >
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/worker/dashboard' && location.pathname === '/worker');
          const IconComponent = isActive ? item.activeIcon : item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="flex flex-col items-center justify-center relative px-4 py-2 rounded-2xl active:scale-90 transition-all group"
            >
              <div className="relative">
                <IconComponent
                  className={`w-5 h-5 transition-all duration-300 ${isActive ? 'scale-110 text-[#0F4A44]' : 'text-gray-400 group-hover:text-gray-600'}`}
                  style={{
                    color: isActive ? '#0F4A44' : '#9CA3AF',
                  }}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white"
                    style={{
                      minWidth: '16px',
                      height: '16px'
                    }}
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[9px] mt-1 tracking-tight transition-all duration-300 ${isActive ? 'font-black text-[#0F4A44]' : 'font-bold text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-600'}`}
                style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(2px)'
                }}
              >
                {item.label}
              </span>

              {/* Active Indicator Dot */}
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-[#0F4A44] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';
export default BottomNav;

