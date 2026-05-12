import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiArrowRight } from 'react-icons/hi';
import { FiCheckCircle, FiClock, FiTruck, FiBox } from 'react-icons/fi';
import { themeColors, getColorWithOpacity } from '../../../../../theme';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HeroBanner = ({ onSearchClick, heroData, toAssetUrl }) => {
  const title = heroData?.title || "YOUR SOLUTION, ONE TAP AWAY!";
  const subtitle = heroData?.subtitle || "Seamless, Fast & Reliable Services at Your Fingertips";
  const heroImage = toAssetUrl(heroData?.imageUrl) || 'https://cdni.iconscout.com/illustration/premium/thumb/home-repair-service-illustration-download-in-svg-png-gif-file-formats--renovation-handyman-pack-services-illustrations-4712431.png';
  const buttonText = heroData?.primaryBtnText || 'Explore';

  return (
    <div className="relative w-full bg-[#0F4A44] pt-4 pb-16 rounded-b-[40px] overflow-hidden">
      {/* Search Bar Section */}
      <div className="px-6 mb-8">
        <div 
          onClick={onSearchClick}
          className="w-full h-14 bg-white rounded-2xl flex items-center px-4 gap-3 cursor-pointer shadow-lg shadow-black/10"
        >
          <HiOutlineSearch className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400 font-medium">Search for a service..</span>
        </div>
      </div>

      <div className="px-5 sm:px-8 flex items-center justify-between gap-2 sm:gap-6 min-h-[160px]">
        {/* Left Side: Content */}
        <div className="flex-[2] sm:flex-1">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[20px] sm:text-3xl md:text-4xl font-black text-white leading-tight mb-2 sm:mb-3 tracking-tight"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[9px] sm:text-xs text-white/60 font-medium leading-relaxed mb-4 sm:mb-6 line-clamp-3 sm:line-clamp-none"
          >
            {subtitle}
          </motion.p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onSearchClick}
            className="px-5 sm:px-8 py-2 sm:py-2.5 bg-white text-[#0F4A44] rounded-xl font-black text-[11px] sm:text-sm shadow-xl"
          >
            {buttonText}
          </motion.button>
        </div>

        {/* Right Side: Illustration */}
        <div className="flex-1 flex justify-end items-center min-w-[120px] sm:min-w-[180px]">
          <motion.img 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            src={heroImage} 
            alt="Hero" 
            className="w-full h-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] object-contain max-h-[140px] sm:max-h-[220px]"
            onError={(e) => {
              e.target.src = 'https://cdni.iconscout.com/illustration/premium/thumb/home-repair-service-illustration-download-in-svg-png-gif-file-formats--renovation-handyman-pack-services-illustrations-4712431.png';
            }}
          />
        </div>
      </div>

      {/* Decorative Blur */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};

export default HeroBanner;

