export interface BlueprintTemplate {
  id: 'robot' | 'bank' | 'hero';
  title: string;
  className: string;
  subtitle: string;
  classAttrName: string;
  classAttrOptions: string[];
  defaultClassAttr: string;
  varPrefix: string;
  param1Label: string;
  param1Key: string;
  param1DefaultOptions: string[];
  param2Label: string;
  param2Key: string;
  param2Unit: string;
  param2Min: number;
  param2Max: number;
  param2Step: number;
  param2Default: number;
  param3Label: string;
  param3Key: string;
  param3Options: { label: string; value: string; accent: string }[];
  methods: {
    id: string;
    label: string;
    pythonCall: string;
    description: string;
  }[];
  codeLines: {
    lineNum: number;
    text: string;
    role: 'class_header' | 'class_attr' | 'init_def' | 'init_body' | 'method1' | 'method2' | 'blank';
  }[];
}

export const BLUEPRINT_TEMPLATES: BlueprintTemplate[] = [
  {
    id: 'robot',
    title: '機器人 Robot',
    className: 'Robot',
    subtitle: '展現共用工廠屬性與獨立電量狀態的最佳範例',
    classAttrName: 'manufacturer',
    classAttrOptions: ['PyLabs', 'TaipeiTech', 'FormosaAI'],
    defaultClassAttr: 'PyLabs',
    varPrefix: 'bot',
    param1Label: '機器人名稱 (name)',
    param1Key: 'name',
    param1DefaultOptions: ['阿波羅', '小藍', '瓦力', '探險號'],
    param2Label: '初始電量 (battery)',
    param2Key: 'battery',
    param2Unit: '%',
    param2Min: 10,
    param2Max: 100,
    param2Step: 10,
    param2Default: 70,
    param3Label: '任務模式 (mode)',
    param3Key: 'mode',
    param3Options: [
      { label: '巡邏模式', value: '巡邏', accent: 'sky' },
      { label: '搬運模式', value: '搬運', accent: 'emerald' },
      { label: '節能模式', value: '節能', accent: 'amber' },
    ],
    methods: [
      {
        id: 'work',
        label: '執行任務 work()',
        pythonCall: '.work()',
        description: '消耗 20% 電量並回報目前任務狀態',
      },
      {
        id: 'charge',
        label: '充電 charge(25)',
        pythonCall: '.charge(25)',
        description: '為該物件實體增加 25% 電量（上限 100%）',
      },
      {
        id: 'greet',
        label: '自我介紹 greet()',
        pythonCall: '.greet()',
        description: '同時讀取 self.name 與類別屬性 manufacturer',
      },
    ],
    codeLines: [
      { lineNum: 1, text: 'class Robot:', role: 'class_header' },
      { lineNum: 2, text: '    manufacturer = "{CLASS_ATTR}"  # 類別屬性：所有實體共用', role: 'class_attr' },
      { lineNum: 3, text: '', role: 'blank' },
      { lineNum: 4, text: '    def __init__(self, name, battery, mode):', role: 'init_def' },
      { lineNum: 5, text: '        self.name = name        # 實體屬性：專屬該物件', role: 'init_body' },
      { lineNum: 6, text: '        self.battery = battery', role: 'init_body' },
      { lineNum: 7, text: '        self.mode = mode', role: 'init_body' },
      { lineNum: 8, text: '', role: 'blank' },
      { lineNum: 9, text: '    def work(self):', role: 'method1' },
      { lineNum: 10, text: '        if self.battery >= 20:', role: 'method1' },
      { lineNum: 11, text: '            self.battery -= 20', role: 'method1' },
      { lineNum: 12, text: '            print(f"{self.name} 完成{self.mode}任務，剩餘 {self.battery}%")', role: 'method1' },
      { lineNum: 13, text: '', role: 'blank' },
      { lineNum: 14, text: '    def charge(self, amount):', role: 'method2' },
      { lineNum: 15, text: '        self.battery = min(100, self.battery + amount)', role: 'method2' },
      { lineNum: 16, text: '        print(f"{self.name} 已充電至 {self.battery}%")', role: 'method2' },
    ],
  },
  {
    id: 'bank',
    title: '銀行帳戶 BankAccount',
    className: 'BankAccount',
    subtitle: '模擬每個帳戶各自維護餘額狀態與存取款邏輯',
    classAttrName: 'bank_name',
    classAttrOptions: ['玉山數位銀行', '台新模擬金庫', 'Python 聯合銀行'],
    defaultClassAttr: '玉山數位銀行',
    varPrefix: 'acc',
    param1Label: '戶名 (owner)',
    param1Key: 'owner',
    param1DefaultOptions: ['王小明', '林雅婷', '陳志豪', '張家瑋'],
    param2Label: '開戶餘額 (balance)',
    param2Key: 'balance',
    param2Unit: ' 元',
    param2Min: 1000,
    param2Max: 10000,
    param2Step: 500,
    param2Default: 3500,
    param3Label: '帳戶等級 (tier)',
    param3Key: 'tier',
    param3Options: [
      { label: '一般活存', value: '一般', accent: 'sky' },
      { label: '薪轉優惠', value: '薪轉', accent: 'emerald' },
      { label: '貴賓理財', value: '貴賓', accent: 'amber' },
    ],
    methods: [
      {
        id: 'deposit',
        label: '存款 deposit(1000)',
        pythonCall: '.deposit(1000)',
        description: '增加該帳戶物件的餘額 1000 元',
      },
      {
        id: 'withdraw',
        label: '提款 withdraw(800)',
        pythonCall: '.withdraw(800)',
        description: '檢查餘額是否足夠後扣除 800 元',
      },
      {
        id: 'summary',
        label: '列印明細 summary()',
        pythonCall: '.summary()',
        description: '顯示銀行名稱、戶名與目前帳戶餘額',
      },
    ],
    codeLines: [
      { lineNum: 1, text: 'class BankAccount:', role: 'class_header' },
      { lineNum: 2, text: '    bank_name = "{CLASS_ATTR}"  # 類別屬性', role: 'class_attr' },
      { lineNum: 3, text: '', role: 'blank' },
      { lineNum: 4, text: '    def __init__(self, owner, balance, tier):', role: 'init_def' },
      { lineNum: 5, text: '        self.owner = owner', role: 'init_body' },
      { lineNum: 6, text: '        self.balance = balance', role: 'init_body' },
      { lineNum: 7, text: '        self.tier = tier', role: 'init_body' },
      { lineNum: 8, text: '', role: 'blank' },
      { lineNum: 9, text: '    def deposit(self, amount):', role: 'method1' },
      { lineNum: 10, text: '        self.balance += amount', role: 'method1' },
      { lineNum: 11, text: '        print(f"{self.owner} 存入 {amount} 元，餘額 {self.balance} 元")', role: 'method1' },
      { lineNum: 12, text: '', role: 'blank' },
      { lineNum: 13, text: '    def withdraw(self, amount):', role: 'method2' },
      { lineNum: 14, text: '        if self.balance >= amount:', role: 'method2' },
      { lineNum: 15, text: '            self.balance -= amount', role: 'method2' },
      { lineNum: 16, text: '            print(f"{self.owner} 提領 {amount} 元，餘額 {self.balance} 元")', role: 'method2' },
    ],
  },
  {
    id: 'hero',
    title: '遊戲角色 Hero',
    className: 'Hero',
    subtitle: '以 RPG 角色理解物件生命值、職業屬性與互動技能',
    classAttrName: 'world_server',
    classAttrOptions: ['艾爾登伺服器', '亞特蘭提斯', '星辰峽谷'],
    defaultClassAttr: '艾爾登伺服器',
    varPrefix: 'hero',
    param1Label: '角色暱稱 (name)',
    param1Key: 'name',
    param1DefaultOptions: ['亞瑟', '艾莉絲', '雷歐', '芙蕾雅'],
    param2Label: '生命值 (hp)',
    param2Key: 'hp',
    param2Unit: ' HP',
    param2Min: 40,
    param2Max: 200,
    param2Step: 20,
    param2Default: 120,
    param3Label: '職業定位 (role)',
    param3Key: 'role',
    param3Options: [
      { label: '聖騎士', value: '聖騎士', accent: 'sky' },
      { label: '遊俠', value: '遊俠', accent: 'emerald' },
      { label: '魔導士', value: '魔導士', accent: 'amber' },
    ],
    methods: [
      {
        id: 'quest',
        label: '受擊 take_damage(30)',
        pythonCall: '.take_damage(30)',
        description: '扣除該角色 30 點生命值（最低為 0）',
      },
      {
        id: 'heal',
        label: '治療 heal(40)',
        pythonCall: '.heal(40)',
        description: '為該角色回復 40 點生命值',
      },
      {
        id: 'status',
        label: '查看狀態 status()',
        pythonCall: '.status()',
        description: '印出角色所屬伺服器、職業與目前 HP',
      },
    ],
    codeLines: [
      { lineNum: 1, text: 'class Hero:', role: 'class_header' },
      { lineNum: 2, text: '    world_server = "{CLASS_ATTR}"  # 類別屬性', role: 'class_attr' },
      { lineNum: 3, text: '', role: 'blank' },
      { lineNum: 4, text: '    def __init__(self, name, hp, role):', role: 'init_def' },
      { lineNum: 5, text: '        self.name = name', role: 'init_body' },
      { lineNum: 6, text: '        self.hp = hp', role: 'init_body' },
      { lineNum: 7, text: '        self.role = role', role: 'init_body' },
      { lineNum: 8, text: '', role: 'blank' },
      { lineNum: 9, text: '    def take_damage(self, dmg):', role: 'method1' },
      { lineNum: 10, text: '        self.hp = max(0, self.hp - dmg)', role: 'method1' },
      { lineNum: 11, text: '        print(f"{self.name} 受到 {dmg} 傷害，剩餘 {self.hp} HP")', role: 'method1' },
      { lineNum: 12, text: '', role: 'blank' },
      { lineNum: 13, text: '    def heal(self, amount):', role: 'method2' },
      { lineNum: 14, text: '        self.hp = min(200, self.hp + amount)', role: 'method2' },
      { lineNum: 15, text: '        print(f"{self.name} 回復 {amount} HP，目前 {self.hp} HP")', role: 'method2' },
    ],
  },
];

