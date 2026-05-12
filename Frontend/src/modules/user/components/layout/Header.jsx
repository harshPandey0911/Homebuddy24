import React, { useRef, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiLocationMarker, HiOutlineSearch, HiOutlineShoppingCart, HiOutlineUser } from 'react-icons/hi';
import { gsap } from 'gsap';
import LocationSelector from '../common/LocationSelector';
import { animateLogo } from '../../../../utils/gsapAnimations';
import Logo from '../../../../components/common/Logo';
import { themeColors, getColorWithOpacity } from '../../../../theme';
import { useCart } from '../../../../context/CartContext';
import { useAuth } from '../../../../context/AuthContext';
import { motion } from 'framer-motion';

const Header = ({ location: address, onLocationClick, user, toAssetUrl, title }) => {
  const getUrl = (url) => {
    if (!url) return null;
    if (toAssetUrl) return toAssetUrl(url);
    if (url.startsWith('http')) return url;
    const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api$/, '');
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const userPhoto = user?.photo ? getUrl(user.photo) : null;

  return (
    <header className="w-full px-4 sm:px-6 pt-6 pb-2">
      <div className="flex items-center justify-between">
        {/* Left: Location or Title */}
        {title ? (
          <div className="flex flex-col">
            <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">{title}</h1>
            <div className="w-8 h-1 bg-white/20 rounded-full mt-1"></div>
          </div>
        ) : (
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            onClick={onLocationClick}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-[14px] sm:rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 group-hover:bg-white/20 transition-all">
              <HiLocationMarker className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest">Your Location</span>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="text-[12px] sm:text-[14px] font-black text-white truncate max-w-[80px] sm:max-w-none">
                  {address && address !== 'Select Location' ? address.split(',')[0] : 'Location'}
                </span>
                <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/10 hover:bg-white/20 transition-all relative">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0F4A44]"></span>
          </button>

          {/* Profile Picture */}
          <Link to="/user/account" className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white/20 hover:border-white transition-all bg-white/10">
            {userPhoto ? (
              <img src={userPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">
                <HiOutlineUser className="w-5 h-5" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

