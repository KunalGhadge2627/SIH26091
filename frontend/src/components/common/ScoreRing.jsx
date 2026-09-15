import React, { useEffect, useState } from 'react';

export const ScoreRing = ({ score = 75, size = 120, strokeWidth = 10, label = "FEASIBILITY", subtitle = "" }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  let colorClass = "text-emerald-500 stroke-emerald-500";
  if (score < 36) colorClass = "text-red-500 stroke-red-500";
  else if (score < 51) colorClass = "text-orange-500 stroke-orange-500";
  else if (score < 66) colorClass = "text-amber-500 stroke-amber-500";
  else if (score < 81) colorClass = "text-primary-600 stroke-primary-600";

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-100 fill-none"
        />
        {/* Animated fill ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`fill-none transition-all duration-1000 ease-out ${colorClass}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-2xl font-black text-gray-900 tracking-tight">{currentScore}</span>
        {label && <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>}
      </div>
    </div>
  );
};

export default ScoreRing;
