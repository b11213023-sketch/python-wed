import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { INIT_STEPS } from '../data/curriculum';

const DEMO_CODE_LINES = [
  { num: 1, code: 'class Dog:' },
  { num: 2, code: '    def __init__(self, name, age):' },
  { num: 3, code: '        self.name = name' },
  { num: 4, code: '        self.age = age' },
  { num: 5, code: '' },
  { num: 6, code: '# 呼叫類別建立物件實例' },
  { num: 7, code: 'my_dog = Dog("Mochi", 3)' },
];

export const InitSelfStepper: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepData = INIT_STEPS[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= INIT_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  return (
    <section id="init-stepper" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">
              模組 02 · __init__ 與 self 的幕後機制
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              逐步拆解：呼叫 Dog("Mochi", 3) 時 Python 做了什麼？
            </h2>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex((p) => Math.max(0, p - 1));
              }}
              disabled={currentIndex === 0}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              上一步
            </button>
            <button
              type="button"
              onClick={() => {
                if (currentIndex >= INIT_STEPS.length - 1) {
                  setCurrentIndex(0);
                }
                setIsPlaying((p) => !p);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                  暫停播放
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" aria-hidden="true" />
                  自動播放
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex((p) => Math.min(INIT_STEPS.length - 1, p + 1));
              }}
              disabled={currentIndex === INIT_STEPS.length - 1}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
            >
              下一步
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              aria-label="重設步驟"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {INIT_STEPS.map((item, idx) => {
            const active = idx === currentIndex;
            const passed = idx < currentIndex;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`rounded-lg border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                  active
                    ? 'border-sky-600 bg-sky-50 text-sky-900'
                    : passed
                    ? 'border-emerald-200 bg-emerald-50/40 text-slate-800'
                    : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                <span className="font-mono text-xs font-semibold tabular-nums">
                  STEP 0{item.step}
                </span>
                <p className="mt-0.5 truncate text-xs font-medium">
                  {item.title.split('·')[1]?.trim()}
                </p>
              </button>
            );
          })}
        </div>

        {/* Visual Split: Code Trace + Memory Diagram */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Code Window */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 lg:col-span-5">
            <div className="border-b border-slate-800 px-5 py-3 text-xs font-medium text-slate-300">
              執行位置追蹤 (Execution Line)
            </div>
            <pre className="p-5 font-mono text-xs sm:text-sm leading-relaxed">
              {DEMO_CODE_LINES.map((line) => {
                const isActive =
                  line.num === stepData.activeLine ||
                  (stepData.step === 3 && (line.num === 3 || line.num === 4));
                return (
                  <div
                    key={line.num}
                    className={`flex items-baseline gap-3 rounded px-2 py-1 transition-colors ${
                      isActive ? 'bg-amber-500/20 text-amber-200' : 'text-slate-300'
                    }`}
                  >
                    <span className="w-4 select-none text-right text-xs text-slate-500 tabular-nums">
                      {line.num}
                    </span>
                    <code>{line.code || ' '}</code>
                  </div>
                );
              })}
            </pre>
            <div className="border-t border-slate-800 bg-slate-950/50 px-5 py-4">
              <p className="text-xs font-semibold text-amber-300">{stepData.title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-200">
                {stepData.summary}
              </p>
              <p className="mt-2 text-xs text-slate-400">{stepData.highlightNote}</p>
            </div>
          </div>

          {/* Memory Architecture Diagram */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 lg:col-span-7 flex flex-col justify-between">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Stack Variable Zone */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  變數名稱空間 (Stack Reference)
                </p>
                <div className="mt-4 space-y-3">
                  <div
                    className={`rounded-lg border p-3 transition-opacity ${
                      stepData.varLinked
                        ? 'border-emerald-300 bg-emerald-50/50 opacity-100'
                        : 'border-dashed border-slate-300 bg-slate-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold text-slate-900">my_dog</span>
                      <span className={stepData.varLinked ? 'text-emerald-700 font-semibold' : 'text-slate-400'}>
                        {stepData.varLinked ? '→ 0x7F01' : '等待賦值中'}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rounded-lg border p-3 transition-opacity ${
                      stepData.selfBound
                        ? 'border-amber-300 bg-amber-50/50 opacity-100'
                        : 'border-dashed border-slate-300 bg-slate-50 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="font-semibold text-slate-900">self (參數)</span>
                      <span className={stepData.selfBound ? 'text-amber-700 font-semibold' : 'text-slate-400'}>
                        {stepData.selfBound ? '→ 0x7F01' : '尚未進入 __init__'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Heap Object Box */}
              <div
                className={`rounded-xl border p-4 transition-all ${
                  stepData.memoryAllocated
                    ? 'border-sky-600 bg-white'
                    : 'border-dashed border-slate-300 bg-slate-100 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-700">
                    Heap 物件實體
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                    位址 0x7F01
                  </span>
                </div>

                <div className="mt-3 border-t border-slate-100 pt-3">
                  <p className="font-mono text-xs text-slate-500">
                    型別：&lt;class 'Dog'&gt;
                  </p>
                  <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50 font-mono text-xs">
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-slate-600">name</span>
                      <span
                        className={
                          stepData.attrsWritten
                            ? 'font-semibold text-emerald-700'
                            : 'text-slate-400'
                        }
                      >
                        {stepData.attrsWritten ? '"Mochi"' : '<未寫入>'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className="text-slate-600">age</span>
                      <span
                        className={
                          stepData.attrsWritten
                            ? 'font-semibold text-emerald-700 tabular-nums'
                            : 'text-slate-400'
                        }
                      >
                        {stepData.attrsWritten ? '3' : '<未寫入>'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-4 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
              <span>重點觀念：self 與 my_dog 在建立完成後，其實指向完全同一個記憶體位址 0x7F01。</span>
              <span className="font-mono text-slate-500 tabular-nums">
                進度 {currentIndex + 1} / {INIT_STEPS.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
