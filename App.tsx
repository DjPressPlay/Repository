
import React, { useState, useEffect } from 'react';
import { QuizFlow } from './components/QuizFlow';
import { BlueprintResult } from './components/BlueprintResult';
import { BlueprintData, WalkthroughStep } from './types';
import { Button } from './components/Button';
import { ZetsuLogo } from './components/ZetsuLogo';
import { ImageCarousel } from './components/ImageCarousel';
import { telemetry } from './services/telemetryService';
import { Walkthrough } from './components/Walkthrough';

type ViewState = 'intro' | 'quiz' | 'result';

const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 'intro-welcome',
    targetView: 'intro',
    title: 'Welcome, Architect.',
    content: "I am the System Guide. I'll help you condense your vision into a structural reality blueprint.",
    position: 'top-right'
  },
  {
    id: 'intro-gallery',
    targetView: 'intro',
    title: 'Visual Archetypes',
    content: "Our Gallery of Possibilities showcases the range of constructs we can render. Each vector represents a distinct structural form.",
    position: 'center'
  },
  {
    id: 'intro-how',
    targetView: 'intro',
    title: 'Crystallization',
    content: "We will extract 8 core vectors from your idea. These define why it matters and how it functions.",
    position: 'top-right'
  },
  {
    id: 'step-name',
    targetView: 'quiz',
    stepIndex: 0,
    title: 'The Blueprint Begins',
    content: "Give your vision a name—this anchors your idea in reality.",
    position: 'top-right'
  },
  {
    id: 'step-type',
    targetView: 'quiz',
    stepIndex: 1,
    title: 'The Category',
    content: "Is it a tool, service, or experience? Defining the 'What' focuses the AI's rendering engine.",
    position: 'top-right'
  },
  {
    id: 'step-audience',
    targetView: 'quiz',
    stepIndex: 2,
    title: 'Target Resonance',
    content: "Who is this for? Specificity improves precision. Who will feel this solution most?",
    position: 'top-right'
  },
  {
    id: 'step-action',
    targetView: 'quiz',
    stepIndex: 3,
    title: 'The Power Verb',
    content: "What is the single most important action this performs? Focus on the core utility.",
    position: 'top-right'
  },
  {
    id: 'step-outcome',
    targetView: 'quiz',
    stepIndex: 4,
    title: 'The Emotional Shift',
    content: "How does the user feel after using it? Empowered? Magical? Safe?",
    position: 'top-right'
  },
  {
    id: 'step-competition',
    targetView: 'quiz',
    stepIndex: 5,
    title: 'The Displacement',
    content: "What does this replace? Identifying current habits clarifies your unique value.",
    position: 'top-right'
  },
  {
    id: 'step-form',
    targetView: 'quiz',
    stepIndex: 6,
    title: 'The Final Frame',
    content: "Physical? Digital? Hardware? This determines the structural output.",
    position: 'top-right'
  },
  {
    id: 'step-reason',
    targetView: 'quiz',
    stepIndex: 7,
    title: 'The Unfair Advantage',
    content: "Why is this better than anything else? Make your core differentiator undeniable.",
    position: 'top-right'
  },
  {
    id: 'result-congrats',
    targetView: 'result',
    title: 'Blueprint Crystallized!',
    content: "Congratulations, Architect. Your vision is now a structural reality. You can now transmit the archive via email or share it with the ZetsuEDU community.",
    position: 'top-right'
  }
];

