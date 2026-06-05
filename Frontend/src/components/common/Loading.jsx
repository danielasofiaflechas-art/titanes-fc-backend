import React from 'react';

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing pulsing ring */}
        <div className="absolute h-24 w-24 rounded-full border-4 border-titanes-red/20 animate-ping"></div>
        {/* Middle spinning segment */}
        <div className="absolute h-20 w-20 rounded-full border-4 border-transparent border-t-titanes-red border-r-titanes-red animate-spin"></div>
        {/* Inner spinning opposite segment */}
        <div className="absolute h-14 w-14 rounded-full border-4 border-transparent border-b-titanes-red/80 border-l-titanes-red/80 animate-spin" style={{ animationDirection: 'reverse' }}></div>
        
        {/* Central Logo Letter T */}
        <span className="text-2xl font-black text-white select-none tracking-wider animate-pulse">T</span>
      </div>
      <p className="mt-8 text-sm font-semibold tracking-widest text-zinc-500 uppercase animate-pulse">
        Cargando Titanes F.C...
      </p>
    </div>
  );
};

export default Loading;