export interface InitStep {
  step: number;
  title: string;
  summary: string;
  activeLine: number;
  memoryAllocated: boolean;
  selfBound: boolean;
  attrsWritten: boolean;
  varLinked: boolean;
  highlightNote: string;
}

export const INIT_STEPS: InitStep[] = [
  {
    step: 1,
    title: '步驟 01 · 配置全新記憶體空間',
    summary: '當你寫下 Dog("Mochi", 3) 時，Python 先在堆積記憶體 (Heap) 建立一個空的 Dog 實體，並賦予獨立位址 0x7F01。',
    activeLine: 7,
    memoryAllocated: true,
    selfBound: false,
    attrsWritten: false,
    varLinked: false,
    highlightNote: '此時物件內部還是空的，尚未寫入任何屬性資料。',
  },
  {
    step: 2,
    title: '步驟 02 · 自動呼叫 __init__ 並傳入 self',
    summary: 'Python 自動觸發建構子 __init__，並默默將剛剛建立的記憶體位址 0x7F01 作為第一個參數傳給 self。',
    activeLine: 2,
    memoryAllocated: true,
    selfBound: true,
    attrsWritten: false,
    varLinked: false,
    highlightNote: 'self 不是關鍵字，而是代表「正在初始化的那個物件自己」。',
  },
  {
    step: 3,
    title: '步驟 03 · 寫入實體屬性到 self',
    summary: '透過 self.name = name 與 self.age = age，將傳入的 "Mochi" 與 3 寫入 0x7F01 的專屬屬性字典中。',
    activeLine: 3,
    memoryAllocated: true,
    selfBound: true,
    attrsWritten: true,
    varLinked: false,
    highlightNote: '若未來再建立 second_dog = Dog("Boba", 1)，它會寫入另一個位址，互不干擾。',
  },
  {
    step: 4,
    title: '步驟 04 · 回傳參考並綁定變數 my_dog',
    summary: '__init__ 執行結束後不需寫 return，Python 自動把 0x7F01 的參考回傳給左側變數 my_dog。',
    activeLine: 7,
    memoryAllocated: true,
    selfBound: true,
    attrsWritten: true,
    varLinked: true,
    highlightNote: '之後呼叫 my_dog.bark()，Python 就會自動把 my_dog (0x7F01) 當成 self 傳進方法裡。',
  },
];

