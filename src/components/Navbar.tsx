import React from 'react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-6 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('top');
          }}
          className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
        >
          PyCraft 物件實驗室
        </a>

        <nav
          aria-label="主要導覽"
          className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600"
        >
          <a
            href="#pillars"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('pillars');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline hover:underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            核心觀念
          </a>
          <a
            href="#factory"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('factory');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline hover:underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            物件工廠
          </a>
          <a
            href="#init-stepper"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('init-stepper');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline hover:underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            建構子拆解
          </a>
          <a
            href="#oop-lab"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('oop-lab');
            }}
            className="whitespace-nowrap shrink-0 py-1 hover:text-slate-900 hover:underline hover:underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
          >
            繼承與封裝
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => onNavigate('practice')}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            開始實戰測驗
          </button>
        </div>
      </div>
    </header>
  );
};
