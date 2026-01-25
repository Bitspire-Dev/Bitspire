import React from 'react';

export const Background = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Główne duże światła - tło */}
      <div className="absolute top-[25%] left-[33%] w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
      <div className="absolute bottom-[25%] right-[25%] w-80 h-80 bg-blue-700/12 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/8 rounded-full blur-3xl" />
      
      {/* Średnie światła - warstwa środkowa */}
      <div className="absolute top-10 right-[33%] w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-sky-500/14 rounded-full blur-3xl" />
      <div className="absolute top-[33%] right-10 w-56 h-56 bg-blue-300/6 rounded-full blur-3xl" />
      
      {/* Czarna maska z 40% przezroczystością dla lepszego kontrastu */}
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
};
