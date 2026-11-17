/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ClassFactorySandbox } from './components/ClassFactorySandbox';
import { InitSelfStepper } from './components/InitSelfStepper';
import { OopPillarsLab } from './components/OopPillarsLab';
import { PracticeAndQuiz } from './components/PracticeAndQuiz';

export default function App() {
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar onNavigate={handleNavigate} />

      <main className="flex-1">
        <HeroSection onNavigate={handleNavigate} />
        <ClassFactorySandbox />
        <InitSelfStepper />
        <OopPillarsLab />
        <PracticeAndQuiz />
      </main>

      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-6 text-xs text-slate-500 sm:flex-row sm:items-center">
          <p className="font-medium text-slate-700">
            PyCraft 物件實驗室 · Python 類別與物件導向互動學習平台
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              type="button"
              onClick={() => handleNavigate('factory')}
              className="hover:text-slate-900 cursor-pointer"
            >
              物件工廠
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('init-stepper')}
              className="hover:text-slate-900 cursor-pointer"
            >
              建構子拆解
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('oop-lab')}
              className="hover:text-slate-900 cursor-pointer"
            >
              繼承與封裝
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('practice')}
              className="hover:text-slate-900 cursor-pointer"
            >
              實戰測驗
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
