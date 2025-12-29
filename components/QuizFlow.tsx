import React, { useState, useEffect, useRef } from 'react';
import { BlueprintData, StepDef } from '../types';
import { Button } from './Button';
import { ZetsuLogo } from './ZetsuLogo';

const STEPS: StepDef[] = [
  { id: 1, field: 'name', title: 'The Object', instruction: 'What is your idea?', placeholder: 'e.g., DreamCatcher', example: 'Name it.' },
  { id: 2, field: 'type', title: 'The Type', instruction: 'What type of thing will it be?', placeholder: 'e.g., tool, game, system, service', example: 'Is it an app? A device?' },
  { id: 3, field: 'audience', title: 'Target Users', instruction: 'Who is this for?', placeholder: 'e.g., exhausted parents, indie developers', example: 'Who will use it?' },
  { id: 4, field: 'core_action', title: 'The Core Action', instruction: 'What will it do?', placeholder: 'e.g., automate grocery lists', example: 'The main verb.' },
  { id: 5, field: 'outcome', title: 'The Outcome', instruction: 'What feeling does using it bring?', placeholder: 'e.g., a stress-free, fun,', example: 'The result they get.' },
  { id: 6, field: 'replaces', title: 'Future Competition', instruction: 'What is it similar to that is already out?', placeholder: 'e.g., sticky notes, hiring a distinct assistant', example: 'What does it replace?' },
  { id: 7, field: 'form', title: 'The Frame', instruction: 'What will it be once its done?', placeholder: 'e.g., mobile app, browser extension', example: 'Delivery mechanism.' },
  { id: 8, field: 'reason', title: 'Reason Why', instruction: 'Why is it better than what we have?', placeholder: 'e.g., it uses AI to predict needs', example: 'The differentiator.' },
];

interface QuizFlowProps {
  onComplete: (data: BlueprintData) => void;
}

const Flare: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
    <div className="relative w-full h-full max-w-lg max-h-lg flex items-center justify-center">
      {/* Central Flash */}
      <div className="absolute w-20 h-20 bg-blue-400 rounded-full blur-xl animate-burst opacity-0"></div>
      <div className="absolute w-16 h-16 bg-white rounded-full blur-md animate-burst opacity-0" style={{ animationDelay: '0.05s' }}></div>
      
      {/* Expanding Ring */}
      <div className="absolute w-32 h-32 border-2 border-blue-200 rounded-full opacity-0 animate-[burst_0.6s_ease-out_forwards] blur-[1px]"></div>
      
      {/* Particles */}
      {[...Array(6)].map((_, i) => (
        <div 
          key={i} 
          className="absolute w-2 h-8 bg-idea-400 rounded-full opacity-0 animate-[burst_0.6s_ease-out_forwards]"
          style={{ 
            transform: `rotate(${i * 60}deg) translateY(-40px)`,
            animationDelay: '0.1s' 
          }} 
        />
      ))}
      
      {/* Checkpoint Text */}
      <div className="absolute mt-32 text-blue-200 text-xs font-mono tracking-[0.3em] uppercase opacity-0 animate-[slideIn_0.4s_ease-out_reverse_forwards]">
        Data Uplink Established
      </div>
    </div>
  </div>
);

export const QuizFlow: React.FC<QuizFlowProps> = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<Partial<BlueprintData>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlare, setShowFlare] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const currentStep = STEPS[currentStepIndex];
  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;

  useEffect(() => {
    // Focus input on step change after transition
    if (!isTransitioning && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentStepIndex, isTransitioning]);

  useEffect(() => {
    // Set input value if we're going back/forward
    setInputValue(data[currentStep.field] || '');
  }, [currentStepIndex, currentStep.field, data]);

  const handleNext = () => {
    if (!inputValue.trim() || isTransitioning) return;

    // 1. Trigger Exit Animation & Flare
    setIsTransitioning(true);
    setShowFlare(true);

    // 2. Save Data
    const newData = { ...data, [currentStep.field]: inputValue };
    setData(newData);

    // 3. Wait for visual effect, then advance
    setTimeout(() => {
      setShowFlare(false);
      
      if (currentStepIndex < STEPS.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
        setIsTransitioning(false);
      } else {
        onComplete(newData as BlueprintData);
      }
    }, 500); // Duration matches animation/flare timing
  };

  const handleBack = () => {
    if (currentStepIndex > 0 && !isTransitioning) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      handleNext();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-12 min-h-[60vh] flex flex-col justify-center relative">
      
      {/* Visual Flare Feedback */}
      {showFlare && <Flare />}

      {/* Small Logo Top Right */}
      <div className="absolute top-0 right-0 p-2 md:p-0 md:-mt-8 opacity-40 hover:opacity-100 transition-opacity duration-500 z-10">
        <ZetsuLogo className="w-8 h-8 md:w-10 md:h-10" />
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/50 h-1 mb-12 rounded-full overflow-hidden backdrop-blur-sm relative">
        <div 
          className={`h-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.8)] relative ${showFlare ? 'bg-white' : 'bg-blue-500'}`}
          style={{ width: `${progress}%` }}
        >
          {/* Leading glow on progress bar */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent opacity-50"></div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-2 text-blue-400 text-sm font-mono tracking-widest uppercase flex items-center gap-2">
          <span>Step {currentStep.id}</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-400">{STEPS.length}</span>
        </div>
        
        {/* Animated Container */}
        <div key={currentStepIndex} className={`${isTransitioning ? 'animate-slide-out' : 'animate-slide-in'}`}>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-8 leading-tight">
            {currentStep.instruction}
          </h2>

          <div className="relative group">
            <input
              ref={inputRef}
              type="text"
              className="w-full bg-transparent border-b-2 border-slate-700 text-2xl md:text-3xl py-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors duration-300 font-light"
              placeholder={currentStep.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              disabled={isTransitioning}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-focus-within:opacity-100 transition-opacity text-xs text-slate-500 font-mono hidden md:block">
              Press Enter ↵
            </div>
          </div>
          
          <p className="mt-4 text-slate-500 text-sm">{currentStep.example}</p>
        </div>
      </div>

      <div className="mt-12 flex justify-between items-center z-10">
        <Button 
          variant="ghost" 
          onClick={handleBack} 
          disabled={currentStepIndex === 0 || isTransitioning}
          className={`${currentStepIndex === 0 ? 'opacity-0' : ''} transition-opacity duration-300`}
        >
          Back
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!inputValue.trim() || isTransitioning}
          className="min-w-[140px]"
        >
          {isTransitioning ? (
            <span className="animate-pulse text-white">Saving...</span>
          ) : (
            currentStepIndex === STEPS.length - 1 ? 'Generate Blueprint' : 'Next Step'
          )}
        </Button>
      </div>
    </div>
  );
};