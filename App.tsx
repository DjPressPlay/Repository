import React, { useState } from 'react';
import { QuizFlow } from './components/QuizFlow';
import { BlueprintResult } from './components/BlueprintResult';
import { BlueprintData } from './types';
import { Button } from './components/Button';
import { ZetsuLogo } from './components/ZetsuLogo';

type ViewState = 'intro' | 'quiz' | 'result';

function App() {
  const [view, setView] = useState<ViewState>('intro');
  const [blueprintData, setBlueprintData] = useState<BlueprintData | null>(null);
  const [showDemo, setShowDemo] = useState(false);

  const startQuiz = () => setView('quiz');

  const handleQuizComplete = (data: BlueprintData) => {
    setBlueprintData(data);
    setView('result');
  };

  const resetApp = () => {
    setBlueprintData(null);
    setView('intro');
    setShowDemo(false);
  };

  const openDemo = () => {
      setShowDemo(true);
  }

  const closeDemo = () => {
      setShowDemo(false);
  }

  const demoData: BlueprintData = {
      name: "Cat AI",
      type: "service",
      audience: "cat people",
      core_action: "find cats",
      outcome: "locator",
      replaces: "cat chip",
      form: "app",
      reason: "has ai"
  };
  
  // Smartphone with holographic map interface to represent "Locator App"
  const demoImage = "https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&q=80&w=1000";

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden selection:bg-blue-500/30">
      {/* Header/Nav */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-white/5 bg-slate-950/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          
          {/* Logo / Home */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={resetApp}>
            <ZetsuLogo className="w-10 h-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tighter text-white leading-none group-hover:text-blue-200 transition-colors">
                ZETSU <span className="text-blue-400">EDU</span>
              </span>
              <span className="text-[0.5rem] tracking-[0.2em] text-blue-200/70 font-mono uppercase">THE END OF EVERYTHING</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* External Link */}
            <a 
              href="https://zetsuedu.xyz" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden md:flex items-center gap-2 text-sm font-mono text-blue-200 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10"
            >
              <span>zetsuedu.xyz</span>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>

            {view !== 'intro' && (
              <button 
                onClick={resetApp} 
                className="text-xs font-bold tracking-wider text-slate-300 hover:text-white transition-colors uppercase bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full border border-white/10"
              >
                Exit
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 pt-32 pb-24 relative z-10 w-full max-w-7xl mx-auto">
        {view === 'intro' && (
          <div className="max-w-4xl mx-auto text-center animate-fadeIn px-4 relative">
             
            {/* Demo Overlay */}
            {showDemo && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-slide-in overflow-y-auto">
                    <div className="w-full max-w-6xl my-auto">
                        <BlueprintResult 
                            data={demoData} 
                            isDemo={true}
                            demoImage={demoImage}
                            onCloseDemo={closeDemo}
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
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button onClick={startQuiz} className="w-full sm:w-auto text-lg px-12 py-5 shadow-blue-500/20">
                Initialize Blueprint
              </Button>
              <Button onClick={openDemo} variant="ghost" className="w-full sm:w-auto text-lg px-8 py-5 border border-white/10 hover:bg-white/5">
                View Example
              </Button>
            </div>

            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { n: '01', title: 'Define', desc: 'Guided linear structure forces clear articulation.' },
                { n: '02', title: 'Crystallize', desc: 'Compiles scattered thoughts into a manifesto.' },
                { n: '03', title: 'Visualize', desc: 'Generates a high-fidelity render of the future.' }
              ].map((item) => (
                <div key={item.n} className="group p-8 border border-white/5 rounded-3xl bg-slate-900/20 backdrop-blur-sm hover:bg-slate-800/40 transition-all duration-300 hover:border-white/10 hover:-translate-y-1">
                  <div className="text-4xl font-black text-white/10 mb-4 group-hover:text-blue-500/20 transition-colors">{item.n}</div>
                  <strong className="block text-white mb-2 text-lg tracking-wide">{item.title}</strong>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'quiz' && (
          <QuizFlow onComplete={handleQuizComplete} />
        )}

        {view === 'result' && blueprintData && (
          <BlueprintResult data={blueprintData} onReset={resetApp} />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-slate-950/60 backdrop-blur-xl relative z-20">
        <div className="max-w-7xl mx-auto p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-8">
            
            {/* Footer Logo Section */}
            <div className="flex flex-col items-center gap-4">
              <ZetsuLogo className="w-16 h-16 opacity-90" />
              <div className="flex flex-col items-center">
                <h3 className="text-2xl font-black tracking-tighter text-white">
                  ZETSU <span className="text-blue-500">EDU</span>
                </h3>
                {/* Yellow slogan from image */}
                <div className="flex flex-col items-center mt-1">
                  <span className="text-[10px] font-bold text-yellow-400 tracking-[0.3em] uppercase">
                    ZETSUMETSU
                  </span>
                  <span className="text-[8px] font-bold text-yellow-500/80 tracking-[0.2em] uppercase mt-0.5">
                    THE END OF EVERYTHING
                  </span>
                </div>
              </div>
            </div>

            <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="text-[10px] md:text-xs text-slate-500 font-mono tracking-wide leading-relaxed uppercase space-y-1">
                <p className="text-slate-400 font-semibold">© 2025 Zetsumetsu Corporation™</p>
                <p>All systems, products, and materials are the property of Zetsumetsu Corporation & Google Gemini.</p>
                <p>Unauthorized use or reproduction is prohibited.</p>
              </div>
              
              <div className="text-[10px] text-slate-600 font-mono flex flex-wrap justify-center gap-x-4 gap-y-2">
                <span>Zetsumetsu EOe™ | Idea 2 Reality™ | © 2024 - 2025 Zetsumetsu Corporation™</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>
    </div>
  );
}

export default App;