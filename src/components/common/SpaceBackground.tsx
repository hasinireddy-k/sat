import React from 'react';

export const SpaceBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen relative bg-black text-white selection:bg-[#0084ff] selection:text-white overflow-hidden">
      <div className="starfield star-layer-1"></div>
      <div className="starfield star-layer-2"></div>
      <div className="starfield star-layer-3"></div>
      <div className="orbital-bg"></div>
      <div className="orbital-arcs"></div>

      <div className="flex-1 flex min-h-screen z-10 w-full">
        {children}
      </div>
    </div>
  );
};
