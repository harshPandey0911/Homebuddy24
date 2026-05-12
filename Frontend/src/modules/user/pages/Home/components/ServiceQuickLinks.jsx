import React from 'react';
import { motion } from 'framer-motion';
import { HiArrowRight } from 'react-icons/hi';
import { 
  FiZap, 
  FiDroplet, 
  FiTool, 
  FiWind, 
  FiShield, 
  FiScissors, 
  FiCoffee, 
  FiTruck, 
  FiLayout, 
  FiHome,
  FiBox,
  FiActivity,
  FiCheckCircle,
  FiSettings,
  FiZapOff
} from 'react-icons/fi';

const CategoryImage = ({ icon, title = '' }) => {
  const [error, setError] = React.useState(false);

  const getIconForTitle = (title) => {
    const t = title.toLowerCase();
    if (t.includes('ac')) return <FiWind />;
    if (t.includes('clean')) return <FiDroplet />;
    if (t.includes('repair') || t.includes('fix')) return <FiTool />;
    if (t.includes('electric') || t.includes('wire')) return <FiZap />;
    if (t.includes('plumb')) return <FiDroplet />;
    if (t.includes('pest')) return <FiShield />;
    if (t.includes('salon') || t.includes('beauty')) return <FiScissors />;
    if (t.includes('paint')) return <FiLayout />;
    if (t.includes('pack') || t.includes('move')) return <FiBox />;
    return <FiZap />; // Default
  };

  if (!icon || error) {
    return (
      <div className="text-xl text-[#0F4A44] transition-all animate-fade-in">
        {getIconForTitle(title)}
      </div>
    );
  }

  return (
    <img
      src={icon}
      alt={title}
      className="w-full h-full object-contain transition-all animate-fade-in"
      onError={() => setError(true)}
    />
  );
};
import Logo from '../../../../../components/common/Logo';

const ServiceQuickLinks = ({ categories = [], onCategoryClick }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full px-6 mt-10 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-black text-gray-900 tracking-tight">
          Service Categories
        </h2>
        <button className="text-xs font-bold text-gray-400 flex items-center gap-1">
          View all <HiArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.slice(0, 4).map((category, index) => (
          <motion.div
            key={category.id || index}
            whileTap={{ scale: 0.98 }}
            onClick={() => onCategoryClick?.(category)}
            className="flex items-center gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-2xl p-2 group-hover:bg-[#0F4A44]/5 transition-colors">
              <CategoryImage icon={category.icon} title={category.title} />
            </div>
            <span className="flex-1 text-[13px] font-black text-gray-900 leading-tight">
              {category.title}
            </span>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0F4A44] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServiceQuickLinks;
