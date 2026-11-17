import React, { useState } from 'react';
import { Play, Plus, RotateCcw, Terminal, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { BLUEPRINT_TEMPLATES, BlueprintTemplate } from '../data/curriculum';

interface SpawnedObject {
  id: string;
  varName: string;
  memAddr: string;
  param1Value: string;
  param2Value: number;
  param3Value: string;
  lastActionNote: string;
}

interface ConsoleEntry {
  id: string;
  command: string;
  output: string;
  type: 'create' | 'method' | 'class_attr' | 'warn';
}

const MEMORY_ADDRS = ['0x1A04', '0x2B8C', '0x4F12', '0x8D30'];

function createInitialObjects(template: BlueprintTemplate): SpawnedObject[] {
  return [
    {
      id: `${template.id}-init-1`,
      varName: `${template.varPrefix}_1`,
      memAddr: MEMORY_ADDRS[0],
      param1Value: template.param1DefaultOptions[0],
      param2Value: template.param2Default,
      param3Value: template.param3Options[0].value,
      lastActionNote: '初始建立',
    },
  ];
}

export const ClassFactorySandbox: React.FC = () => {
  const [templateId, setTemplateId] = useState<BlueprintTemplate['id']>('robot');
  const template = BLUEPRINT_TEMPLATES.find((t) => t.id === templateId) || BLUEPRINT_TEMPLATES[0];

  const [classAttrValue, setClassAttrValue] = useState<string>(template.defaultClassAttr);
  const [param1Input, setParam1Input] = useState<string>(template.param1DefaultOptions[1]);
  const [param2Input, setParam2Input] = useState<number>(template.param2Default);
  const [param3Input, setParam3Input] = useState<string>(template.param3Options[1].value);

  const [instances, setInstances] = useState<SpawnedObject[]>(() => createInitialObjects(template));
  const [selectedId, setSelectedId] = useState<string>(`${template.id}-init-1`);
  const [highlightedRole, setHighlightedRole] = useState<string>('init_def');
  const [conceptHint, setConceptHint] = useState<string>(
    '目前選取了預設物件實體。右側可調整建構子參數並建立第二個物件，觀察兩個物件如何擁有獨立記憶體與屬性。'
  );
  const [consoleLogs, setConsoleLogs] = useState<ConsoleEntry[]>([
    {
      id: 'init-log',
      command: `${template.varPrefix}_1 = ${template.className}("${template.param1DefaultOptions[0]}", ${template.param2Default}, "${template.param3Options[0].value}")`,
      output: `已配置物件位址 ${MEMORY_ADDRS[0]} 並執行 __init__`,
      type: 'create',
    },
  ]);

  const handleSelectTemplate = (nextId: BlueprintTemplate['id']) => {
    const nextTpl = BLUEPRINT_TEMPLATES.find((t) => t.id === nextId) || BLUEPRINT_TEMPLATES[0];
    setTemplateId(nextId);
    setClassAttrValue(nextTpl.defaultClassAttr);
    setParam1Input(nextTpl.param1DefaultOptions[1]);
    setParam2Input(nextTpl.param2Default);
    setParam3Input(nextTpl.param3Options[1].value);
    const initial = createInitialObjects(nextTpl);
    setInstances(initial);
    setSelectedId(initial[0].id);
    setHighlightedRole('class_header');
    setConceptHint(`已切換為 ${nextTpl.className} 藍圖。你可以變更類別屬性或建立多個實體比較狀態變化。`);
    setConsoleLogs([
      {
        id: `switch-${Date.now()}`,
        command: `${nextTpl.varPrefix}_1 = ${nextTpl.className}("${nextTpl.param1DefaultOptions[0]}", ${nextTpl.param2Default}, "${nextTpl.param3Options[0].value}")`,
        output: `已配置物件位址 ${MEMORY_ADDRS[0]} 並執行 __init__`,
        type: 'create',
      },
    ]);
  };

  const handleInstantiate = () => {
    if (instances.length >= 4) {
      setConceptHint('記憶體舞台目前上限為 4 個物件，請先移除其中一個物件再建立新實體。');
      return;
    }
    const cleanName = param1Input.trim() || template.param1DefaultOptions[instances.length % template.param1DefaultOptions.length];
    const usedAddrs = new Set(instances.map((i) => i.memAddr));
    const nextAddr = MEMORY_ADDRS.find((a) => !usedAddrs.has(a)) || `0x9E${instances.length}0`;
    const nextIndex = instances.length + 1;
    const newId = `${template.id}-${Date.now()}`;
    const newVar = `${template.varPrefix}_${nextIndex}`;

    const newObj: SpawnedObject = {
      id: newId,
      varName: newVar,
      memAddr: nextAddr,
      param1Value: cleanName,
      param2Value: param2Input,
      param3Value: param3Input,
      lastActionNote: '剛透過 __init__ 建立',
    };

    setInstances((prev) => [...prev, newObj]);
    setSelectedId(newId);
    setHighlightedRole('init_body');
    setConceptHint(
      `執行 ${newVar} = ${template.className}(...) 時，Python 在記憶體 ${nextAddr} 建立新物件，並把 ${nextAddr} 傳入 __init__ 的 self 寫入屬性。`
    );
    setConsoleLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        command: `${newVar} = ${template.className}("${cleanName}", ${param2Input}, "${param3Input}")`,
        output: `配置位址 ${nextAddr} · self.${template.param1Key}="${cleanName}"`,
        type: 'create',
      },
      ...prev.slice(0, 5),
    ]);
  };

  const handleUpdateClassAttr = (nextVal: string) => {
    setClassAttrValue(nextVal);
    setHighlightedRole('class_attr');
    setConceptHint(
      `類別屬性 ${template.className}.${template.classAttrName} 已更新為 "${nextVal}"。注意畫面上「所有」現存物件都同步繼承了這個變更，因為類別屬性是全體共用的！`
    );
    setConsoleLogs((prev) => [
      {
        id: `cls-${Date.now()}`,
        command: `${template.className}.${template.classAttrName} = "${nextVal}"`,
        output: `全體 ${instances.length} 個 ${template.className} 實體同步更新類別屬性`,
        type: 'class_attr',
      },
      ...prev.slice(0, 5),
    ]);
  };

  const handleInvokeMethod = (objId: string, methodId: string) => {
    const target = instances.find((i) => i.id === objId);
    if (!target) return;

    setSelectedId(objId);
    let outputMsg = '';
    let warn = false;
    let nextVal = target.param2Value;
    let roleHighlight: string = 'method1';

    if (template.id === 'robot') {
      if (methodId === 'work') {
        roleHighlight = 'method1';
        if (target.param2Value >= 20) {
          nextVal = target.param2Value - 20;
          outputMsg = `${target.param1Value} 完成${target.param3Value}任務，剩餘 ${nextVal}%`;
        } else {
          warn = true;
          outputMsg = `${target.param1Value} 電量不足 (${target.param2Value}%)，無法執行任務！`;
        }
      } else if (methodId === 'charge') {
        roleHighlight = 'method2';
        nextVal = Math.min(100, target.param2Value + 25);
        outputMsg = `${target.param1Value} 已充電至 ${nextVal}%`;
      } else {
        roleHighlight = 'class_attr';
        outputMsg = `我是 ${classAttrValue} 製造的 ${target.param1Value} (${target.param3Value}模式)`;
      }
    } else if (template.id === 'bank') {
      if (methodId === 'deposit') {
        roleHighlight = 'method1';
        nextVal = target.param2Value + 1000;
        outputMsg = `${target.param1Value} 存入 1000 元，餘額 ${nextVal} 元`;
      } else if (methodId === 'withdraw') {
        roleHighlight = 'method2';
        if (target.param2Value >= 800) {
          nextVal = target.param2Value - 800;
          outputMsg = `${target.param1Value} 提領 800 元，餘額 ${nextVal} 元`;
        } else {
          warn = true;
          outputMsg = `${target.param1Value} 餘額不足 (${target.param2Value} 元)，提領失敗！`;
        }
      } else {
        roleHighlight = 'class_attr';
        outputMsg = `[${classAttrValue}] ${target.param1Value} (${target.param3Value}) · 餘額 ${target.param2Value} 元`;
      }
    } else {
      if (methodId === 'quest') {
        roleHighlight = 'method1';
        nextVal = Math.max(0, target.param2Value - 30);
        outputMsg = `${target.param1Value} 受到 30 傷害，剩餘 ${nextVal} HP`;
        if (nextVal === 0) warn = true;
      } else if (methodId === 'heal') {
        roleHighlight = 'method2';
        nextVal = Math.min(200, target.param2Value + 40);
        outputMsg = `${target.param1Value} 回復 40 HP，目前 ${nextVal} HP`;
      } else {
        roleHighlight = 'class_attr';
        outputMsg = `[${classAttrValue}] ${target.param3Value} ${target.param1Value} · ${target.param2Value} HP`;
      }
    }

    setHighlightedRole(roleHighlight);
    setInstances((prev) =>
      prev.map((item) =>
        item.id === objId
          ? {
              ...item,
              param2Value: nextVal,
              lastActionNote: outputMsg,
            }
          : item
      )
    );

    const methodMeta = template.methods.find((m) => m.id === methodId);
    setConceptHint(
      `呼叫 ${target.varName}${methodMeta?.pythonCall ?? ''} 時，Python 自動將 ${target.memAddr} 綁定為 self，因此只有 ${target.varName} 自己的狀態改變，其他物件完全不受影響。`
    );
    setConsoleLogs((prev) => [
      {
        id: `m-${Date.now()}`,
        command: `${target.varName}${methodMeta?.pythonCall ?? ''}`,
        output: outputMsg,
        type: warn ? 'warn' : 'method',
      },
      ...prev.slice(0, 5),
    ]);
  };

  const handleRemoveInstance = (id: string) => {
    if (instances.length <= 1) return;
    const filtered = instances.filter((i) => i.id !== id);
    setInstances(filtered);
    if (selectedId === id && filtered.length > 0) {
      setSelectedId(filtered[0].id);
    }
  };

  const handleReset = () => {
    const initial = createInitialObjects(template);
    setClassAttrValue(template.defaultClassAttr);
    setInstances(initial);
    setSelectedId(initial[0].id);
    setHighlightedRole('init_def');
    setConceptHint('已重設物件工廠為初始狀態。');
    setConsoleLogs([
      {
        id: `reset-${Date.now()}`,
        command: `${template.varPrefix}_1 = ${template.className}("${template.param1DefaultOptions[0]}", ${template.param2Default}, "${template.param3Options[0].value}")`,
        output: `已重設並建立預設物件於 ${MEMORY_ADDRS[0]}`,
        type: 'create',
      },
    ]);
  };

  const activeObj = instances.find((i) => i.id === selectedId) || instances[0];

  return (
    <section id="factory" className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">
              模組 01 · 類別藍圖與記憶體實體模擬
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              互動式物件工廠：親手建立並觀察獨立的記憶體實體
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start md:self-auto">
            {BLUEPRINT_TEMPLATES.map((tpl) => {
              const active = tpl.id === templateId;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {tpl.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Two-Zone Sandbox Layout: 65% Stage (8 cols) + 35% Control & Concept Deck (4 cols) */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
          {/* Left Stage: Blueprint Code + Memory Heap + Console */}
          <div className="space-y-6 lg:col-span-8">
            {/* 1. Live Blueprint Code */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-mono font-semibold text-sky-400">
                    class {template.className}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>類別設計藍圖（高亮區對應目前操作）</span>
                </div>
                <span className="font-mono text-xs text-slate-400 tabular-nums">
                  {activeObj ? `self → ${activeObj.varName} (${activeObj.memAddr})` : ''}
                </span>
              </div>
              <pre className="overflow-x-auto px-5 py-4 text-xs sm:text-sm leading-relaxed font-mono">
                {template.codeLines.map((line) => {
                  const formatted = line.text.replace('{CLASS_ATTR}', classAttrValue);
                  const isHighlighted = line.role !== 'blank' && line.role === highlightedRole;
                  return (
                    <div
                      key={line.lineNum}
                      className={`flex items-baseline gap-4 rounded px-2 py-0.5 transition-colors ${
                        isHighlighted ? 'bg-sky-500/20 text-sky-100' : 'text-slate-300'
                      }`}
                    >
                      <span className="w-5 select-none text-right text-xs text-slate-500 tabular-nums">
                        {line.lineNum}
                      </span>
                      <code className="whitespace-pre">{formatted || ' '}</code>
                    </div>
                  );
                })}
              </pre>
            </div>

            {/* 2. Memory Heap Stage (Live Object Instances) */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <h3 className="font-display text-base font-semibold text-slate-900">
                    堆積記憶體舞台 (Object Instances in Memory)
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    點選任意物件卡片切換 <code className="font-mono text-sky-700">self</code> 指向，並直接對該物件呼叫方法
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-600 tabular-nums">
                  <span>實體數量：{instances.length} / 4</span>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    重設
                  </button>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {instances.map((obj) => {
                  const isSelected = obj.id === activeObj?.id;
                  const percent =
                    template.id === 'bank'
                      ? Math.min(100, Math.round((obj.param2Value / template.param2Max) * 100))
                      : Math.min(100, Math.round((obj.param2Value / template.param2Max) * 100));

                  return (
                    <div
                      key={obj.id}
                      onClick={() => setSelectedId(obj.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedId(obj.id);
                        }
                      }}
                      className={`flex flex-col justify-between rounded-xl border p-4 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-sky-600 ${
                        isSelected
                          ? 'border-sky-600 bg-sky-50/40'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div>
                        {/* Header row */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-semibold text-slate-900">
                              {obj.varName}
                            </span>
                            <span className="font-mono text-xs text-slate-500 tabular-nums">
                              @ {obj.memAddr}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <span className="text-xs font-semibold text-sky-700">
                                現行 self
                              </span>
                            )}
                            {instances.length > 1 && (
                              <button
                                type="button"
                                aria-label={`移除 ${obj.varName}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveInstance(obj.id);
                                }}
                                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Attributes table (clean hairlines, no pill boxes) */}
                        <div className="mt-3 divide-y divide-slate-100 border-t border-b border-slate-100 text-xs">
                          <div className="flex items-center justify-between py-1.5">
                            <span className="font-mono text-slate-500">
                              {template.className}.{template.classAttrName}
                            </span>
                            <span className="font-medium text-sky-700">{classAttrValue}</span>
                          </div>
                          <div className="flex items-center justify-between py-1.5">
                            <span className="font-mono text-slate-500">self.{template.param1Key}</span>
                            <span className="font-semibold text-slate-900">"{obj.param1Value}"</span>
                          </div>
                          <div className="flex items-center justify-between py-1.5">
                            <span className="font-mono text-slate-500">self.{template.param3Key}</span>
                            <span className="font-medium text-slate-800">"{obj.param3Value}"</span>
                          </div>
                          <div className="py-2">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-slate-500">self.{template.param2Key}</span>
                              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                                {obj.param2Value}
                                {template.param2Unit}
                              </span>
                            </div>
                            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                              <div
                                className={`h-full transition-all duration-200 ${
                                  percent <= 20 ? 'bg-amber-600' : 'bg-emerald-600'
                                }`}
                                style={{ width: `${Math.max(4, percent)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Object Method Buttons */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {template.methods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleInvokeMethod(obj.id, method.id);
                            }}
                            title={method.description}
                            className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-mono text-xs font-medium text-slate-700 hover:border-sky-300 hover:bg-sky-50 hover:text-sky-800 transition-colors cursor-pointer"
                          >
                            <Play className="h-3 w-3" aria-hidden="true" />
                            <span>{method.pythonCall.slice(1)}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. Live Python Console Output */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                <Terminal className="h-4 w-4 text-slate-500" aria-hidden="true" />
                <span>即時執行紀錄 (Python Console Trace)</span>
              </div>
              <div className="mt-3 divide-y divide-slate-100 font-mono text-xs">
                {consoleLogs.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-1 py-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-slate-700">&gt;&gt;&gt; {entry.command}</span>
                    <span
                      className={`inline-flex items-center gap-1 font-sans text-xs font-medium ${
                        entry.type === 'warn'
                          ? 'text-red-700'
                          : entry.type === 'class_attr'
                          ? 'text-sky-700'
                          : 'text-emerald-700'
                      }`}
                    >
                      {entry.type === 'warn' ? (
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      ) : (
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      )}
                      {entry.output}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Deck: Controls & Contextual Concept Callout (35% -> 4 cols) */}
          <div className="space-y-6 lg:col-span-4">
            {/* Instantiation Control Panel */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-display text-base font-semibold text-slate-900">
                實例化參數設定 (__init__)
              </h3>
              <p className="mt-1 text-xs text-slate-500">{template.subtitle}</p>

              <div className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="param1-input"
                    className="block text-xs font-semibold text-slate-700"
                  >
                    {template.param1Label}
                  </label>
                  <input
                    id="param1-input"
                    type="text"
                    value={param1Input}
                    onChange={(e) => setParam1Input(e.target.value)}
                    maxLength={12}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:bg-white focus:outline-none"
                  />
                  <div className="mt-1.5 flex flex-wrap gap-2 text-xs text-slate-500">
                    <span>快速填入：</span>
                    {template.param1DefaultOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setParam1Input(opt)}
                        className="underline underline-offset-2 hover:text-sky-700 cursor-pointer"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs">
                    <label htmlFor="param2-slider" className="font-semibold text-slate-700">
                      {template.param2Label}
                    </label>
                    <span className="font-mono font-semibold text-sky-700 tabular-nums">
                      {param2Input}
                      {template.param2Unit}
                    </span>
                  </div>
                  <input
                    id="param2-slider"
                    type="range"
                    min={template.param2Min}
                    max={template.param2Max}
                    step={template.param2Step}
                    value={param2Input}
                    onChange={(e) => setParam2Input(Number(e.target.value))}
                    className="mt-2 w-full accent-sky-600 cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between font-mono text-[11px] text-slate-400 tabular-nums">
                    <span>
                      {template.param2Min}
                      {template.param2Unit}
                    </span>
                    <span>
                      {template.param2Max}
                      {template.param2Unit}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700">
                    {template.param3Label}
                  </span>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5 rounded-lg bg-slate-100 p-1">
                    {template.param3Options.map((opt) => {
                      const active = param3Input === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setParam3Input(opt.value)}
                          className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                            active
                              ? 'bg-white text-slate-900 shadow-sm'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleInstantiate}
                  disabled={instances.length >= 4}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {instances.length >= 4
                      ? '已達舞台上限 (4 個物件)'
                      : `建立物件實體 (${template.className}())`}
                  </span>
                </button>
              </div>
            </div>

            {/* Class Attribute Shared Mutator */}
            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="font-display text-base font-semibold text-slate-900">
                共用類別屬性測試 (Class Attribute)
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                修改類別屬性 <code className="font-mono text-sky-700">{template.className}.{template.classAttrName}</code>，觀察所有現存實體如何同步更新：
              </p>
              <div className="mt-3 grid grid-cols-1 gap-2">
                {template.classAttrOptions.map((opt) => {
                  const active = classAttrValue === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleUpdateClassAttr(opt)}
                      className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium transition-colors cursor-pointer ${
                        active
                          ? 'border-sky-600 bg-sky-50 text-sky-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{opt}</span>
                      <span className="font-mono text-[11px] text-slate-500">
                        {active ? '目前共用值' : '套用至此類別'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bite-sized Live Concept Explanation */}
            <div className="rounded-xl border border-slate-200 bg-slate-100/70 p-5">
              <p className="text-xs font-semibold text-slate-700">
                即時觀念提示
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {conceptHint}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
