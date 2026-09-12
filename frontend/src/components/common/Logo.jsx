import React from 'react';

export const Logo = ({ className = "h-8", textClassName = "text-xl font-bold text-turf-text" }) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-turf-primary flex items-center justify-center text-white font-extrabold text-lg">
        U
      </div>
      <span className={textClassName}>
        placeholder <span className="text-xs font-semibold px-2 py-0.5 bg-turf-surface text-turf-primary rounded-lg border border-turf-border">Prototype</span>
      </span>
    </div>
  );
};

export default Logo;
