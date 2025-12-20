import React, { useState, useEffect, useCallback } from 'react';

interface CarouselImage {
  url: string;
  title: string;
  type: string;
}

const CAROUSEL_IMAGES: CarouselImage[] = [
  
  {
    url: "https://d2bea4b3ff.cbaul-cdnwnd.com/dfe48af8f86efd5f82eaa4c351ff5b77/200000001-622a1622a3/ZETSU-EDU-11-22-2025-fotor-20251122141731.webp?ph=d2bea4b3ff",
    title: "Zetsu EDU",
    type: "Join the Community"
  },
  {
    url: "https://images.unsplash.com/photo-1480694313141-fce5e697ee25?auto=format&fit=crop&q=80&w=1200",
    title: "Urban Navigator App",
    type: "Mobile Service"
  },
  {
    url: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=1200",
    title: "Cyberpunk Stealth Game",
    type: "Immersive Game"
  },
  {
    url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
    title: "Modular Robotic Unit",
    type: "Hardware Device"
  },
  {
    url: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200",
    title: "Aetheric Knowledge Tome",
    type: "Digital Artifact"
  }
];

export const ImageCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === CAROUSEL_IMAGES.length - 1 ? 0 : prev + 1));
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? CAROUSEL_IMAGES.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide, isHovering]);

  return (
    <div 
      className="relative w-full max-w-5xl mx-auto group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Frame / Border Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      
      {/* Main Container */}
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 shadow-2xl">
        
        {/* Slides */}
        {CAROUSEL_IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
              index === currentIndex 
                ? 'opacity-100 scale-100 translate-x-0' 
                : 'opacity-0 scale-105 translate-x-12 pointer-events-none'
            }`}
          >
            <img 
              src={image.url} 
              alt={image.title}
              className="w-full h-full object-cover opacity-70"
            />
            
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className="animate-slide-in">
                <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-mono text-blue-200 uppercase tracking-widest mb-3">
                  {image.type}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                  {image.title}
                </h3>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:scale-110 z-20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-slate-950/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10 hover:scale-110 z-20"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {CAROUSEL_IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === currentIndex ? 'w-8 bg-blue-400' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};