export interface InheritanceChild {
  id: 'dog' | 'cat' | 'bird';
  className: string;
  zhName: string;
  extraAttrName: string;
  extraAttrValue: string;
  overrideSound: string;
  uniqueMethod: string;
  uniqueOutput: string;
  codePreview: string;
}

export const INHERITANCE_CHILDREN: InheritanceChild[] = [
  {
    id: 'dog',
    className: 'Dog',
    zhName: '犬科子類別',
    extraAttrName: 'breed',
    extraAttrValue: '"柴犬"',
    overrideSound: '汪汪！我是柴犬 Mochi',
    uniqueMethod: 'fetch()',
    uniqueOutput: 'Mochi 飛奔出去撿回了飛盤！',
    codePreview: `class Dog(Animal):
    def __init__(self, name, breed):
        super().__init__(name)   # 繼承父類別的 name 設定
        self.breed = breed       # 擴充子類別專屬屬性

    def speak(self):             # 覆寫 (Override) 父類別方法
        return f"汪汪！我是{self.breed} {self.name}"

    def fetch(self):             # 子類別新增的方法
        return f"{self.name} 飛奔出去撿回了飛盤！"`,
  },
  {
    id: 'cat',
    className: 'Cat',
    zhName: '貓科子類別',
    extraAttrName: 'indoor',
    extraAttrValue: 'True',
    overrideSound: '喵嗚～Mochi 正在窗台曬太陽',
    uniqueMethod: 'purr()',
    uniqueOutput: 'Mochi 發出了滿足的呼嚕聲。',
    codePreview: `class Cat(Animal):
    def __init__(self, name, indoor=True):
        super().__init__(name)
        self.indoor = indoor

    def speak(self):
        return f"喵嗚～{self.name} 正在窗台曬太陽"

    def purr(self):
        return f"{self.name} 發出了滿足的呼嚕聲。"`,
  },
  {
    id: 'bird',
    className: 'Bird',
    zhName: '鳥類子類別',
    extraAttrName: 'can_fly',
    extraAttrValue: 'True',
    overrideSound: '啾啾！Mochi 在樹梢高歌',
    uniqueMethod: 'fly()',
    uniqueOutput: 'Mochi 展開翅膀飛向天空！',
    codePreview: `class Bird(Animal):
    def __init__(self, name, can_fly=True):
        super().__init__(name)
        self.can_fly = can_fly

    def speak(self):
        return f"啾啾！{self.name} 在樹梢高歌"

    def fly(self):
        return f"{self.name} 展開翅膀飛向天空！"`,
  },
];

