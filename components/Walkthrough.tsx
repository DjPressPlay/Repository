
import React from 'react';
import { WalkthroughStep } from '../types';
import { Button } from './Button';

interface WalkthroughProps {
  currentStep: WalkthroughStep;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({
  currentStep,
  onNext,
  onBack,
  onSkip,
  isFirst,
  isLast
}) => {
  const positionClasses = {
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'bottom-right': 'bottom-12 right-12',
    'top-left': 'top-24 left-12',
    'top-right': 'top-24 right-6',
    'input-near': 'top-24 right-6 md:right-12' // Re-anchored to top-right below header
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Dim Overlay only for Center Steps */}
      {currentStep.position === 'center' && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm pointer-events-auto animate-fadeIn"></div>
      )}

      {/* The Pop-up */}
      <div 
        className={`absolute ${positionClasses[currentStep.position] || positionClasses['top-right']} w-full max-w-[320px] pointer-events-auto animate-slide-in`}
      >
        <div className="relative bg-slate-900/90 backdrop-blur-2xl border border-white/10 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(59,130,246,0.1)] overflow-hidden">
          
          {/* Animated Glow Border */}
          <div className="absolute inset-0 border border-blue-500/20 rounded-3xl pointer-events-none animate-pulse"></div>

          {/* Assistant Orb Icon */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-400 to-idea-400 shadow-[0_0_15px_rgba(96,165,250,0.5)] animate-pulse"></div>
            <span className="text-[9px] font-mono tracking-widest text-blue-400 uppercase font-bold">Architect Guide</span>
          </div>

          <h4 className="text-white font-bold text-base mb-1.5">{currentStep.title}</h4>
          <p className="text-slate-300 text-xs leading-relaxed mb-5">
            {currentStep.content}
          </p>

          <div className="flex items-center justify-between gap-4">
            <button 
              onClick={onSkip}
              className="text-[9px] font-mono uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              Skip
            </button>
            
            <div className="flex items-center gap-2">
              {!isFirst && (
                <button 
                  onClick={onBack}
                  className="p-1.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <Button 
                onClick={onNext}
                variant="primary"
                className="px-4 py-1.5 text-[10px] h-8 min-w-[70px] rounded-xl"
              >
                {isLast ? 'Begin' : 'Next'}
              </Button>
            </div>
          </div>

          {/* Corner Decals */}
          <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-blue-500/10 rounded-tr-3xl"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-blue-500/10 rounded-bl-3xl"></div>
        </div>
      </div>
    </div>
  );
};
