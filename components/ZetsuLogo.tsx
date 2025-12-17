import React from 'react';

export const ZetsuLogo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Glow effect */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <g filter="url(#glow)">
      {/* Document Frame */}
      <rect x="25" y="15" width="50" height="60" rx="2" stroke="url(#logoGradient)" strokeWidth="4" fill="none" />
      <rect x="30" y="20" width="40" height="50" stroke="url(#logoGradient)" strokeWidth="2" strokeOpacity="0.5" fill="none" />
      
      {/* Document Lines */}
      <line x1="35" y1="35" x2="65" y2="35" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="45" x2="55" y2="45" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      <line x1="35" y1="55" x2="60" y2="55" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      
      {/* Open Book Base */}
      <path d="M15 80 C 15 80, 45 80, 50 85 C 55 80, 85 80, 85 80" stroke="url(#logoGradient)" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M15 80 L 15 70" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      <path d="M85 80 L 85 70" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
      <path d="M50 85 L 50 75" stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" />
    </g>
  </svg>
);