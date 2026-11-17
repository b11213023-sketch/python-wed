import React, { useState } from 'react';
import { ArrowRight, Box } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (sectionId: string) => void;
}

const PILLARS = [
  {
    index: '01',
    title: 'Class 類別藍圖',
    summary: '定義資料欄位與行為方法，本身不佔用個別實體資料空間。',
    target: 'factory',
  },
  {
    index: '02',
    title: '__init__ 與 self',
    summary: '在誕生瞬間初始化屬性，並用 self 指向該物件自己的記憶體位址。',
    target: 'init-stepper',
  },
  {
    index: '03',
    title: 'Instance 獨立實體',
    summary: '同一張藍圖可產出多個物件，彼此修改狀態時互不干擾。',
    target: 'factory',
  },
  {
    index: '04',
    title: 'Inheritance 繼承與封裝',
    summary: '透過 super() 擴充既有類別、以多型統一介面並保護敏感欄位。',
    target: 'oop-lab',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <section id="top" className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
          {/* Left Column */}
          <div className="flex flex-col justify-between lg:col-span-6">
            <div>
              <p className="text-sm font-medium text-sky-700">
                Python 物件導向基礎 · 互動式視覺教學
              </p>

              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl leading-[1.15] text-balance">
                從設計藍圖到真實物件：徹底看懂 Class 與 Object
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600">
                不再只是死背語法。透過即時記憶體位址模擬、self 指標追蹤、以及可親手操作的物件工廠，讓抽象的類別定義化為眼前運作的程式實體。
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('factory')}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <span>進入互動物件工廠</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('init-stepper')}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  拆解 __init__ 與 self
                </button>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span>4 大互動實驗模組</span>
              <span aria-hidden="true">·</span>
              <span>即時記憶體模型視覺化</span>
              <span aria-hidden="true">·</span>
              <span>內建程式實作檢查器</span>
            </div>
          </div>

          {/* Right Column: Generated Illustration */}
          <div className="lg:col-span-6">
            <div className="relative h-full min-h-[280px] overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              {!imgError ? (
                <img
                  src="/src/assets/images/hero_class_blueprint_1794896463337.jpg"
                  alt="工程設計藍圖轉化為三個獨立色彩的實體機器人模型，象徵一個 Python Class 類別可實例化出多個獨立 Object 物件"
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-sky-50 to-slate-100 p-8 text-center">
                  <Box className="h-12 w-12 text-sky-600" aria-hidden="true" />
                  <p className="mt-3 font-display text-lg font-semibold text-slate-800">
                    Class 藍圖 → Object 實體
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    一張藍圖定義結構，產生多個互不干擾的記憶體物件
                  </p>
                </div>
              )}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent px-5 py-4">
                <p className="text-xs font-medium text-white">
                  圖解隱喻：左側工程藍圖為 Class 定義，右側三個獨立色彩的實體為 Object 實例。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Pillar Mental Model Strip */}
        <div id="pillars" className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <button
              key={pillar.index}
              type="button"
              onClick={() => onNavigate(pillar.target)}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-5 text-left hover:border-sky-300 hover:bg-white transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <div>
                <p className="font-mono text-xs font-medium text-sky-700 tabular-nums">
                  {pillar.index}
                </p>
                <h2 className="mt-2 font-display text-base font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {pillar.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {pillar.summary}
                </p>
              </div>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 group-hover:text-sky-700">
                前往單元
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
