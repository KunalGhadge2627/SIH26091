import React, { useEffect, useState } from 'react';

export const ScoreBar = ({ label, score = 0, max = 100, color = "bg-turf-primary" }) => {
  const [widthPct, setWidthPct] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const pct = Math.min(100, Math.max(0, (score / max) * 100));
      setWidthPct(pct);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, max]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-turf-text">{label}</span>
        <span className="stat-number text-turf-text">{score}/{max}</span>
      </div>
      <div className="h-2 w-full bg-turf-border rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
};

export default ScoreBar;
