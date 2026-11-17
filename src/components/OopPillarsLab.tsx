import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Play, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { INHERITANCE_CHILDREN, InheritanceChild } from '../data/curriculum';

type LabTab = 'inheritance' | 'polymorphism' | 'encapsulation';

interface PolyPet {
  id: string;
  species: 'Dog' | 'Cat' | 'Bird';
  name: string;
  output: string;
}

export const OopPillarsLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LabTab>('inheritance');

  // Tab 1: Inheritance state
  const [selectedChildId, setSelectedChildId] = useState<InheritanceChild['id']>('dog');
  const [useSuperInit, setUseSuperInit] = useState<boolean>(true);
  const [inheritanceOutput, setInheritanceOutput] = useState<{
    ok: boolean;
    text: string;
  }>({
    ok: true,
    text: '汪汪！我是柴犬 Mochi',
  });

  // Tab 2: Polymorphism state
  const [polyPets, setPolyPets] = useState<PolyPet[]>([
    { id: 'p1', species: 'Dog', name: '柴柴', output: '汪汪！我是柴犬 柴柴' },
    { id: 'p2', species: 'Cat', name: '橘橘', output: '喵嗚～橘橘 正在窗台曬太陽' },
  ]);
  const [polyDispatched, setPolyDispatched] = useState<boolean>(false);

  // Tab 3: Encapsulation state
  const [vaultBalance, setVaultBalance] = useState<number>(5000);
  const [depositInput, setDepositInput] = useState<string>('1200');
  const [vaultFeedback, setVaultFeedback] = useState<{
    ok: boolean;
    message: string;
  }>({
    ok: true,
    message: '透過 @property 驗證成功：目前帳戶餘額為 5000 元。',
  });
  const [showMangledName, setShowMangledName] = useState<boolean>(false);

  const selectedChild =
    INHERITANCE_CHILDREN.find((c) => c.id === selectedChildId) || INHERITANCE_CHILDREN[0];

  const handleRunInheritanceMethod = (mode: 'speak' | 'unique' | 'eat') => {
    if (!useSuperInit && (mode === 'speak' || mode === 'unique' || mode === 'eat')) {
      setInheritanceOutput({
        ok: false,
        text: `AttributeError: '${selectedChild.className}' object has no attribute 'name'（因為未呼叫 super().__init__(name)）`,
      });
      return;
    }

    if (mode === 'eat') {
      setInheritanceOutput({
        ok: true,
        text: 'Mochi 正在進食中...（直接繼承自父類別 Animal.eat()）',
      });
    } else if (mode === 'speak') {
      setInheritanceOutput({
        ok: true,
        text: `${selectedChild.overrideSound}（執行子類別覆寫後的 ${selectedChild.className}.speak()）`,
      });
    } else {
      setInheritanceOutput({
        ok: true,
        text: `${selectedChild.uniqueOutput}（執行子類別專屬方法 ${selectedChild.className}.${selectedChild.uniqueMethod}）`,
      });
    }
  };

  const handleAddPolyPet = (species: PolyPet['species']) => {
    if (polyPets.length >= 5) return;
    const namesBySpecies: Record<PolyPet['species'], string[]> = {
      Dog: ['阿福', '可樂', '豆豆'],
      Cat: ['麻糬', '奶茶', '黑糖'],
      Bird: ['啾咪', '藍藍', '奇異'],
    };
    const pickedName = namesBySpecies[species][polyPets.length % 3];
    const soundMap: Record<PolyPet['species'], string> = {
      Dog: `汪汪！我是柴犬 ${pickedName}`,
      Cat: `喵嗚～${pickedName} 正在窗台曬太陽`,
      Bird: `啾啾！${pickedName} 在樹梢高歌`,
    };
    setPolyPets((prev) => [
      ...prev,
      { id: `pet-${Date.now()}`, species, name: pickedName, output: soundMap[species] },
    ]);
    setPolyDispatched(false);
  };

  const handleTrySetBalance = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(depositInput);
    if (Number.isNaN(parsed)) {
      setVaultFeedback({
        ok: false,
        message: 'TypeError: 請輸入有效的數字金額。',
      });
      return;
    }
    if (parsed < 0) {
      setVaultFeedback({
        ok: false,
        message: `ValueError: 餘額不可為負數 (${parsed})！@property setter 已攔截這次非法修改，餘額維持 ${vaultBalance} 元。`,
      });
      return;
    }
    setVaultBalance(parsed);
    setVaultFeedback({
      ok: true,
      message: `驗證通過：@balance.setter 已將內部 __balance 安全更新為 ${parsed} 元。`,
    });
  };

  return (
    <section id="oop-lab" className="border-b border-slate-200 bg-slate-50 py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-sky-700">
              模組 03 · 物件導向三大支柱互動實驗室
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl text-balance">
              繼承、多型與封裝：寫出可擴充且安全的類別結構
            </h2>
          </div>

          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('inheritance')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'inheritance'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              繼承與 super()
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('polymorphism')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'polymorphism'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              多型 Polymorphism
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('encapsulation')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === 'encapsulation'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              封裝與 @property
            </button>
          </div>
        </div>

        {/* TAB 1: INHERITANCE */}
        {activeTab === 'inheritance' && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Hierarchy + Controls */}
            <div className="space-y-5 lg:col-span-6">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-500">
                  父類別 (Base / Parent Class)
                </p>
                <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-slate-900">
                      class Animal:
                    </span>
                    <span className="text-xs text-slate-500">提供共用 name、eat() 與預設 speak()</span>
                  </div>
                </div>

                <div className="my-3 flex justify-center">
                  <div className="h-5 w-px bg-slate-300" aria-hidden="true" />
                </div>

                <p className="text-xs font-semibold text-slate-500">
                  選擇要檢視的子類別 (Child Class)
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {INHERITANCE_CHILDREN.map((child) => {
                    const active = child.id === selectedChildId;
                    return (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => {
                          setSelectedChildId(child.id);
                          setInheritanceOutput({
                            ok: useSuperInit,
                            text: useSuperInit
                              ? child.overrideSound
                              : `AttributeError: '${child.className}' object has no attribute 'name'`,
                          });
                        }}
                        className={`rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer ${
                          active
                            ? 'border-sky-600 bg-sky-50 text-sky-900'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="font-mono text-xs font-bold">
                          {child.className}(Animal)
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">{child.zhName}</div>
                      </button>
                    );
                  })}
                </div>

                {/* super() Toggle */}
                <div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">
                      在子類別 __init__ 呼叫 <code className="font-mono text-sky-700">super().__init__(name)</code>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      關閉開關可測試忘記呼叫 super() 時會發生什麼錯誤
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={useSuperInit}
                    onClick={() => {
                      const next = !useSuperInit;
                      setUseSuperInit(next);
                      setInheritanceOutput({
                        ok: next,
                        text: next
                          ? `已開啟 super().__init__(name)，成功繼承 self.name = "Mochi"`
                          : `AttributeError: 忘記呼叫 super().__init__(name)，導致實體沒有 name 屬性！`,
                      });
                    }}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      useSuperInit
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    {useSuperInit ? '已啟用 super()' : '已關閉 super()'}
                  </button>
                </div>

                {/* Type Checks */}
                <div className="mt-4 grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="rounded-lg border border-slate-200 px-3 py-2 flex items-center justify-between">
                    <span className="text-slate-600">isinstance(pet, Animal)</span>
                    <span className="font-semibold text-emerald-700">True</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 px-3 py-2 flex items-center justify-between">
                    <span className="text-slate-600">issubclass({selectedChild.className}, Animal)</span>
                    <span className="font-semibold text-emerald-700">True</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Code & Live Method Test */}
            <div className="space-y-5 lg:col-span-6">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 text-slate-100">
                <div className="border-b border-slate-800 px-5 py-3 text-xs text-slate-300 font-mono">
                  {selectedChild.className}(Animal) 類別定義
                </div>
                <pre className="overflow-x-auto p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200">
                  <code>
                    {useSuperInit
                      ? selectedChild.codePreview
                      : selectedChild.codePreview.replace(
                          '        super().__init__(name)',
                          '        # super().__init__(name)  <-- 被註解掉了！'
                        )}
                  </code>
                </pre>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-700">
                  測試呼叫實例方法（pet = {selectedChild.className}("Mochi")）
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleRunInheritanceMethod('eat')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-medium text-slate-700 hover:bg-sky-50 hover:border-sky-300 cursor-pointer"
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    pet.eat() (繼承自父類別)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunInheritanceMethod('speak')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-medium text-slate-700 hover:bg-sky-50 hover:border-sky-300 cursor-pointer"
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    pet.speak() (子類別覆寫)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRunInheritanceMethod('unique')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs font-medium text-slate-700 hover:bg-sky-50 hover:border-sky-300 cursor-pointer"
                  >
                    <Play className="h-3 w-3" aria-hidden="true" />
                    pet.{selectedChild.uniqueMethod} (專屬擴充)
                  </button>
                </div>

                <div
                  className={`mt-4 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-xs font-medium ${
                    inheritanceOutput.ok
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                      : 'border-red-200 bg-red-50 text-red-900'
                  }`}
                >
                  {inheritanceOutput.ok ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                  )}
                  <span className="leading-relaxed">{inheritanceOutput.text}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: POLYMORPHISM */}
        {activeTab === 'polymorphism' && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
              <h3 className="font-display text-lg font-semibold text-slate-900">
                組裝異質物件清單 <code className="font-mono text-sky-700">pets = [...]</code>
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                把不同類別的物件放進同一個串列。只要它們都擁有 <code className="font-mono">speak()</code> 方法，迴圈就能用完全相同的寫法驅動不同行為。
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {(['Dog', 'Cat', 'Bird'] as const).map((sp) => (
                  <button
                    key={sp}
                    type="button"
                    disabled={polyPets.length >= 5}
                    onClick={() => handleAddPolyPet(sp)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-semibold text-slate-700 hover:border-sky-300 hover:bg-sky-50 disabled:opacity-40 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    加入 {sp}
                  </button>
                ))}
              </div>

              <div className="mt-5 divide-y divide-slate-100 rounded-lg border border-slate-200">
                {polyPets.map((pet, idx) => (
                  <div key={pet.id} className="flex items-center justify-between px-4 py-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-slate-400 tabular-nums">[{idx}]</span>
                      <span className="font-mono font-semibold text-slate-900">
                        {pet.species}("{pet.name}")
                      </span>
                    </div>
                    {polyPets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setPolyPets((prev) => prev.filter((p) => p.id !== pet.id));
                          setPolyDispatched(false);
                        }}
                        aria-label={`移除 ${pet.name}`}
                        className="rounded p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPolyDispatched(true)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-700 cursor-pointer"
              >
                <Play className="h-4 w-4" aria-hidden="true" />
                執行統一迴圈：for pet in pets: print(pet.speak())
              </button>
            </div>

            <div className="space-y-5 lg:col-span-6">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs sm:text-sm text-slate-200">
                <p className="text-slate-400"># 不需要寫 if isinstance(pet, Dog): ...</p>
                <p className="mt-1 text-sky-300">for pet in pets:</p>
                <p className="pl-4 text-emerald-300">print(pet.speak())  # 動態分派對應類別的方法</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold text-slate-700">
                  多型動態分派結果 (Runtime Dispatch Output)
                </p>
                {polyDispatched ? (
                  <div className="mt-3 divide-y divide-slate-100">
                    {polyPets.map((pet) => (
                      <div key={pet.id} className="flex flex-col gap-1 py-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-mono text-xs text-slate-500">
                          {pet.species}.speak()
                        </span>
                        <span className="text-sm font-medium text-emerald-800">
                          {pet.output}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-slate-500">
                    點擊左側「執行統一迴圈」按鈕，觀察 Python 如何在不檢查型別的情況下呼叫各物件自己的 speak() 實作。
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ENCAPSULATION */}
        {activeTab === 'encapsulation' && (
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-sky-600" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-slate-900">
                  以 @property 守護私有屬性 __balance
                </h3>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                如果開放外部直接寫 <code className="font-mono">acc.balance = -9999</code>，程式資料就會遭破壞。透過私有屬性 <code className="font-mono">self.__balance</code> 搭配 <code className="font-mono">@property</code> setter，我們能在賦值瞬間驗證合法性。
              </p>

              <form onSubmit={handleTrySetBalance} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="vault-input" className="block text-xs font-semibold text-slate-700">
                    嘗試執行 <code className="font-mono text-sky-700">vault.balance = 數值</code>（試試輸入負數如 -500）
                  </label>
                  <div className="mt-2 flex gap-2">
                    <input
                      id="vault-input"
                      type="text"
                      value={depositInput}
                      onChange={(e) => setDepositInput(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-sky-600 focus:bg-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-700 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      寫入屬性
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <button
                      type="button"
                      onClick={() => setDepositInput('8500')}
                      className="underline underline-offset-2 hover:text-sky-700 cursor-pointer"
                    >
                      填入合法值 8500
                    </button>
                    <button
                      type="button"
                      onClick={() => setDepositInput('-500')}
                      className="underline underline-offset-2 hover:text-red-700 cursor-pointer"
                    >
                      測試非法負值 -500
                    </button>
                  </div>
                </div>
              </form>

              <div
                className={`mt-5 flex items-start gap-2.5 rounded-lg border px-4 py-3 text-xs font-medium ${
                  vaultFeedback.ok
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border-red-200 bg-red-50 text-red-900'
                }`}
              >
                {vaultFeedback.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-700" aria-hidden="true" />
                )}
                <span className="leading-relaxed">{vaultFeedback.message}</span>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4 flex items-center justify-between text-xs">
                <span className="text-slate-600">
                  目前金庫安全餘額：<strong className="font-mono text-slate-900 tabular-nums">{vaultBalance} 元</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowMangledName((v) => !v)}
                  className="font-semibold text-sky-700 hover:underline cursor-pointer"
                >
                  {showMangledName ? '隱藏底層名稱修飾' : '檢視 Name Mangling 底層名稱'}
                </button>
              </div>
              {showMangledName && (
                <p className="mt-2 font-mono text-xs text-slate-600">
                  Python 內部將 self.__balance 自動改名為 _Vault__balance（目前值：{vaultBalance}），避免外部直接誤觸。
                </p>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-200 lg:col-span-6">
              <pre className="overflow-x-auto">
                <code>{`class Vault:
    def __init__(self, initial):
        self.__balance = initial    # 雙底線私有屬性

    @property
    def balance(self):              # Getter：允許安全讀取
        return self.__balance

    @balance.setter
    def balance(self, value):       # Setter：把關合法範圍
        if value < 0:
            raise ValueError("餘額不可為負數")
        self.__balance = value

vault = Vault(5000)
vault.balance = ${depositInput || '0'}  # 自動觸發 @balance.setter`}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
