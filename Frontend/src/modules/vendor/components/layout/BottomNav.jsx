import React, { useState, useEffect, memo, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiBriefcase, FiUsers, FiUser } from 'react-icons/fi';
import { HiHome, HiBriefcase, HiUsers, HiUser } from 'react-icons/hi';
import { FaWallet } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { vendorTheme as themeColors } from '../../../../theme';

const BottomNav = memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingJobsCount, setPendingJobsCount] = useState(0);

  // Load pending jobs count from localStorage
  useEffect(() => {
    const updatePendingCount = () => {
      try {
        // Count active jobs (PENDING only) to show new requests
        const acceptedBookings = JSON.parse(localStorage.getItem('vendorAcceptedBookings') || '[]');
        const activeJobs = acceptedBookings.filter(job => job.status === 'PENDING');
        setPendingJobsCount(activeJobs.length);
      } catch (error) {
        console.error('Error reading pending jobs:', error);
      }
    };

    updatePendingCount();
    window.addEventListener('storage', updatePendingCount);
    window.addEventListener('vendorJobsUpdated', updatePendingCount);

    return () => {
      window.removeEventListener('storage', updatePendingCount);
      window.removeEventListener('vendorJobsUpdated', updatePendingCount);
    };
  }, []);

  // Use useMemo to update navItems when pendingJobsCount changes
  const navItems = useMemo(() => {
    // Count jobs that require attention (Pending, Accepted, In Progress)
    const badgeCount = pendingJobsCount;

    return [
      { path: '/vendor/dashboard', icon: FiHome, activeIcon: HiHome, label: 'Home' },
      { path: '/vendor/jobs', icon: FiBriefcase, activeIcon: HiBriefcase, label: 'Jobs', badge: badgeCount },
      { path: '/vendor/workers', icon: FiUsers, activeIcon: HiUsers, label: 'Workers' },
      { path: '/vendor/wallet', icon: FaWallet, activeIcon: FaWallet, label: 'Wallet' },
      { path: '/vendor/profile', icon: FiUser, activeIcon: HiUser, label: 'Profile' },
    ];
  }, [pendingJobsCount]);

  const handleNavClick = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    }
  };

  // Hide nav when specific routes are active (booking alerts, maps)
  const hideNavRoutes = [
    '/vendor/booking-alert/',
    '/vendor/booking/',
  ];

  const shouldHideNav = hideNavRoutes.some(route =>
    location.pathname.includes(route) &&
    (location.pathname.includes('/map') || location.pathname.includes('/alert/'))
  );

  if (shouldHideNav) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-6 left-0 right-0 z-40 w-full px-6"
    >
      <div
        className="max-w-md mx-auto py-3 px-4 rounded-[32px] bg-white shadow-[0_15px_40px_rgba(0,0,0,0.12)] border border-black/5"
      >
        <div className="flex items-center justify-around relative px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path ||
              (item.path === '/vendor/dashboard' && location.pathname === '/vendor');
            const IconComponent = isActive ? item.activeIcon : item.icon;

            return (
              <button
                key={item.path}
                onClick={() => handleNavClick(item.path)}
                className={`flex items-center justify-center transition-all duration-300 relative ${isActive ? 'px-4 py-2.5 rounded-full bg-[#0F4A44] text-white shadow-lg shadow-[#0F4A44]/20' : 'p-2 text-gray-400'}`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent
                    className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-900 opacity-60'}`}
                  />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      className="text-[12px] font-black whitespace-nowrap overflow-hidden tracking-tight"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm min-w-[16px] h-[16px] px-0.5 ${isActive ? 'bg-orange-500' : 'bg-black'}`}
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';
export default BottomNav;

