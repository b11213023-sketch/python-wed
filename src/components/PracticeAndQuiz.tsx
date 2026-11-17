import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, HelpCircle, Play, RotateCcw } from 'lucide-react';
import { CODE_CHALLENGES, QUIZ_QUESTIONS } from '../data/curriculum';

type AssessmentMode = 'coding' | 'quiz';

export const PracticeAndQuiz: React.FC = () => {
  const [mode, setMode] = useState<AssessmentMode>('coding');

  // Coding Lab State
  const [challengeIdx, setChallengeIdx] = useState<number>(0);
  const [userInputs, setUserInputs] = useState<Record<string, string>>({});
  const [codeResults, setCodeResults] = useState<
    Record<string, { passed: boolean; message: string; output?: string }>
  >({});
  const [showHint, setShowHint] = useState<boolean>(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const challenge = CODE_CHALLENGES[challengeIdx];
  const currentCodeInput = userInputs[challenge.id] ?? '';
  const currentCodeResult = codeResults[challenge.id];

  const handleRunChallenge = () => {
    const trimmed = currentCodeInput;
    const isMatch = challenge.expectedRegexes.some((rx) => rx.test(trimmed));
    if (isMatch) {
      setCodeResults((prev) => ({
        ...prev,
        [challenge.id]: {
          passed: true,
          message: '驗證通過！語法與物件導向邏輯完全正確。',
          output: challenge.successOutput,
        },
      }));
    } else {
      setCodeResults((prev) => ({
        ...prev,
        [challenge.id]: {
          passed: false,
          message: challenge.failureFeedback(trimmed),
        },
      }));
    }
  };

  const correctQuizCount = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <section id="practice" className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">
              模組 04 · 程式實戰與觀念自我檢測
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              動手寫出類別定義，並檢驗你對物件模型的心智理解
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 p-1 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setMode('coding')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'coding'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              程式填空練習 (3 題)
            </button>
            <button
              type="button"
              onClick={() => setMode('quiz')}
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'quiz'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              觀念隨堂測驗 (6 題)
            </button>
          </div>
        </div>

        {/* MODE 1: INTERACTIVE PYTHON CODE LAB */}
        {mode === 'coding' && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Challenge Selector */}
            <div className="space-y-2 lg:col-span-4">
              {CODE_CHALLENGES.map((item, idx) => {
                const active = idx === challengeIdx;
                const result = codeResults[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setChallengeIdx(idx);
                      setShowHint(false);
                    }}
                    className={`w-full rounded-xl border p-4 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-sky-600 bg-sky-50/50'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-sky-700">{item.topic}</span>
                      {result?.passed && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                          已通過
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-display text-sm font-semibold text-slate-900">
                      {item.title}
                    </p>
                  </button>
                );
              })}

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
                完成任務後點擊「執行並驗證」，系統會檢查縮排、self 參數綁定與語法結構並模擬 Python 終端機輸出。
              </div>
            </div>

            {/* Code Editor Workbench */}
            <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-display text-lg font-semibold text-slate-900">
                    {challenge.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">{challenge.prompt}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHint((h) => !h)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  {showHint ? '隱藏提示' : '查看提示'}
                </button>
              </div>

              {showHint && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900">
                  提示：{challenge.hint}
                </div>
              )}

              <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs sm:text-sm text-slate-200">
                <pre className="whitespace-pre-wrap leading-relaxed">{challenge.prefixCode}</pre>
                <div className="my-2 flex items-center gap-2">
                  <span className="select-none text-slate-500">
                    {challenge.id === 'c2' ? '    ' : '        '}
                  </span>
                  <input
                    type="text"
                    aria-label={challenge.blankLabel}
                    value={currentCodeInput}
                    onChange={(e) =>
                      setUserInputs((prev) => ({ ...prev, [challenge.id]: e.target.value }))
                    }
                    placeholder={`請輸入程式碼（例如：${challenge.placeholder}）`}
                    className="w-full rounded-md border border-sky-500/60 bg-slate-800 px-3 py-1.5 font-mono text-sm text-sky-200 placeholder:text-slate-500 focus:border-sky-400 focus:outline-none"
                  />
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{challenge.suffixCode}</pre>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleRunChallenge}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 cursor-pointer"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    執行並驗證
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setUserInputs((prev) => ({
                        ...prev,
                        [challenge.id]: challenge.placeholder,
                      }))
                    }
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    填入參考解答
                  </button>
                </div>
              </div>

              {currentCodeResult && (
                <div
                  className={`mt-4 rounded-lg border p-4 text-xs ${
                    currentCodeResult.passed
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900'
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold">
                    {currentCodeResult.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-700" aria-hidden="true" />
                    )}
                    <span>{currentCodeResult.message}</span>
                  </div>
                  {currentCodeResult.output && (
                    <div className="mt-2 rounded bg-slate-900 px-3 py-2 font-mono text-emerald-300">
                      &gt;&gt;&gt; {currentCodeResult.output}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODE 2: CONCEPT MASTERY QUIZ */}
        {mode === 'quiz' && (
          <div className="mt-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div className="text-sm text-slate-700 tabular-nums">
                已作答進度：<strong>{answeredCount} / {QUIZ_QUESTIONS.length}</strong> 題
                {quizSubmitted && (
                  <span className="ml-4 font-semibold text-sky-800">
                    · 測驗結果：答對 {correctQuizCount} / {QUIZ_QUESTIONS.length} 題
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={() => setQuizSubmitted(true)}
                    disabled={answeredCount < QUIZ_QUESTIONS.length}
                    className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 cursor-pointer"
                  >
                    {answeredCount < QUIZ_QUESTIONS.length
                      ? `尚餘 ${QUIZ_QUESTIONS.length - answeredCount} 題未作答`
                      : '送出並檢視解析'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedAnswers({});
                      setQuizSubmitted(false);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    重新測驗
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {QUIZ_QUESTIONS.map((q, qIndex) => {
                const picked = selectedAnswers[q.id];
                const isCorrect = picked === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-mono font-medium tabular-nums">
                          Q0{qIndex + 1} · {q.topic}
                        </span>
                        {quizSubmitted && (
                          <span
                            className={`inline-flex items-center gap-1 font-semibold ${
                              isCorrect ? 'text-emerald-700' : 'text-red-700'
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                                答對
                              </>
                            ) : (
                              <>
                                <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                                需複習
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <h3 className="mt-2 text-sm font-semibold leading-relaxed text-slate-900">
                        {q.question}
                      </h3>

                      {q.codeSnippet && (
                        <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-900 p-3 font-mono text-xs text-slate-200">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      )}

                      <div className="mt-4 space-y-2">
                        {q.options.map((opt, oIndex) => {
                          const selected = picked === oIndex;
                          const showAsCorrect = quizSubmitted && oIndex === q.correctIndex;
                          const showAsWrong = quizSubmitted && selected && oIndex !== q.correctIndex;

                          return (
                            <button
                              key={oIndex}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() =>
                                setSelectedAnswers((prev) => ({ ...prev, [q.id]: oIndex }))
                              }
                              className={`w-full rounded-lg border px-3.5 py-2.5 text-left text-xs leading-relaxed transition-colors cursor-pointer disabled:cursor-default ${
                                showAsCorrect
                                  ? 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold'
                                  : showAsWrong
                                  ? 'border-red-400 bg-red-50 text-red-900'
                                  : selected
                                  ? 'border-sky-600 bg-sky-50 text-sky-950 font-medium'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {quizSubmitted && (
                      <div className="mt-4 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-600">
                        <strong className="text-slate-800">觀念解析：</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
