import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiGift, FiShoppingCart, FiUser, FiTrash2, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import { HiHome, HiGift, HiShoppingCart, HiUser, HiTrash, HiCalendar } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../../../context/CartContext';

// Colorful theme for each nav item
const navItemColors = {
  home: {
    primary: '#3B82F6', // Blue
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    bg: 'rgba(59, 130, 246, 0.1)',
    shadow: 'rgba(59, 130, 246, 0.4)'
  },
  bookings: {
    primary: '#10B981', // Emerald
    gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    bg: 'rgba(16, 185, 129, 0.1)',
    shadow: 'rgba(16, 185, 129, 0.4)'
  },
  scrap: {
    primary: '#A855F7', // Purple
    gradient: 'linear-gradient(135deg, #A855F7 0%, #7C3AED 100%)',
    bg: 'rgba(168, 85, 247, 0.1)',
    shadow: 'rgba(168, 85, 247, 0.4)'
  },
  cart: {
    primary: '#EC4899', // Pink
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    bg: 'rgba(236, 72, 153, 0.1)',
    shadow: 'rgba(236, 72, 153, 0.4)'
  },
  account: {
    primary: '#8B5CF6', // Violet
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
    bg: 'rgba(139, 92, 246, 0.1)',
    shadow: 'rgba(139, 92, 246, 0.4)'
  }
};

const BottomNav = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const { cartCount } = useCart();
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  const navItems = useMemo(() => [
    { id: 'home', label: 'Home', icon: FiHome, filledIcon: HiHome, path: '/user' },
    { id: 'bookings', label: 'Bookings', icon: FiCalendar, filledIcon: HiCalendar, path: '/user/my-bookings' },
    { id: 'cart', label: 'Cart', icon: FiShoppingCart, filledIcon: HiShoppingCart, path: '/user/cart', isCart: true },
    { id: 'account', label: 'Account', icon: FiUser, filledIcon: HiUser, path: '/user/account' },
  ], []);

  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/user' || path === '/user/' || path.startsWith('/user/category/')) return 'home';
    if (path.startsWith('/user/my-bookings')) return 'bookings';
    if (path.startsWith('/user/cart')) return 'cart';
    if (path.startsWith('/user/account') || path.startsWith('/user/profile')) return 'account';
    return 'home';
  };

  const activeTab = getActiveTab();
  const activeIndex = navItems.findIndex(item => item.id === activeTab);
  const activeColor = {
    primary: '#0F4A44', // Dark Teal from screenshot
    text: '#FFFFFF',
  };

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <nav
      className="fixed bottom-6 left-0 right-0 z-40 w-full lg:hidden px-6"
      style={{
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div
        className="max-w-md mx-auto py-3 px-4 rounded-[32px]"
        style={{
          background: '#FFFFFF',
          boxShadow: '0 15px 40px rgba(0, 0, 0, 0.12)',
          border: '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        <div ref={navRef} className="flex items-center justify-between max-w-md mx-auto relative px-2">
          {navItems.map((item) => {
            const IconComponent = activeTab === item.id ? item.filledIcon : item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.path)}
                className={`flex items-center justify-center transition-all duration-300 relative ${isActive ? 'px-5 py-2.5 rounded-full bg-[#0F4A44] text-white' : 'p-2 text-gray-400'}`}
              >
                <div className="flex items-center gap-2">
                  <IconComponent
                    className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-900 opacity-70'}`}
                  />
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      className="text-[14px] font-bold whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </div>
                
                {item.isCart && !isActive && cartCount > 0 && (
                  <span
                    className="absolute top-1 right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-white"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
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