export interface CodeChallenge {
  id: string;
  title: string;
  topic: string;
  prompt: string;
  prefixCode: string;
  blankLabel: string;
  placeholder: string;
  suffixCode: string;
  hint: string;
  expectedRegexes: RegExp[];
  successOutput: string;
  failureFeedback: (input: string) => string;
}

export const CODE_CHALLENGES: CodeChallenge[] = [
  {
    id: 'c1',
    title: '任務 01 · 完成 Book 類別的 __init__ 建構子',
    topic: '建構子與 self',
    prompt: '請在下方空白處填入正確的程式碼，將傳入的 title 參數綁定到目前物件的 title 實體屬性上。',
    prefixCode: `class Book:
    def __init__(self, title, pages):`,
    blankLabel: '補齊屬性綁定程式碼',
    placeholder: 'self.title = title',
    suffixCode: `        self.pages = pages

novel = Book("Python 物件設計", 320)
print(novel.title, novel.pages)`,
    hint: '在 __init__ 裡，必須透過 self.屬性名稱 = 參數名稱，才能把資料存進這個物件實體中。',
    expectedRegexes: [/^\s*self\.title\s*=\s*title\s*$/],
    successOutput: 'Python 物件設計 320',
    failureFeedback: (input) => {
      if (!input.includes('self.')) {
        return '少了 self. 前綴！若只寫 title = title，變數只會暫存在函式區域裡，物件實體讀不到它。';
      }
      if (!input.includes('= title')) {
        return '請確認等號右側是傳入的參數名稱 title。';
      }
      return '請依照標準指派格式撰寫：self.title = title';
    },
  },
  {
    id: 'c2',
    title: '任務 02 · 實作 Counter 計數器的累加方法',
    topic: '實體方法與狀態修改',
    prompt: '請補齊 add() 方法的定義行（記得任何實體方法的第一個參數都必須接收物件本身）。',
    prefixCode: `class Counter:
    def __init__(self):
        self.count = 0
`,
    blankLabel: '填入 add 方法的 def 宣告行',
    placeholder: 'def add(self, step):',
    suffixCode: `        self.count += step
        return self.count

c = Counter()
print(c.add(5))`,
    hint: '方法名稱是 add，除了第一個參數 self 外，下方程式碼有用到 step 變數，記得加上冒號 :。',
    expectedRegexes: [/^\s*def\s+add\s*\(\s*self\s*,\s*step\s*\)\s*:\s*$/],
    successOutput: '5',
    failureFeedback: (input) => {
      if (!input.trim().startsWith('def ')) {
        return '定義方法需要使用 def 關鍵字開頭。';
      }
      if (!input.includes('self')) {
        return 'Python 實體方法的第一個參數必須是 self，才能在方法內存取 self.count。';
      }
      if (!input.includes('step')) {
        return '方法主體使用了 step 變數，請在參數列加入 step。';
      }
      if (!input.trim().endsWith(':')) {
        return '別忘了在 def 宣告行的最後加上冒號 : 喔！';
      }
      return '請確認格式為 def add(self, step):';
    },
  },
  {
    id: 'c3',
    title: '任務 03 · 使用 super() 繼承父類別初始化邏輯',
    topic: '繼承與 super()',
    prompt: 'ElectricCar 繼承了 Car。請在下方填入呼叫父類別 __init__ 並傳入 brand 的語法。',
    prefixCode: `class Car:
    def __init__(self, brand):
        self.brand = brand

class ElectricCar(Car):
    def __init__(self, brand, battery_kwh):`,
    blankLabel: '呼叫父類別建構子',
    placeholder: 'super().__init__(brand)',
    suffixCode: `        self.battery_kwh = battery_kwh

ev = ElectricCar("Luxgen", 60)
print(f"{ev.brand} - {ev.battery_kwh}kWh")`,
    hint: '使用 super().__init__(...) 就能直接借用父類別 Car 的初始化程式碼，且不需要再手動傳入 self。',
    expectedRegexes: [/^\s*super\s*\(\s*\)\s*\.__init__\s*\(\s*brand\s*\)\s*$/],
    successOutput: 'Luxgen - 60kWh',
    failureFeedback: (input) => {
      if (input.includes('self')) {
        return '使用 super().__init__(brand) 時，Python 會自動綁定 self，不需要也不應該在括號內傳入 self。';
      }
      if (!input.includes('super()')) {
        return '建議使用內建函式 super() 來呼叫父類別的 __init__ 方法。';
      }
      return '請確認語法為 super().__init__(brand)';
    },
  },
];

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: '類別與物件本質',
    question: '在 Python 物件導向設計中，下列關於「Class（類別）」與「Object（物件）」的敘述何者正確？',
    options: [
      'Class 是佔用實際記憶體資料的個體，Object 只是純文字註解',
      'Class 如同設計藍圖，透過呼叫類別可以建立出多個擁有獨立記憶體狀態的 Object',
      '一個 Class 最多只能建立出一個 Object 實體',
      'Object 必須在程式執行前手動用 malloc 配置記憶體',
    ],
    correctIndex: 1,
    explanation: 'Class 定義了物件應具備的屬性結構與方法（藍圖）；每次呼叫 Class() 都會實例化出一個擁有獨立資料狀態的 Object 實體。',
  },
  {
    id: 'q2',
    topic: '__init__ 與 self',
    question: '在類別的方法定義 `def greet(self):` 中，參數 `self` 代表什麼意義？',
    options: [
      '代表整個 Class 類別本身，與任何實體無關',
      '代表目前正在呼叫這個方法的那一個物件實體本身',
      '代表 Python 內建的全域變數集合',
      '是強制規定的保留關鍵字，不可出現在方法以外的地方',
    ],
    correctIndex: 1,
    explanation: '呼叫 obj.greet() 時，Python 會自動把 obj 當作第一個引數傳入 self，讓方法內部能讀寫「這個物件自己」的屬性。',
  },
  {
    id: 'q3',
    topic: '類別屬性 vs 實體屬性',
    question: '執行以下程式碼後，畫面會印出什麼結果？',
    codeSnippet: `class Cat:
    species = "Felis catus"
    def __init__(self, name):
        self.name = name

c1 = Cat("橘橘")
c2 = Cat("黑糖")
Cat.species = "家貓"
print(c1.species, c2.name)`,
    options: [
      'Felis catus 黑糖',
      '家貓 橘橘',
      '家貓 黑糖',
      '程式會發生 AttributeError 錯誤',
    ],
    correctIndex: 2,
    explanation: 'species 是定義在類別層級的「類別屬性」，當修改 Cat.species = "家貓" 時，所有未覆寫該屬性的實體都會同步反映新值；而 c2.name 則是各自獨立的 "黑糖"。',
  },
  {
    id: 'q4',
    topic: '繼承與方法覆寫',
    question: '當子類別定義了與父類別完全同名的 `speak(self)` 方法時，這在物件導向稱為什麼機制？',
    options: [
      '方法覆寫（Method Overriding）',
      '屬性封裝（Encapsulation）',
      '名稱修飾（Name Mangling）',
      '建構子解構（Destruction）',
    ],
    correctIndex: 0,
    explanation: '子類別重新實作父類別已有的方法稱為「方法覆寫（Method Overriding）」，呼叫子類別物件的該方法時會優先執行子類別版本。',
  },
  {
    id: 'q5',
    topic: '封裝與私有屬性',
    question: '在 Python 中，若在屬性名稱前加上雙底線（例如 `self.__balance`），會發生什麼事？',
    options: [
      '該屬性會變成唯讀常數，連類別內部都無法修改',
      'Python 會觸發名稱修飾（Name Mangling），將其改寫為 _ClassName__balance 以防止外部誤改',
      '該屬性會自動加密並儲存到磁碟中',
      '建立物件時會略過這個屬性不進行初始化',
    ],
    correctIndex: 1,
    explanation: '雙底線會觸發 Name Mangling（如 _BankAccount__balance），提醒開發者不應從外部直接竄改內部狀態，通常搭配 @property 使用。',
  },
  {
    id: 'q6',
    topic: '多型 Polymorphism',
    question: '有一個清單 `animals = [Dog("小白"), Cat("小花")]`，當執行 `for a in animals: a.speak()` 時，為何能各自發出不同叫聲？',
    options: [
      '因為 Python 在執行前會自動把所有類別合併成單一類別',
      '因為多型（Polymorphism）允許不同類別實作相同名稱的方法介面，呼叫時依實際物件型別動態分派',
      '因為 for 迴圈會自動猜測開發者的意圖並替換函式名稱',
      '這段程式在 Python 中無法執行，必須先用 if isinstance() 判斷型別才能呼叫',
    ],
    correctIndex: 1,
    explanation: '這正是多型與鴨子型別（Duck Typing）的威力：只要物件實作了 speak() 方法，統一呼叫介面就能依據各物件的實際類別展現不同行為。',
  },
];
