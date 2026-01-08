
import React, { useState, useEffect, useCallback } from 'react';

interface CarouselImage {
  url: string;
}

const CAROUSEL_IMAGES: CarouselImage[] = [
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/1289997122c74dfabdcbf54f903a48b31a24e9a6b854424ea58ecb4476139941.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/3b6a36c55e3a4a36b157d1f0417d18af48629eb397bf424b90593568004cb8fe.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/23349bcf3c7f4df9ba9e2574f9ef6f7f8320f08859b54f808b04101b53f39695.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/0411329f66b64682bd6d92184f3829a9bc586e24cea444fc8b5e86a89b48cf61.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/066837c67e7b48e6998eab251e0d146644f5af159cce4bbeb76630a814e423ef.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/5d2fee52be4248d78f1886dfde95efa733fcfa68aa8c4eb1b49bd62a0a6e2bde.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/d91c391e653a44cead27982848ba4b51aa437466bbd64159928472aaf35c384d.jpg" },
  { url: "https://assets.skool.com/f/0f7f15bc8d494ed0b4bfb968b9a216e4/eca0231dc3c84508a456234afa7968c1cfcf54f5fa2947eb8c4df1c53e2e5764.jpg" }
];

export const ImageCarousel: React.FC<{ id?: string }> = ({ id }) => {
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
      id={id}
      className="relative w-full max-w-5xl mx-auto group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
      
      <div className="relative aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden rounded-[2rem] bg-slate-900 border border-white/10 shadow-2xl">
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
              alt={`Vector ${(index + 1).toString().padStart(2, '0')}`}
              className="w-full h-full object-cover opacity-70"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex flex-col justify-end p-8 md:p-12">
              <div className={`transition-all duration-500 delay-300 ${index === currentIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-[10px] font-mono text-blue-200 uppercase tracking-[0.3em] mb-3">
                  SYSTEM VECTOR ARCHIVE
                </span>
                <h3 className="text-6xl md:text-8xl font-black text-white/30 tracking-tighter uppercase font-mono italic leading-none">
                  {(index + 1).toString().padStart(2, '0')}
                </h3>
              </div>
            </div>
          </div>
        ))}

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