function App() {
  const [view, setView] = useState<ViewState>('intro');
  const [blueprintData, setBlueprintData] = useState<BlueprintData | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [showAbandonModal, setShowAbandonModal] = useState(false);
  
  // Walkthrough State
  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [currentWalkthroughIndex, setCurrentWalkthroughIndex] = useState(0);
  const [quizStepIndex, setQuizStepIndex] = useState(0);

  useEffect(() => {
    telemetry.init();
    const hasSeen = localStorage.getItem('zetsu_walkthrough_completed');
    if (!hasSeen) {
      setTimeout(() => {
        setWalkthroughActive(true);
        setCurrentWalkthroughIndex(0);
      }, 1000);
    }
  }, []);

  // Browser-level exit prevention
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (view === 'quiz') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [view]);

  const startQuiz = () => {
    telemetry.logEvent('quiz_started');
    setView('quiz');
    // Skip intro steps if walkthrough is active and we are just starting
    if (walkthroughActive && currentWalkthroughIndex < 3) {
      setCurrentWalkthroughIndex(3);
    }
  };

  const handleQuizComplete = (data: BlueprintData) => {
    telemetry.logEvent('quiz_completed', { idea_name: data.name, idea_type: data.type });
    setBlueprintData(data);
    setView('result');
    
    // If walkthrough is active, move it to the final result step
    if (walkthroughActive) {
      const resultStepIndex = WALKTHROUGH_STEPS.findIndex(s => s.targetView === 'result');
      if (resultStepIndex !== -1) {
        setCurrentWalkthroughIndex(resultStepIndex);
      }
    }
  };

  const resetApp = () => {
    // ABANDON PREVENTION: If in quiz, show popup instead of resetting
    if (view === 'quiz') {
      setShowAbandonModal(true);
      return;
    }

    telemetry.logEvent('app_reset', { previous_view: view });
    setBlueprintData(null);
    setView('intro');
    setShowDemo(false);
    setQuizStepIndex(0);
    setWalkthroughActive(false);
    setShowAbandonModal(false);
  };

  const forceReset = () => {
    setBlueprintData(null);
    setView('intro');
    setQuizStepIndex(0);
    setShowAbandonModal(false);
    telemetry.logEvent('quiz_abandoned');
  };

  const startGuidedTour = () => {
    telemetry.logEvent('walkthrough_started');
    if (view !== 'intro') setView('intro');
    setCurrentWalkthroughIndex(0);
    setWalkthroughActive(true);
  };

  const handleWalkthroughNext = () => {
    const nextIndex = currentWalkthroughIndex + 1;
    if (nextIndex < WALKTHROUGH_STEPS.length) {
      const nextStep = WALKTHROUGH_STEPS[nextIndex];
      
      // If we are transitioning from Intro to Quiz via walkthrough
      if (nextStep.targetView === 'quiz' && view === 'intro') {
        startQuiz();
      }
      
      setCurrentWalkthroughIndex(nextIndex);
    } else {
      localStorage.setItem('zetsu_walkthrough_completed', 'true');
      setWalkthroughActive(false);
    }
  };

  const handleWalkthroughBack = () => {
    if (currentWalkthroughIndex > 0) {
      const prevStep = WALKTHROUGH_STEPS[currentWalkthroughIndex - 1];
      if (prevStep.targetView === 'intro' && view === 'quiz') {
        setView('intro');
      }
      setCurrentWalkthroughIndex(currentWalkthroughIndex - 1);
    }
  };

  const handleWalkthroughSkip = () => {
    localStorage.setItem('zetsu_walkthrough_completed', 'true');
    setWalkthroughActive(false);
    telemetry.logEvent('walkthrough_skipped');
  };

  const activeWalkthroughStep = WALKTHROUGH_STEPS[currentWalkthroughIndex];
  
  // Refined visibility logic to handle Intro, Quiz steps, and Result view
  const shouldShowWalkthrough = walkthroughActive && (
    (activeWalkthroughStep.targetView === view) && 
    (view === 'intro' || view === 'result' || activeWalkthroughStep.stepIndex === quizStepIndex)
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-blue-500/30">
      
      {/* Abandonment Modal */}
      {showAbandonModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-900 border border-blue-500/30 rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-12 -mt-12 blur-2xl"></div>
            <h3 className="text-2xl font-black text-white mb-4">Wait, Architect.</h3>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Don't leave yet. Turning your idea into a tangible reality blueprint only takes a few minutes. Stay to crystallize your vision.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => setShowAbandonModal(false)} className="w-full py-4 text-sm font-bold shadow-blue-500/20">
                Continue Building
              </Button>
              <button 
                onClick={forceReset}
                className="text-xs font-mono text-slate-500 hover:text-white transition-colors uppercase py-3 tracking-widest"
              >
                Exit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {shouldShowWalkthrough && (
        <Walkthrough 
          currentStep={activeWalkthroughStep}
          onNext={handleWalkthroughNext}
          onBack={handleWalkthroughBack}
          onSkip={handleWalkthroughSkip}
          isFirst={currentWalkthroughIndex === 0}
          isLast={currentWalkthroughIndex === WALKTHROUGH_STEPS.length - 1}
        />
      )}

      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetApp}>
            <ZetsuLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white leading-none group-hover:text-blue-200 transition-colors">
                ZETSU <span className="text-blue-400">EDU</span>
              </span>
              <span className="text-[0.5rem] tracking-[0.2em] text-blue-200/70 font-mono uppercase text-nowrap">THE END OF EVERYTHING</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={startGuidedTour} className="text-xs font-mono text-blue-400 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/5 border border-blue-500/20 hover:border-blue-500/40">
              Guide
            </button>
            <a href="https://www.skool.com/zetsuedu-7521/about?ref=abd252c4dda14e3d897063114f09cf4b" target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-sm font-mono text-blue-200 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10">
              <span>Join Community</span>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-32 pb-24 relative z-10 w-full max-w-7xl mx-auto">
        {view === 'intro' && (
          <div className="w-full max-w-6xl mx-auto text-center animate-fadeIn px-4 relative">
            {showDemo && (
              <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-slide-in overflow-y-auto">
                <div className="w-full max-w-6xl my-auto">
                  <BlueprintResult 
                    data={{ name: "Example Project", type: "service", audience: "creative teams", core_action: "visualize data", outcome: "clarity", replaces: "manual sheets", form: "dashboard", reason: "uses neural logic" }} 
                    isDemo={true}
                    demoImage="https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&q=80&w=1000"
                    onCloseDemo={() => setShowDemo(false)}
                  />
                </div>
              </div>
            )}

            <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-blue-900/20 border border-blue-500/20 rounded-full backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
              <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">IDEA 2 REALITY SYSTEM ONLINE</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-300 mb-8 drop-shadow-lg leading-tight">
              Visualize your<br/>dream product.
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              Turn your raw thought into a tangible artifact. 
              Answer 8 questions to crystalize your concept and let AI render the possibility.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
              <Button onClick={startQuiz} className="w-full sm:w-auto text-lg px-12 py-5 shadow-blue-500/20">
                Initialize Blueprint
              </Button>
              <Button onClick={() => setShowDemo(true)} variant="ghost" className="w-full sm:w-auto text-lg px-8 py-5 border border-white/10 hover:bg-white/5">
                View Manual
              </Button>
            </div>

            <div className="mb-24">
              <div className="mb-10 flex flex-col items-center">
                 <h2 className="text-sm font-mono tracking-[0.5em] text-blue-400 uppercase mb-4">Gallery of Possibilities</h2>
                 <div className="w-24 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
              </div>
              <ImageCarousel id="walkthrough-gallery" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto px-4">
              {[
                { num: '01', title: 'Define', desc: 'Guided linear structure forces clear articulation.' },
                { num: '02', title: 'Crystallize', desc: 'Compiles scattered thoughts into a manifesto.' },
                { num: '03', title: 'Visualize', desc: 'Generates a high-fidelity render of the future.' }
              ].map((stage, i) => (
                <div key={i} className="group relative bg-[#130d2b]/80 border border-white/5 p-12 rounded-[2.5rem] text-left hover:bg-[#1a123a] hover:border-blue-500/30 transition-all duration-500 backdrop-blur-md shadow-2xl">
                  <div className="text-6xl font-black text-white/10 mb-8 group-hover:text-blue-500/10 transition-colors duration-500 font-mono tracking-tighter">{stage.num}</div>
                  <h3 className="text-3xl font-black text-white mb-4 group-hover:text-blue-300 transition-colors tracking-tight">{stage.title}</h3>
                  <p className="text-slate-400 leading-relaxed text-sm md:text-base font-light">{stage.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <QuizFlow 
            onComplete={handleQuizComplete} 
            onStepChange={(index) => {
              setQuizStepIndex(index);
              if (walkthroughActive) {
                const tourStepIdx = WALKTHROUGH_STEPS.findIndex(s => s.targetView === 'quiz' && s.stepIndex === index);
                if (tourStepIdx !== -1) setCurrentWalkthroughIndex(tourStepIdx);
              }
            }}
          />
        )}

        {view === 'result' && blueprintData && (
          <BlueprintResult data={blueprintData} onReset={resetApp} />
        )}
      </main>

      <footer className="w-full border-t border-white/5 bg-slate-950/95 backdrop-blur-3xl relative z-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
           <div className="mb-10 flex flex-col items-center">
              <ZetsuLogo className="w-16 h-16 mb-6" />
              <div className="flex flex-col items-center">
                <span className="font-black text-3xl tracking-tighter text-white leading-none">ZETSU <span className="text-blue-500">EDU</span></span>
                <span className="text-[0.7rem] font-black tracking-[0.4em] text-yellow-500 uppercase mt-3">ZETSUMETSU</span>
                <span className="text-[0.55rem] tracking-[0.25em] text-blue-300/60 font-mono uppercase mt-1">THE END OF EVERYTHING</span>
              </div>
           </div>
           <div className="space-y-6 max-w-4xl flex flex-col items-center">
              <a href="https://blueprint-interface-811960511912.us-west1.run.app" target="_blank" rel="noopener noreferrer" className="mb-8">
                <Button variant="secondary" className="border-blue-500/30 text-blue-300 hover:bg-blue-500/10 uppercase tracking-[0.2em] text-xs py-4 px-10 rounded-xl">Blueprint Interface</Button>
              </a>
              <p className="text-xs md:text-sm font-black text-slate-300 tracking-[0.2em] uppercase">© 2026 ZETSUMETSU CORPORATION™</p>
              <p className="text-[10px] md:text-xs font-mono text-slate-500 tracking-widest uppercase max-w-3xl leading-relaxed">ALL SYSTEMS, PRODUCTS, AND MATERIALS ARE THE PROPERTY OF ZETSUMETSU CORPORATION & GOOGLE GEMINI.</p>
              <div className="pt-10 mt-10 border-t border-white/5 w-full">
                <p className="text-[9px] md:text-[10px] font-mono text-slate-600 tracking-[0.2em]">Zetsumetsu EOe™ | Idea 2 Reality™ | © 2024 - 2026 Zetsumetsu Corporation™</p>
              </div>
           </div>
        </div>
      </footer>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>
    </div>
  );
}

export default App;
