import React, { forwardRef } from 'react';

/**
 * Centralized Logo Component
 * Usage: <Logo className="h-8 w-auto" />
 * Supports ref for animations
 */
const Logo = forwardRef(({ className = "h-10 w-10", variant = "light", ...props }, ref) => {
  const isDark = variant === "dark";
  
  return (
    <div
      ref={ref}
      className={`${className} flex items-center justify-center rounded-2xl shadow-sm border ${
        isDark 
          ? 'bg-white/10 border-white/20' 
          : 'bg-[#0F4A44] border-[#0F4A44]/10'
      } overflow-hidden active:scale-95 transition-all`}
      {...props}
    >
      <span className={`text-[12px] font-black tracking-tighter ${
        isDark ? 'text-white' : 'text-white'
      }`}>
        HB24
      </span>
    </div>
  );
});

Logo.displayName = 'Logo';

export default Logo;
