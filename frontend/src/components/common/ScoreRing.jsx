import React, { useEffect, useState } from 'react';

export const ScoreRing = ({ score = 75, size = 120, strokeWidth = 10, label = "Feasibility", subtitle = "" }) => {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setCurrentScore(score), 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  let colorClass = "text-turf-primary stroke-turf-primary";
  if (score < 40) colorClass = "text-amber-600 stroke-amber-600";
  else if (score < 60) colorClass = "text-turf-primary-light stroke-turf-primary-light";

  return (
    <div className="flex flex-col items-center justify-center relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-turf-border fill-none"
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
        <span className="text-2xl stat-number text-turf-text">{currentScore}</span>
        {label && <span className="text-[10px] font-medium text-turf-text-muted mt-0.5">{label}</span>}
      </div>
    </div>
  );
};

export default ScoreRing;
