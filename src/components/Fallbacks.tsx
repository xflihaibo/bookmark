import React from 'react';

export const PanelSkeleton: React.FC = () => (
  <div className="w-full max-w-2xl my-6 animate-pulse">
    <div className="h-12 rounded-xl bg-white/40 dark:bg-white/10 mb-3" />
    <div className="h-10 rounded-xl bg-white/40 dark:bg-white/10" />
  </div>
);

export const GridSkeleton: React.FC = () => (
  <div className="w-full max-w-[1280px] mx-auto p-4">
    <div className="h-6 w-40 rounded bg-white/40 dark:bg-white/10 mb-3" />
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-9 rounded bg-white/40 dark:bg-white/10" />
      ))}
    </div>
  </div>
);

export const ModalSkeleton: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
    <div className="w-full max-w-xl rounded-2xl p-6 bg-white/80 dark:bg-gray-800">
      <div className="h-6 w-48 rounded bg-gray-300 dark:bg-white/20 mb-4" />
      <div className="h-24 rounded bg-gray-200 dark:bg-white/10" />
    </div>
  </div>
);

