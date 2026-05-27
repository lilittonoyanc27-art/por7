/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Check, 
  X, 
  RefreshCw, 
  Volume2, 
  HelpCircle, 
  ClipboardCheck, 
  Search, 
  AlertTriangle, 
  Bookmark, 
  CheckCircle2, 
  ChevronRight, 
  Award,
  BookMarked,
  Info
} from 'lucide-react';

// Define structures for our Exercise 68 (Sentence Constructor)
interface Noun {
  spanish: string;
  armenian: string;
  gender: 'M' | 'F';
  number: 'S' | 'P';
  english: string;
}

interface AdjectiveBase {
  base: string;
  armenian: string;
  specialRules?: string; // e.g.grande only changes in number
}

// Data according to Column 2 of image & prompt
const nouns: Noun[] = [
  { spanish: 'un baño', armenian: 'լոգասենյակ', gender: 'M', number: 'S', english: 'a bathroom' },
  { spanish: 'unos dormitorios', armenian: 'ննջասենյակներ', gender: 'M', number: 'P', english: 'some bedrooms' },
  { spanish: 'una cocina', armenian: 'խոհանոց', gender: 'F', number: 'S', english: 'a kitchen' },
  { spanish: 'un salón', armenian: 'հյուրասենյակ', gender: 'M', number: 'S', english: 'a living room' },
  { spanish: 'unos armarios', armenian: 'պահարաններ', gender: 'M', number: 'P', english: 'some wardrobes' },
  { spanish: 'un piso', armenian: 'բնակարան', gender: 'M', number: 'S', english: 'an apartment' },
  { spanish: 'un escritorio', armenian: 'գրասեղան', gender: 'M', number: 'S', english: 'a desk' },
  { spanish: 'unas estanterías', armenian: 'դարակաշարեր', gender: 'F', number: 'P', english: 'some bookshelves' },
];

const intensifiers = [
  { spanish: 'muy', armenian: 'շատ' },
  { spanish: 'un poco', armenian: 'մի քիչ' },
  { spanish: 'bastante', armenian: 'բավականին' },
  { spanish: 'demasiado', armenian: 'չափազանց' }
];

const adjectives: AdjectiveBase[] = [
  { base: 'pequeño', armenian: 'փոքր' },
  { base: 'grande', armenian: 'մեծ' },
  { base: 'cómodo', armenian: 'հարմարավետ' },
  { base: 'bonito', armenian: 'գեղեցիկ' },
  { base: 'incómodo', armenian: 'անհարմար' }
];

// Helper to agree adjective ending with noun
function getAgreedAdjective(base: string, gender: 'M' | 'F', number: 'S' | 'P'): string {
  if (base === 'grande') {
    return number === 'S' ? 'grande' : 'grandes';
  }
  
  // Standard -o ending adjectives
  if (gender === 'M' && number === 'S') return base;
  if (gender === 'F' && number === 'S') return base.replace(/o$/, 'a');
  if (gender === 'M' && number === 'P') return base.replace(/o$/, 'os');
  if (gender === 'F' && number === 'P') return base.replace(/o$/, 'as');
  
  return base;
}

// Exercise 69 items
interface CardItem {
  spanish: string;
  armenian: string;
  category: 'phrase' | 'sentence';
}

const exercise69Cards: CardItem[] = [
  { spanish: 'demasiado incómodo', armenian: 'չափազանց անհարմար', category: 'phrase' },
  { spanish: 'no muy interesante', armenian: 'ոչ շատ հետաքրքիր', category: 'phrase' },
  { spanish: 'un poco cansados', armenian: 'մի քիչ հոգնած', category: 'phrase' },
  { spanish: 'no muy bonitos', armenian: 'ոչ շատ գեղեցիկ', category: 'phrase' },
  { spanish: 'bastante feas', armenian: 'բավականին տգեղ', category: 'phrase' },
  { spanish: 'demasiado fáciles', armenian: 'չափազանց հեշտ', category: 'phrase' },
  { spanish: 'un poco difícil', armenian: 'մի քիչ դժվար', category: 'phrase' },
  { spanish: 'bastante grande', armenian: 'բավականին մեծ', category: 'phrase' },
  { spanish: 'demasiado pequeño', armenian: 'չափազանց փոքր', category: 'phrase' },
  { spanish: 'Eres muy guapa.', armenian: 'Դու շատ գեղեցիկ ես։', category: 'sentence' },
  { spanish: 'Son demasiado grandes.', armenian: 'Դրանք / նրանք չափազանց մեծ են։', category: 'sentence' },
  { spanish: 'Julia es demasiado aburrida.', armenian: 'Խուլիան չափազանց ձանձրալի է։', category: 'sentence' },
  { spanish: 'Anita es muy inteligente.', armenian: 'Անիտան շատ խելացի է։', category: 'sentence' },
  { spanish: 'Somos bastante jóvenes.', armenian: 'Մենք բավականին երիտասարդ ենք։', category: 'sentence' },
  { spanish: 'No soy muy alto.', armenian: 'Ես շատ բարձրահասակ չեմ։', category: 'sentence' },
  { spanish: 'Estamos bastante cansados.', armenian: 'Մենք բավականին հոգնած ենք։', category: 'sentence' },
  { spanish: 'Está un poco delgada.', armenian: 'Նա մի քիչ նիհար է։', category: 'sentence' },
  { spanish: 'Están demasiado viejos.', armenian: 'Նրանք չափազանց հին են / շատ ծեր են։', category: 'sentence' },
  { spanish: 'Los deberes son demasiado difíciles.', armenian: 'Տնային առաջադրանքները չափազանց դժվար են։', category: 'sentence' }
];

export default function App() {
  const [activeTab, setActiveTab ] = useState<'guide' | 'constructor' | 'exercises' | 'cards'>('guide');
  
  // States for Sentence Constructor (Exercise 68)
  const [selectedVerb, setSelectedVerb] = useState<string>('Tenemos');
  const [selectedNounIdx, setSelectedNounIdx] = useState<number>(0);
  const [selectedIntensifier, setSelectedIntensifier] = useState<string>('muy');
  const [selectedAdjectiveBaseIdx, setSelectedAdjectiveBaseIdx] = useState<number>(0);
  const [userSelectedAdjectiveEnding, setUserSelectedAdjectiveEnding] = useState<string>('pequeño');
  const [constructorFeedback, setConstructorFeedback] = useState<{status: 'correct' | 'incorrect' | 'neutral', message: string, naturalMessage?: string} | null>(null);
  const [savedSentences, setSavedSentences] = useState<Array<{spanish: string, armenian: string}>>([
    { spanish: "Tenemos una cocina muy bonita.", armenian: "Մենք ունենք շատ գեղեցիկ խոհանոց:" }
  ]);

  // States for Extra Quiz exercises (6 exercises)
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean[]>(new Array(6).fill(false));
  const [quizAnswers, setQuizAnswers] = useState<any[]>(new Array(6).fill(null));
  const [quizFeedback, setQuizFeedback] = useState<string[]>(new Array(6).fill(''));

  // States for Flashcards (Exercise 69)
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});
  const [masteredCards, setMasteredCards] = useState<Record<number, boolean>>({});
  const [audioSupported, setAudioSupported] = useState<boolean>(true);
  const [cardFilter, setCardFilter] = useState<'all' | 'phrase' | 'sentence'>('all');

  // Speak sound helper using Web Speech API (if supported)
  const playSpeech = (text: string, lang = 'es-ES') => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    } else {
      setAudioSupported(false);
    }
  };

  // Auto calculate sentence construction outputs
  const calculatedNoun = nouns[selectedNounIdx];
  const calculatedAdjBase = adjectives[selectedAdjectiveBaseIdx];
  const expectedAdjectiveForm = useMemo(() => {
    return getAgreedAdjective(calculatedAdjBase.base, calculatedNoun.gender, calculatedNoun.number);
  }, [calculatedNoun, calculatedAdjBase]);

  // Handle checking of built sentence
  const handleCheckSentence = () => {
    const isCorrect = userSelectedAdjectiveEnding.toLowerCase() === expectedAdjectiveForm.toLowerCase();
    
    // Naturalness warning check from Rule 5
    let naturalMessage = "";
    const phraseCombination = `${selectedIntensifier} ${userSelectedAdjectiveEnding}`;
    
    if (phraseCombination === "un poco bonito" || phraseCombination === "un poco bonita" || phraseCombination === "un poco bonitos" || phraseCombination === "un poco bonitas") {
      naturalMessage = "⚠️ «un poco bonito» («մի քիչ գեղեցիկ») բնական չի հնչում: Ավելի լավ է՝ «muy bonito» կամ «bastante bonito»:";
    } else if (phraseCombination.startsWith("demasiado bonito")) {
      naturalMessage = "⚠️ «demasiado bonito» («չափազանց գեղեցիկ») քերականորեն ճիշտ է, բայց խոսակցականում քիչ է օգտագործվում:";
    } else if (phraseCombination.startsWith("demasiado cómodo")) {
      naturalMessage = "⚠️ «demasiado cómodo» («չափազանց հարմարավետ») սովորական խոսքում մի քիչ արհեստական կամ տարօրինակ է հնչում:";
    }

    if (isCorrect) {
      // Form Armenian translation on-the-fly
      const verbArm = selectedVerb === 'Tenemos' ? 'Մենք ունենք' : 'Նրանք ունեն';
      const intensifierArm = selectedIntensifier === 'muy' ? 'շատ' :
                             selectedIntensifier === 'un poco' ? 'մի քիչ' :
                             selectedIntensifier === 'bastante' ? 'բավականին' : 'չափազանց';
      const nounArm = calculatedNoun.armenian;
      const adjArm = calculatedAdjBase.armenian;

      // Construct Armenian sentence in a natural way:
      // Armenian order: [Verb] [Intensifier] [Adjective] [Noun]
      const constructedArmTranslation = `${verbArm} ${intensifierArm} ${adjArm} ${nounArm}։`;

      setConstructorFeedback({
        status: 'correct',
        message: `✅ Լիովին Ճիշտ է! «${selectedVerb} ${calculatedNoun.spanish} ${selectedIntensifier} ${userSelectedAdjectiveEnding}» կազմված է անթերի:`,
        naturalMessage: naturalMessage || undefined
      });
    } else {
      // Explanation based on rule 1 & 2
      const genderText = calculatedNoun.gender === 'M' ? 'արական' : 'իգական';
      const numberText = calculatedNoun.number === 'S' ? 'եզակի' : 'հոգնակի';
      
      setConstructorFeedback({
        status: 'incorrect',
        message: `❌ Սխալ համաձայնեցում: «${calculatedNoun.spanish}» գոյականը ${genderText} է և ${numberText}: Ուստի «${calculatedAdjBase.base}» ածականը պետք է ստանա համապատասխան ձևը:`,
        naturalMessage: `💡 Ճիշտ ձևն է՝ «${expectedAdjectiveForm}»: Փորձե՛ք ընտրել վերջավորության ճիշտ տարբերակը:`
      });
    }
  };

  // Add constructed sentence to user bookshelf
  const saveSentenceToBookshelf = () => {
    const verbArm = selectedVerb === 'Tenemos' ? 'Մենք ունենք' : 'Նրանք ունեն';
    const intensifierArm = selectedIntensifier === 'muy' ? 'շատ' :
                           selectedIntensifier === 'un poco' ? 'մի քիչ' :
                           selectedIntensifier === 'bastante' ? 'բավականին' : 'չափազանց';
    const nounArm = calculatedNoun.armenian;
    const adjArm = calculatedAdjBase.armenian;
    const constructedArmTranslation = `${verbArm} ${intensifierArm} ${adjArm} ${nounArm}։`;
    const fullSpanish = `${selectedVerb} ${calculatedNoun.spanish} ${selectedIntensifier} ${expectedAdjectiveForm}.`;

    if (!savedSentences.some(s => s.spanish === fullSpanish)) {
      setSavedSentences([...savedSentences, { spanish: fullSpanish, armenian: constructedArmTranslation }]);
    }
  };

  // Quiz evaluation
  const handleQuizSubmit = (index: number, answer: any, correctAnswer: any, explanation: string) => {
    const isCorrect = Array.isArray(answer)
      ? JSON.stringify(answer.sort()) === JSON.stringify(correctAnswer.sort())
      : answer === correctAnswer;

    const newSubmitted = [...quizSubmitted];
    newSubmitted[index] = true;
    setQuizSubmitted(newSubmitted);

    const newAnswers = [...quizAnswers];
    newAnswers[index] = answer;
    setQuizAnswers(newAnswers);

    const newFeedback = [...quizFeedback];
    if (isCorrect) {
      newFeedback[index] = `✅ Ճիշտ է! ${explanation}`;
      setQuizScore(prev => prev + 1);
    } else {
      newFeedback[index] = `❌ Սխալ է: Ճիշտ պատասխանն էր «${Array.isArray(correctAnswer) ? correctAnswer.join(' ') : correctAnswer}»: ${explanation}`;
    }
    setQuizFeedback(newFeedback);
  };

  const resetQuiz = () => {
    setQuizScore(0);
    setQuizSubmitted(new Array(6).fill(false));
    setQuizAnswers(new Array(6).fill(null));
    setQuizFeedback(new Array(6).fill(''));
  };

  // Flip card helper
  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleMastered = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid flipping when clicking checkmark
    setMasteredCards(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-[#f0f4f8] text-slate-800 font-sans flex flex-col antialiased px-3 md:px-6">
      {/* Dynamic Header (Vibrant Palette Theme) */}
      <header className="max-w-7xl mx-auto w-full bg-white px-5 py-5 md:px-8 md:py-6 rounded-3xl shadow-sm border-b-4 border-blue-100/90 flex flex-col gap-5 mt-4 md:mt-6 transition-all">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-yellow-300 to-yellow-400 rounded-full flex items-center justify-center text-2xl shadow-md shrink-0 select-none">
              🇪🇸
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="bg-blue-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wide">ԱՐՄ &rarr; ԻՍՊ</span>
                <span className="text-blue-600/80 text-xs font-bold">Ինտերակտիվ նախագծիչ</span>
              </div>
              <h1 id="app-title" className="text-xl md:text-2xl font-black tracking-tight text-slate-800">
                Իսպաներենի Քերականության Լաբորատորիա
              </h1>
              <p className="text-slate-500 text-xs font-medium">
                Կառուցվածք՝ <span className="font-mono bg-slate-100 px-1 py-0.2 rounded text-slate-700 font-bold">Tenemos / Tienen + Noun + Adverb + Adj</span>
              </p>
            </div>
          </div>
          
          {/* Quick stats panel in Vibrant Theme colors (Blues and greens) */}
          <div className="flex gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 max-w-sm self-start md:self-center">
            <div className="text-center px-3 py-1 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="text-blue-600 font-extrabold text-base">{savedSentences.length}</div>
              <div className="text-[9px] text-slate-400 uppercase font-black tracking-wide">Կազմված</div>
            </div>
            <div className="text-center px-3 py-1 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="text-emerald-600 font-extrabold text-base">
                {Object.values(masteredCards).filter(Boolean).length}/19
              </div>
              <div className="text-[9px] text-slate-400 uppercase font-black tracking-wide">Սերտած</div>
            </div>
            <div className="text-center px-3 py-1 bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="text-violet-600 font-extrabold text-base">{quizScore}/6</div>
              <div className="text-[9px] text-slate-400 uppercase font-black tracking-wide">Թեստ</div>
            </div>
          </div>
        </div>

        {/* Tab buttons - Styled matching custom vibrant aesthetics */}
        <nav className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-4" id="main-navigation">
          <button
            id="btn-tab-guide"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen size={16} />
            📖 Քերականության Կանոններ
          </button>
          
          <button
            id="btn-tab-constructor"
            onClick={() => setActiveTab('constructor')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'constructor'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Sparkles size={16} />
            🛠️ Նախադասության Կոնստրուկտոր (68)
          </button>
          
          <button
            id="btn-tab-exercises"
            onClick={() => setActiveTab('exercises')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'exercises'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ClipboardCheck size={16} />
            📝 6 Հավելյալ Վարժություններ
          </button>
          
          <button
            id="btn-tab-cards"
            onClick={() => setActiveTab('cards')}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-black transition-all cursor-pointer ${
              activeTab === 'cards'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookMarked size={16} />
            🎴 Թարգմանության Խաղ (69)
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 md:py-8">
        
        {/* Tab 1: Interactive Grammar Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6" id="section-grammar-guide">
            {/* Introduction Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="bg-violet-100 text-violet-700 p-3 rounded-xl">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">Այո, բացատրեմ հայերենով։</h2>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                    Այս վարժությունում պետք է կազմել նախադասություններ այս ձևով․
                  </p>
                  <div className="mt-3 bg-violet-50/70 border border-violet-100 p-4 rounded-xl inline-block">
                    <span className="font-black text-violet-800 text-base md:text-lg">
                      Tenemos / Tienen + գոյական + ուժեղացնող բառ + ածական
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-slate-500 text-xs md:text-sm">
                    <span className="font-bold text-emerald-600">Օրինակ՝</span>
                    <strong className="text-slate-700">Tenemos una cocina muy bonita.</strong>
                    <span>—</span>
                    <span className="italic">Մենք ունենք շատ գեղեցիկ խոհանոց։</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid of Grammar Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Rules 1 & 2: Agreement Rules */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">1</span>
                  <h3 className="font-extrabold text-slate-950 text-base md:text-lg">Ամենակարևոր կանոնը</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Իսպաներենում ածականը պետք է համաձայնի գոյականի հետ՝
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-xs text-rose-500 font-bold block mb-1">սեռով</span>
                    <span className="font-extrabold text-sm text-slate-800">արական / իգական</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-xs text-blue-500 font-bold block mb-1">թվով</span>
                    <span className="font-extrabold text-sm text-slate-800">եզակի / հոգնակի</span>
                  </div>
                </div>
                
                <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-3 space-y-1.5 text-xs">
                  <div className="font-bold text-emerald-800 mb-1 inline-block bg-emerald-100 px-2 py-0.5 rounded">Օրինակներ`</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                      <strong className="font-mono">un baño pequeño</strong>
                      <span className="text-slate-500">փոքր լոգասենյակ</span>
                    </div>
                    <div className="flex justify-between border-b border-emerald-100/50 pb-1">
                      <strong className="font-mono text-purple-700">una cocina pequeña</strong>
                      <span className="text-slate-500">փոքր խոհանոց</span>
                    </div>
                    <div className="flex justify-between">
                      <strong className="font-mono text-blue-800">unos dormitorios pequeños</strong>
                      <span className="text-slate-500">փոքր ննջասենյակներ</span>
                    </div>
                    <div className="flex justify-between">
                      <strong className="font-mono text-pink-700">unas estanterías pequeñas</strong>
                      <span className="text-slate-500">փոքր դարակաշարեր</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 mt-2">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2 mb-2">
                    <span className="bg-rose-100 text-rose-700 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">2</span>
                    <h3 className="font-extrabold text-slate-950 text-base">Ինչը չի կարելի գրել (Սխալներ)</h3>
                  </div>
                  <p className="text-slate-600 text-xs mb-3">
                    Սխալ է, եթե ածականը չի համապատասխանում գոյականին։
                  </p>
                  
                  <div className="space-y-2 text-xs">
                    <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <div>
                        <span className="line-through text-slate-500 font-mono">una cocina pequeño</span> — սխալ է
                        <div className="text-slate-800 font-semibold mt-0.5">
                          Պետք է՝ <strong className="text-emerald-700 font-mono">una cocina pequeña</strong> (որովհետև cocina իգական է)
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <div>
                        <span className="line-through text-slate-500 font-mono">unos dormitorios bonito</span> — սխալ է
                        <div className="text-slate-800 font-semibold mt-0.5">
                          Պետք է՝ <strong className="text-emerald-700 font-mono">unos dormitorios bonitos</strong> (որովհետև dormitorios արական հոգնակի է)
                        </div>
                      </div>
                    </div>

                    <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-lg flex items-start gap-2">
                      <span className="text-rose-500 font-bold">✕</span>
                      <div>
                        <span className="line-through text-slate-500 font-mono">unas estanterías cómodo</span> — սխալ է
                        <div className="text-slate-800 font-semibold mt-0.5">
                          Պետք է՝ <strong className="text-emerald-700 font-mono">unas estanterías cómodas</strong> (որովհետև estanterías իգական հոգնակի է)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rule 3: Exact adjective forms */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">3</span>
                  <h3 className="font-extrabold text-slate-950 text-base md:text-lg">Ածականների ճիշտ ձևերը</h3>
                </div>
                <p className="text-slate-600 text-xs">
                  Տեսե՛ք համաձայնեցված ածականները ըստ գործածվող գոյականների՝
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-1">
                  
                  <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                    <strong className="text-indigo-900 border-b border-indigo-100 pb-1 block mb-2 font-mono">pequeño</strong>
                    <div className="text-[11px] space-y-1 font-mono text-slate-700">
                      <div>un baño <span className="font-bold text-slate-900">pequeño</span></div>
                      <div>una cocina <span className="font-bold text-slate-900">pequeña</span></div>
                      <div>unos dormitorios <span className="font-bold text-slate-900">pequeños</span></div>
                      <div>unas estanterías <span className="font-bold text-slate-900">pequeñas</span></div>
                    </div>
                  </div>

                  <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                    <strong className="text-indigo-900 border-b border-indigo-100 pb-1 block mb-2 font-mono">bonito</strong>
                    <div className="text-[11px] space-y-1 font-mono text-slate-700">
                      <div>un salón <span className="font-bold text-slate-900">bonito</span></div>
                      <div>una cocina <span className="font-bold text-slate-900">bonita</span></div>
                      <div>unos armarios <span className="font-bold text-slate-900">bonitos</span></div>
                      <div>unas estanterías <span className="font-bold text-slate-900">bonitas</span></div>
                    </div>
                  </div>

                  <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                    <strong className="text-indigo-900 border-b border-indigo-100 pb-1 block mb-2 font-mono">cómodo</strong>
                    <div className="text-[11px] space-y-1 font-mono text-slate-700">
                      <div>un piso <span className="font-bold text-slate-900">cómodo</span></div>
                      <div>una cocina <span className="font-bold text-slate-900">cómoda</span></div>
                      <div>unos dormitorios <span className="font-bold text-slate-900">cómodos</span></div>
                      <div>unas estanterías <span className="font-bold text-slate-900">cómodas</span></div>
                    </div>
                  </div>

                  <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50">
                    <strong className="text-indigo-900 border-b border-indigo-100 pb-1 block mb-2 font-mono">incómodo</strong>
                    <div className="text-[11px] space-y-1 font-mono text-slate-700">
                      <div>un baño <span className="font-bold text-slate-900">incómodo</span></div>
                      <div>una cocina <span className="font-bold text-slate-900">incómoda</span></div>
                      <div>unos dormitorios <span className="font-bold text-slate-900">incómodos</span></div>
                      <div>unas estanterías <span className="font-bold text-slate-900">incómodas</span></div>
                    </div>
                  </div>

                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-2">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                    <AlertTriangle size={14} />
                    <span>Յուրահատուկ կանոն (Grande):</span>
                  </div>
                  <p className="text-slate-700 text-xs leading-relaxed">
                    <strong>Grande</strong> բառը սեռով չի փոխվում (չունի իգական ձև), միայն թվով է փոխվում․
                  </p>
                  <div className="flex gap-4 mt-1 text-xs font-mono text-slate-900">
                    <div>• <strong>grande</strong> — եզակի</div>
                    <div>• <strong>grandes</strong> — հոգնակի</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Rule 4 & 5: Intensifiers & Speech naturalness */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">4</span>
                  <h3 className="font-extrabold text-slate-950 text-base md:text-lg">Ուժեղացնող բառեր՝ muy, bastante, demasiado, un poco</h3>
                </div>
                <p className="text-slate-600 text-sm">
                  Այս բառերը դրվում են ածականից անմիջապես առաջ՝ նրա իմաստն ուժեղացնելու համար։
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="bg-violet-50 text-center p-3 rounded-xl border border-violet-100">
                    <strong className="text-violet-800 font-mono text-sm block">muy</strong>
                    <span className="text-[10px] text-slate-500 font-bold">շատ</span>
                  </div>
                  <div className="bg-violet-50 text-center p-3 rounded-xl border border-violet-100">
                    <strong className="text-violet-800 font-mono text-sm block">bastante</strong>
                    <span className="text-[10px] text-slate-500 font-bold">բավականին</span>
                  </div>
                  <div className="bg-violet-50 text-center p-3 rounded-xl border border-violet-100">
                    <strong className="text-violet-800 font-mono text-sm block">demasiado</strong>
                    <span className="text-[10px] text-slate-500 font-bold">չափազանց</span>
                  </div>
                  <div className="bg-violet-50 text-center p-3 rounded-xl border border-violet-100">
                    <strong className="text-violet-800 font-mono text-sm block">un poco</strong>
                    <span className="text-[10px] text-slate-500 font-bold">մի քիչ</span>
                  </div>
                </div>

                <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 space-y-1.5 text-xs">
                  <div className="font-bold text-slate-700 mb-1">Օրինակներ․</div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="font-mono">muy bonito</span>
                    <span className="text-slate-500">շատ գեղեցիկ</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="font-mono">bastante cómodo</span>
                    <span className="text-slate-500">բավականին հարմարավետ</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/50 pb-1">
                    <span className="font-mono">demasiado grande</span>
                    <span className="text-slate-500">չափազանց մեծ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-mono">un poco pequeño</span>
                    <span className="text-slate-500">մի քիչ փոքր</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">5</span>
                  <h3 className="font-extrabold text-slate-950 text-base md:text-lg">Որ տարբերակները լավ չեն հնչում</h3>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Գրամատիկորեն որոշ համադրություններ հնարավոր են, բայց բնական չեն հնչում իսպաներենում։
                </p>

                <div className="space-y-2 text-xs">
                  <div className="bg-yellow-50/70 border border-yellow-200/80 rounded-xl p-3">
                    <div className="font-bold text-yellow-800 font-mono mb-1">un poco bonito</div>
                    <p className="text-slate-700">
                      «մի քիչ գեղեցիկ» բնական չի հնչում։ Ավելի լավ է՝ <strong className="font-mono text-slate-950">muy bonito</strong> կամ <strong className="font-mono text-slate-950">bastante bonito</strong>։
                    </p>
                  </div>
                  
                  <div className="bg-yellow-50/70 border border-yellow-200/80 rounded-xl p-3">
                    <div className="font-bold text-yellow-800 font-mono mb-1">demasiado bonito / códomo</div>
                    <p className="text-slate-700">
                      «չափազանց գեղեցիկ» կամ «չափազանց հարմարավետ»։ Կարելի է, բայց սովորական խոսքում մի քիչ տարօրինակ է հնչում և շատ հազվադեպ է օգտագործվում։
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl p-3 mt-1 text-xs">
                  <div className="font-extrabold mb-1">Ավելի բնական է ասել՝</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-700 font-mono">
                    <div>• un poco pequeño</div>
                    <div>• un poco incómodo</div>
                    <div>• bastante cómodo</div>
                    <div>• muy bonito</div>
                    <div>• demasiado grande</div>
                    <div>• demasiado pequeño</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Rule 6: Good Examples with direct Translation & pronunciation helper */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                <span className="bg-indigo-100 text-indigo-700 text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">6</span>
                <h3 className="font-extrabold text-slate-950 text-base md:text-lg">Լավ և ճիշտ օրինակներ</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="bg-violet-50/40 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 p-4 rounded-xl transition-all duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-black text-slate-950 text-sm md:text-base font-mono block">
                      Tenemos un baño un poco pequeño.
                    </span>
                    <button 
                      onClick={() => playSpeech("Tenemos un baño un poco pequeño.")} 
                      className="text-violet-600 hover:text-violet-800 p-1 bg-white hover:bg-violet-100 rounded-lg shadow-sm transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Մենք ունենք մի քիչ փոքր լոգասենյակ։
                  </p>
                </div>

                <div className="bg-violet-50/40 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 p-4 rounded-xl transition-all duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-black text-slate-950 text-sm md:text-base font-mono block">
                      Tienen unos dormitorios bastante grandes.
                    </span>
                    <button 
                      onClick={() => playSpeech("Tienen unos dormitorios bastante grandes.")} 
                      className="text-violet-600 hover:text-violet-800 p-1 bg-white hover:bg-violet-100 rounded-lg shadow-sm transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Նրանք ունեն բավականին մեծ ննջասենյակներ։
                  </p>
                </div>

                <div className="bg-violet-50/40 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 p-4 rounded-xl transition-all duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-black text-slate-950 text-sm md:text-base font-mono block">
                      Tenemos una cocina muy bonita.
                    </span>
                    <button 
                      onClick={() => playSpeech("Tenemos una cocina muy bonita.")} 
                      className="text-violet-600 hover:text-violet-800 p-1 bg-white hover:bg-violet-100 rounded-lg shadow-sm transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Մենք ունենք շատ գեղեցիկ խոհանոց։
                  </p>
                </div>

                <div className="bg-violet-50/40 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 p-4 rounded-xl transition-all duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-black text-slate-950 text-sm md:text-base font-mono block">
                      Tienen un salón bastante cómodo.
                    </span>
                    <button 
                      onClick={() => playSpeech("Tienen un salón bastante cómodo.")} 
                      className="text-violet-600 hover:text-violet-800 p-1 bg-white hover:bg-violet-100 rounded-lg shadow-sm transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Նրանք ունեն բավականին հարմարավետ հյուրասենյակ։
                  </p>
                </div>

                <div className="bg-violet-50/40 hover:bg-violet-50 border border-slate-100 hover:border-violet-100 p-4 rounded-xl transition-all duration-200">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="font-black text-slate-950 text-sm md:text-base font-mono block">
                      Tenemos unas estanterías demasiado grandes.
                    </span>
                    <button 
                      onClick={() => playSpeech("Tenemos unas estanterías demasiado grandes.")} 
                      className="text-violet-600 hover:text-violet-800 p-1 bg-white hover:bg-violet-100 rounded-lg shadow-sm transition-colors"
                      title="Լսել արտասանությունը"
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-600">
                    Մենք ունենք չափազանց մեծ դարակաշարեր։
                  </p>
                </div>

              </div>
            </div>

            {/* Prompt key instruction encouragement */}
            <div className="flex items-center justify-between bg-indigo-900 text-white p-6 rounded-2xl shadow-md">
              <div className="space-y-1">
                <h4 className="font-extrabold text-white text-base">Պատրա՞ստ եք սկսել գործնականը։</h4>
                <p className="text-indigo-200 text-xs">
                  Անցեք «Նախադասության Կոնստրուկտոր» կամ «Թարգմանության Խաղ» բաժիններին՝ ձեր գիտելիքները փորձարկելու համար։
                </p>
              </div>
              <button 
                id="btn-goto-builder"
                onClick={() => setActiveTab('constructor')}
                className="bg-white text-indigo-900 font-extrabold text-xs px-4 py-2.5 rounded-xl hover:bg-indigo-50 shadow-md transition-all shrink-0 cursor-pointer"
              >
                Սկսել կառուցել
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Sentence Constructor (Exercise 68) */}
        {activeTab === 'constructor' && (
          <div className="space-y-6" id="section-sentence-builder">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                <div>
                  <h2 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white p-1 rounded-lg"><Sparkles size={18} /></span>
                    Վարժություն 68: Կարգավորվող Նախադասություններ
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Ընտրե՛ք բառերը սյունակներից: Ուշադրություն դարձրե՛ք ածականի վերջավորության համաձայնեցմանը սեռով և թվով:
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Օգնություն՝</span>
                  <div className="bg-indigo-50 text-indigo-800 text-[10px] font-bold px-2 py-1 rounded border border-indigo-100">
                    {calculatedNoun.gender === 'M' ? '♂️ Արական' : '♀️ Իգական'} • {calculatedNoun.number === 'S' ? 'Եզակի' : '👥 Հոգնակի'}
                  </div>
                </div>
              </div>

              {/* Matrix Layout - 4 columns (Vibrant Theme) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="constructor-column-grid">
                
                {/* Column 1: Verb */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
                    1. Բայ (Verb)
                  </div>
                  <div className="space-y-2">
                    {['Tenemos', 'Tienen'].map((v) => (
                      <button
                        key={v}
                        id={`verb-${v.toLowerCase()}`}
                        onClick={() => {
                          setSelectedVerb(v);
                          setConstructorFeedback(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl text-xs font-mono font-bold transition-all transform active:scale-98 cursor-pointer ${
                          selectedVerb === v 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-300' 
                            : 'bg-slate-50 text-slate-700 border border-slate-200/50 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{v}</span>
                          <span className={`text-[9px] font-sans ${selectedVerb === v ? 'text-blue-100' : 'text-slate-400'}`}>
                            {v === 'Tenemos' ? 'Մենք ունենք' : 'Նրանք ունեն'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 2: Noun Phrase */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
                    2. Գոյական (Noun)
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {nouns.map((n, idx) => (
                      <button
                        key={n.spanish}
                        id={`noun-${idx}`}
                        onClick={() => {
                          setSelectedNounIdx(idx);
                          setConstructorFeedback(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl text-xs font-mono font-bold transition-all transform active:scale-98 cursor-pointer ${
                          selectedNounIdx === idx 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-300' 
                            : 'bg-slate-50 text-slate-700 border border-slate-200/50 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center">
                            <span>{n.spanish}</span>
                            <span className={`text-[8px] px-1.5 py-0.5 rounded-md font-black ${
                              selectedNounIdx === idx 
                                ? 'bg-blue-700 text-blue-100' 
                                : n.gender === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {n.gender === 'F' ? 'Իգ.' : 'Ար.'}{n.number === 'P' ? ' հոգ.' : ' եզ.'}
                            </span>
                          </div>
                          <span className={`text-[9px] font-sans font-normal ${selectedNounIdx === idx ? 'text-blue-100' : 'text-slate-400 font-medium'}`}>
                            {n.armenian}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 3: Intensifiers */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
                    3. Ուժեղացնող
                  </div>
                  <div className="space-y-2">
                    {intensifiers.map((it) => (
                      <button
                        key={it.spanish}
                        id={`intensifier-${it.spanish.replace(/\s+/g, '-')}`}
                        onClick={() => {
                          setSelectedIntensifier(it.spanish);
                          setConstructorFeedback(null);
                        }}
                        className={`w-full text-left p-3 rounded-xl text-xs font-mono font-bold transition-all transform active:scale-98 cursor-pointer ${
                          selectedIntensifier === it.spanish 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-300' 
                            : 'bg-slate-50 text-slate-700 border border-slate-200/50 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span>{it.spanish}</span>
                          <span className={`text-[9px] font-sans ${selectedIntensifier === it.spanish ? 'text-blue-100' : 'text-slate-400'}`}>
                            {it.armenian}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Column 4: Base Adjectives & Conjugations */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-3">
                  <div>
                    <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 pb-1 border-b border-slate-100">
                      4. Ածական (Adjective)
                    </div>
                    
                    {/* Select Adjective Group */}
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {adjectives.map((adj, i) => (
                        <button
                          key={adj.base}
                          id={`adj-base-${adj.base}`}
                          onClick={() => {
                            setSelectedAdjectiveBaseIdx(i);
                            // Auto select matching ending as hint / initial selection
                            setUserSelectedAdjectiveEnding(adj.base);
                            setConstructorFeedback(null);
                          }}
                          className={`p-2.5 rounded-xl text-center text-[11px] font-mono font-extrabold transition-all cursor-pointer ${
                            selectedAdjectiveBaseIdx === i
                              ? 'bg-blue-50 text-blue-700 ring-2 ring-blue-200 font-black'
                              : 'bg-slate-50 text-slate-700 border border-slate-200/50 hover:bg-slate-100/80'
                          }`}
                        >
                          <div>{adj.base}</div>
                          <span className="text-[9px] font-sans text-slate-400 font-bold block mt-0.5">{adj.armenian}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pick ending forms based on chosen adjective */}
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                       Ընտրե՛ք համապատասխան ձևը՝
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1.5" id="adj-endings-selector">
                      {(() => {
                        const baseObj = adjectives[selectedAdjectiveBaseIdx];
                        let options: string[] = [];
                        
                        if (baseObj.base === 'grande') {
                          options = ['grande', 'grandes'];
                        } else {
                          const root = baseObj.base.substring(0, baseObj.base.length - 1);
                          options = [
                            root + 'o', // masculine singular
                            root + 'a', // feminine singular
                            root + 'os', // masculine plural
                            root + 'as' // feminine plural
                          ];
                        }

                        return options.map((form) => (
                          <button
                            key={form}
                            id={`adj-ending-${form}`}
                            onClick={() => {
                              setUserSelectedAdjectiveEnding(form);
                              setConstructorFeedback(null);
                            }}
                            className={`p-2 rounded-xl text-[11px] font-mono font-extrabold text-center transition-all cursor-pointer ${
                              userSelectedAdjectiveEnding === form
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-100 ring-2 ring-emerald-200'
                                : 'bg-slate-50 text-slate-700 hover:bg-slate-100/80 border border-slate-200/50'
                            }`}
                          >
                            {form}
                          </button>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

              </div>

              {/* Dynamic sentence display layout (Vibrant Theme word-chip list) */}
              <div className="mt-8 bg-white rounded-3xl p-6 md:p-8 border-2 border-dashed border-slate-200 text-slate-800 relative shadow-sm" id="sentence-preview-box">
                <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 text-center">ՆԱԽԱԴԱՍՈՒԹՅԱՆ ԴԻՏՈՒՄ • LIVE PREVIEW</div>
                
                <div className="flex flex-wrap gap-2 md:gap-3 min-h-[70px] p-4 bg-slate-50 rounded-2xl w-full justify-center items-center mb-6 border border-slate-100">
                  <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm font-black text-blue-600 border border-blue-100 text-sm md:text-base cursor-default select-none animate-fadeIn">{selectedVerb}</div>
                  <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm font-black text-blue-600 border border-blue-100 text-sm md:text-base cursor-default select-none animate-fadeIn">{calculatedNoun.spanish}</div>
                  <div className="px-4 py-2.5 bg-white rounded-xl shadow-sm font-black text-blue-500 border border-slate-100 text-sm md:text-base cursor-default select-none animate-fadeIn">{selectedIntensifier}</div>
                  <div className="px-4 py-2.5 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-200 font-extrabold text-sm md:text-base cursor-pointer transform active:scale-95 hover:bg-blue-600 transition-all select-none animate-fadeIn">{userSelectedAdjectiveEnding}</div>
                  <span className="font-extrabold text-slate-400 text-xl">.</span>

                  <button 
                    onClick={() => playSpeech(`${selectedVerb} ${calculatedNoun.spanish} ${selectedIntensifier} ${userSelectedAdjectiveEnding}`)}
                    className="ml-auto p-2 bg-slate-100 hover:bg-slate-200 text-indigo-600 rounded-xl transition-all cursor-pointer shadow-sm"
                    title="Լսել արտասանությունը"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>

                {/* Armenian translation calculated dynamically */}
                <div className="mt-4 border-t border-slate-100 pt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Հայերեն թարգմանություն</div>
                    <p className="text-sm md:text-base font-bold text-slate-800 mt-1">
                      {selectedVerb === 'Tenemos' ? 'Մենք ունենք' : 'Նրանք ունեն'}{' '}
                      <span className="text-blue-600">
                        {selectedIntensifier === 'muy' ? 'շատ' :
                         selectedIntensifier === 'un poco' ? 'մի քիչ' :
                         selectedIntensifier === 'bastante' ? 'բավականին' : 'չափազանց'}
                      </span>{' '}
                      <span className="text-pink-600">{calculatedAdjBase.armenian}</span>{' '}
                      <span className="text-slate-900">{calculatedNoun.armenian}</span>։
                    </p>
                  </div>
                  
                  {/* Validation action button */}
                  <div className="flex gap-2 shrink-0">
                    <button
                      id="btn-check-constructor"
                      onClick={handleCheckSentence}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 transition-all active:scale-95 cursor-pointer text-xs md:text-sm"
                    >
                      ՍՏՈՒԳԵԼ
                    </button>
                  </div>
                </div>
              </div>

              {/* Validation feedback block */}
              {constructorFeedback && (
                <div 
                  id="constructor-feedback"
                  className={`mt-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 ${
                    constructorFeedback.status === 'correct' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">
                      {constructorFeedback.status === 'correct' ? '🎉' : '⚠️'}
                    </span>
                    <div className="space-y-1.5 flex-1">
                      <p className="font-extrabold text-xs md:text-sm">
                        {constructorFeedback.message}
                      </p>
                      
                      {constructorFeedback.naturalMessage && (
                        <p className="text-xs text-slate-700 italic border-t border-slate-200/55 pt-1.5">
                          {constructorFeedback.naturalMessage}
                        </p>
                      )}

                      {/* If correct, offer key to add to user dictionary */}
                      {constructorFeedback.status === 'correct' && (
                        <div className="pt-2">
                          <button
                            id="btn-save-sentence"
                            onClick={saveSentenceToBookshelf}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm transition-all"
                          >
                            <Bookmark size={12} />
                            Ավելացնել իմ նախադասությունների ցանկում
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Saved user sentences "My Library" */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <BookOpen size={16} className="text-violet-600" />
                Իմ նախադասությունների հավաքածուն ({savedSentences.length})
              </h3>
              
              {savedSentences.length === 0 ? (
                <p className="text-xs text-slate-400 italic">Դուք դեռ չունեք պահպանված նախադասություններ: Կառուցեք վերևում և սեղմեք պահպանել:</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" id="saved-sentences-list">
                  {savedSentences.map((s, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-start gap-2 group hover:border-violet-100 transition-all">
                      <div className="space-y-1">
                        <span className="font-mono text-xs md:text-sm font-bold text-slate-900 block">{s.spanish}</span>
                        <span className="text-[11px] text-slate-500 block">{s.armenian}</span>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button 
                          onClick={() => playSpeech(s.spanish)} 
                          className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200"
                        >
                          <Volume2 size={12} />
                        </button>
                        <button 
                          onClick={() => setSavedSentences(savedSentences.filter((_, idx) => idx !== index))}
                          className="text-slate-300 hover:text-rose-500 p-1 rounded hover:bg-slate-200"
                          title="Ջնջել ցանկից"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* Tab 3: 6 Additional Interactive Exercises */}
        {activeTab === 'exercises' && (
          <div className="space-y-6" id="section-exercises">
            
            {/* Scoreboard / Progress header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                  <ClipboardCheck size={20} className="text-blue-500" />
                  Ինտերակտիվ Քերականական Թեստ (6 Վարժություններ)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Անցե՛ք բոլոր 6 հարցերը՝ սեռով և թվով համաձայնեցումը լիովին յուրացնելու համար:
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="bg-slate-100 px-3 py-2 rounded-xl text-center">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Միավորներ՝</div>
                  <div className="text-lg font-black text-blue-600">{quizScore} / 6</div>
                </div>
                <button 
                  onClick={resetQuiz}
                  className="bg-slate-100 hover:bg-slate-200 p-2 text-slate-700 rounded-xl transition-all cursor-pointer"
                  title="Վերսկսել թեստը"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>

            {/* Exercise Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="exercises-grid">

              {/* EXERCISE 1 (Word Scramble) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Վարժություն 1</span>
                    <span className="text-xs text-slate-400 font-bold">Բառերի դասավորություն</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-1">
                    Թարգմանե՛ք հետևյալ նախադասությունը իսպաներեն՝
                  </h4>
                  <p className="text-xs text-blue-700 font-extrabold bg-blue-50 px-3 py-2 rounded-xl inline-block border border-blue-100/40">
                    «Մենք ունենք մի քիչ փոքր լոգասենյակ։»
                  </p>
                </div>

                {/* Built Words List */}
                <div className="min-h-[44px] bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 flex flex-wrap gap-1.5 items-center">
                  {(quizAnswers[0] || []).length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">Սեղմեք ներքևի բառերին համապատասխան հերթականությամբ...</span>
                  ) : (
                    (quizAnswers[0] || []).map((word: string, i: number) => (
                      <span 
                        key={i} 
                        onClick={() => {
                          if (quizSubmitted[0]) return;
                          const currentArray = quizAnswers[0] || [];
                          const updated = currentArray.filter((_: any, idx: number) => idx !== i);
                          const newAnsAnswers = [...quizAnswers];
                          newAnsAnswers[0] = updated;
                          setQuizAnswers(newAnsAnswers);
                        }}
                        className="bg-blue-600 text-white font-mono text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-700 flex items-center gap-1 select-none shadow-sm shadow-blue-100 transform active:scale-95"
                      >
                        {word}
                        {!quizSubmitted[0] && <span className="text-[10px] text-blue-200 font-black">×</span>}
                      </span>
                    ))
                  )}
                </div>

                {/* Scramble Choices */}
                {!quizSubmitted[0] && (
                  <div className="flex flex-wrap gap-1.5">
                    {['Tenemos', 'un', 'baño', 'un poco', 'pequeño', 'Tienen', 'una', 'cocina', 'grande'].map((w, idx) => {
                      const isUsed = (quizAnswers[0] || []).includes(w);
                      return (
                        <button
                          key={idx}
                          id={`ex1-choice-${idx}`}
                          onClick={() => {
                            const currentArray = quizAnswers[0] || [];
                            if (isUsed) return;
                            const newAnsAnswers = [...quizAnswers];
                            newAnsAnswers[0] = [...currentArray, w];
                            setQuizAnswers(newAnsAnswers);
                          }}
                          disabled={isUsed}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                            isUsed 
                              ? 'bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed' 
                              : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                          }`}
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Action panel */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  {!quizSubmitted[0] ? (
                    <button
                      id="btn-submit-ex1"
                      onClick={() => handleQuizSubmit(
                        0, 
                        quizAnswers[0] || [], 
                        ['Tenemos', 'un', 'baño', 'un poco', 'pequeño'],
                        "Tenemos - Մենք ունենք, un baño - լոգասենյակ (արական, եզակի), un poco - մի քիչ, pequeño - փոքր (արական, եզակի համաձայնեցում)։"
                      )}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-100 transition-all select-none cursor-pointer transform active:scale-98"
                    >
                      Ուղարկել Պատասխանը
                    </button>
                  ) : (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      {quizFeedback[0]}
                    </div>
                  )}
                </div>
              </div>

              {/* EXERCISE 2 (Word Scramble) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Վարժություն 2</span>
                    <span className="text-xs text-slate-400 font-bold">Բառերի դասավորություն</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-1">
                    Թարգմանե՛ք հետևյալ նախադասությունը իսպաներեն՝
                  </h4>
                  <p className="text-xs text-blue-700 font-extrabold bg-blue-50 px-3 py-2 rounded-xl inline-block border border-blue-100/40">
                    «Նրանք ունեն բավականին մեծ ննջասենյակներ։»
                  </p>
                </div>

                {/* Built Words List */}
                <div className="min-h-[44px] bg-slate-50 border border-dashed border-slate-200 rounded-xl p-2.5 flex flex-wrap gap-1.5 items-center">
                  {(quizAnswers[1] || []).length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">Սեղմեք ներքևի բառերին համապատասխան հերթականությամբ...</span>
                  ) : (
                    (quizAnswers[1] || []).map((word: string, i: number) => (
                      <span 
                        key={i} 
                        onClick={() => {
                          if (quizSubmitted[1]) return;
                          const currentArray = quizAnswers[1] || [];
                          const updated = currentArray.filter((_: any, idx: number) => idx !== i);
                          const newAnsAnswers = [...quizAnswers];
                          newAnsAnswers[1] = updated;
                          setQuizAnswers(newAnsAnswers);
                        }}
                        className="bg-blue-600 text-white font-mono text-xs font-black px-3 py-1.5 rounded-xl cursor-pointer hover:bg-blue-700 flex items-center gap-1 select-none shadow-sm shadow-blue-100 transform active:scale-95"
                      >
                        {word}
                        {!quizSubmitted[1] && <span className="text-[10px] text-blue-200 font-black">×</span>}
                      </span>
                    ))
                  )}
                </div>

                {/* Scramble Choices */}
                {!quizSubmitted[1] && (
                  <div className="flex flex-wrap gap-1.5">
                    {['Tienen', 'unos', 'dormitorios', 'bastante', 'grandes', 'Tenemos', 'unos', 'baño', 'grande'].map((w, idx) => {
                      const isUsed = (quizAnswers[1] || []).includes(w); // simplistic check
                      return (
                        <button
                          key={idx}
                          id={`ex2-choice-${idx}`}
                          onClick={() => {
                            const currentArray = quizAnswers[1] || [];
                            const newAnsAnswers = [...quizAnswers];
                            newAnsAnswers[1] = [...currentArray, w];
                            setQuizAnswers(newAnsAnswers);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-white text-slate-700 hover:bg-slate-50 border border-slate-200"
                        >
                          {w}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Action panel */}
                <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
                  {!quizSubmitted[1] ? (
                    <button
                      id="btn-submit-ex2"
                      onClick={() => handleQuizSubmit(
                        1, 
                        quizAnswers[1] || [], 
                        ['Tienen', 'unos', 'dormitorios', 'bastante', 'grandes'],
                        "Tienen - Նրանք ունեն, unos dormitorios - ննջասենյակներ (արական, հոգնակի), bastante - բավականին, grandes - մեծ (հոգնակի համաձայնեցում)։"
                      )}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-100 transition-all select-none cursor-pointer transform active:scale-98"
                    >
                      Ուղարկել Պատասխանը
                    </button>
                  ) : (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      {quizFeedback[1]}
                    </div>
                  )}
                </div>
              </div>

              {/* EXERCISE 3 (Adjective Agreement) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Վարժություն 3</span>
                    <span className="text-xs text-slate-400 font-bold">Իգական եզակի</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-1">
                    Ընտրե՛ք ածականի ճիշտ վերջավորությունը նախադասության մեջ՝
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-mono text-sm font-bold text-slate-800">
                    Tenemos una cocina muy <span className="text-blue-600 font-extrabold underline underline-offset-4">_________</span> (bonito).
                  </div>
                </div>

                {/* Options Radio buttons represented cleanly */}
                <div className="grid grid-cols-2 gap-2">
                  {['bonito', 'bonita', 'bonitos', 'bonitas'].map((opt) => (
                    <button
                      key={opt}
                      id={`ex3-choice-${opt}`}
                      onClick={() => {
                        if (quizSubmitted[2]) return;
                        const newAnswers = [...quizAnswers];
                        newAnswers[2] = opt;
                        setQuizAnswers(newAnswers);
                      }}
                      className={`p-3 rounded-xl text-xs font-mono font-black border text-center transition-all transform active:scale-95 cursor-pointer ${
                        quizAnswers[2] === opt
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-350 border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200/50 hover:bg-slate-100/80'
                      }`}
                      disabled={quizSubmitted[2]}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Submit / Feedback */}
                <div className="pt-2 border-t border-slate-100">
                  {!quizSubmitted[2] ? (
                    <button
                      id="btn-submit-ex3"
                      onClick={() => handleQuizSubmit(
                        2, 
                        quizAnswers[2], 
                        'bonita', 
                        "Որովհետև «cocina»-ն իգական սեռի եզակի գոյական է, ուստի ածականը պետք է ստանա «-a» վերջավորությունը ՝ bonita:"
                      )}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-100 transition-all select-none cursor-pointer transform active:scale-98"
                    >
                      Ուղարկել Պատասխանը
                    </button>
                  ) : (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      {quizFeedback[2]}
                    </div>
                  )}
                </div>
              </div>

              {/* EXERCISE 4 (Number Agreement) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Վարժություն 4</span>
                    <span className="text-xs text-slate-400 font-bold">Արական հոգնակի</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-1">
                    Ընտրե՛ք ածականի ճիշտ ձևը տվյալ նախադասության մեջ՝
                  </h4>
                  <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl font-mono text-sm font-bold text-slate-800">
                    Tienen unos armarios bastante <span className="text-blue-600 font-extrabold underline underline-offset-4">_________</span> (cómodo).
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-2">
                  {['cómodo', 'cómoda', 'cómodos', 'cómodas'].map((opt) => (
                    <button
                      key={opt}
                      id={`ex4-choice-${opt}`}
                      onClick={() => {
                        if (quizSubmitted[3]) return;
                        const newAnswers = [...quizAnswers];
                        newAnswers[3] = opt;
                        setQuizAnswers(newAnswers);
                      }}
                      className={`p-3 rounded-xl text-xs font-mono font-black border text-center transition-all transform active:scale-95 cursor-pointer ${
                        quizAnswers[3] === opt
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-300 border-blue-600'
                          : 'bg-slate-50 text-slate-700 border-slate-200/50 hover:bg-slate-100/80'
                      }`}
                      disabled={quizSubmitted[3]}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {/* Submit / Feedback */}
                <div className="pt-2 border-t border-slate-100">
                  {!quizSubmitted[3] ? (
                    <button
                      id="btn-submit-ex4"
                      onClick={() => handleQuizSubmit(
                        3, 
                        quizAnswers[3], 
                        'cómodos', 
                        "Որովհետև «armarios» բառը արական սեռի հոգնակի գոյական է, ուստի ածականը պետք է ստանա «-os» վերջավորությունը ՝ cómodos:"
                      )}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-100 transition-all select-none cursor-pointer transform active:scale-98"
                    >
                      Ուղարկել Պատասխանը
                    </button>
                  ) : (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                      {quizFeedback[3]}
                    </div>
                  )}
                </div>
              </div>

              {/* EXERCISE 5 (Grande Rule) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Վարժություն 5</span>
                    <span className="text-xs text-slate-400 font-bold">Իգական հոգնակի</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-1">
                    Թարգմանե՛ք հետևյալ նախադասությունը ճիշտ տարբերակով՝
                  </h4>
                  <p className="text-xs text-blue-700 font-extrabold bg-blue-50 px-3 py-2 rounded-xl inline-block border border-blue-100/40">
                    «Մենք ունենք չափազանց մեծ դարակաշարեր։»
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {[
                    { id: 'A', text: 'Tenemos unas estanterías demasiado grandes.' },
                    { id: 'B', text: 'Tenemos unas estanterías demasiado grandas.' },
                    { id: 'C', text: 'Tenemos unas estanterías muy grande.' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`ex5-choice-${opt.id}`}
                      onClick={() => {
                        if (quizSubmitted[4]) return;
                        const newAnswers = [...quizAnswers];
                        newAnswers[4] = opt.id;
                        setQuizAnswers(newAnswers);
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-mono font-black border transition-all transform active:scale-98 cursor-pointer ${
                        quizAnswers[4] === opt.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-300 border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'
                      }`}
                      disabled={quizSubmitted[4]}
                    >
                      <span className="font-black underline mr-2">{opt.id}.</span> {opt.text}
                    </button>
                  ))}
                </div>

                {/* Submit / Feedback */}
                <div className="pt-2 border-t border-slate-100">
                  {!quizSubmitted[4] ? (
                    <button
                      id="btn-submit-ex5"
                      onClick={() => handleQuizSubmit(
                        4, 
                        quizAnswers[4], 
                        'A', 
                        "Որովհետև «grande» ածականը չունի առանձին իգական սեռի ձև (grandas գոյություն չունի)։ Այն ստանում է միայն հոգնակիի «-es» վերջավորությունը ՝ grandes: «estanterías»-ը իգական հոգնակի է։"
                      )}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-100 transition-all select-none cursor-pointer transform active:scale-98"
                    >
                      Ուղարկել Պատասխանը
                    </button>
                  ) : (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-sans">
                      {quizFeedback[4]}
                    </div>
                  )}
                </div>
              </div>

              {/* EXERCISE 6 (Find the error) */}
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">Վարժություն 6</span>
                    <span className="text-xs text-slate-400 font-bold">Սխալի որոնում</span>
                  </div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base mb-1">
                    Գտե՛ք քերականորեն <strong className="text-rose-600 underline decoration-2">ՍԽԱԼ</strong> նախադասությունը՝
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold">
                     Ուշադրություն դարձրե՛ք սեռին և թվին։
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-2">
                  {[
                    { id: 'A', text: 'Tienes una cocina muy bonita.' },
                    { id: 'B', text: 'Tenemos unos dormitorios pequeños.' },
                    { id: 'C', text: 'Tienen un piso cómoda.' },
                    { id: 'D', text: 'Tenemos un baño grande.' }
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      id={`ex6-choice-${opt.id}`}
                      onClick={() => {
                        if (quizSubmitted[5]) return;
                        const newAnswers = [...quizAnswers];
                        newAnswers[5] = opt.id;
                        setQuizAnswers(newAnswers);
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-mono font-black border transition-all transform active:scale-98 cursor-pointer ${
                        quizAnswers[5] === opt.id
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 ring-2 ring-blue-300 border-blue-600'
                          : 'bg-white text-slate-700 border-slate-200/60 hover:bg-slate-50'
                      }`}
                      disabled={quizSubmitted[5]}
                    >
                      <span className="font-black underline mr-2">{opt.id}.</span> {opt.text}
                    </button>
                  ))}
                </div>

                {/* Submit / Feedback */}
                <div className="pt-2 border-t border-slate-100">
                  {!quizSubmitted[5] ? (
                    <button
                      id="btn-submit-ex6"
                      onClick={() => handleQuizSubmit(
                        5, 
                        quizAnswers[5], 
                        'C', 
                        "Որովհետև «un piso» արական սեռի եզակի գոյական է: Իսկ «cómoda»-ն իգական սեռով է համաձայնեցվել: Ճիշտ ձևը պետք է լիներ ՝ un piso cómodo:"
                      )}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs py-3 rounded-2xl shadow-md shadow-blue-100 transition-all select-none cursor-pointer transform active:scale-98"
                    >
                      Ուղարկել Պատասխանը
                    </button>
                  ) : (
                    <div className="text-xs p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 font-sans">
                      {quizFeedback[5]}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Completion Badge */}
            {quizSubmitted.filter(Boolean).length === 6 && (
              <div className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-6 rounded-3xl shadow-lg shadow-blue-100/30 text-center space-y-3">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto text-3xl">
                  🏆
                </div>
                <div>
                  <h3 className="font-black text-white text-lg">Շնորհավորո՛ւմ ենք: Դուք ավարտեցիք թեստը:</h3>
                  <p className="text-emerald-100 text-xs mt-1">
                     Ձեր վերջնական արդյունքն է` <strong className="text-white text-base font-black">{quizScore} / 6 ճիշտ պատասխան</strong>
                  </p>
                </div>
                <button
                  onClick={resetQuiz}
                  className="bg-white text-slate-800 font-black text-xs px-6 py-3 rounded-2xl hover:bg-slate-50 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  ԿՐԿԻՆ ԱՆՑՆԵԼ
                </button>
              </div>
            )}

          </div>
        )}

        {/* Tab 4: Vocabulary Flashcard Memory Game (Exercise 69) */}
        {activeTab === 'cards' && (
          <div className="space-y-6" id="section-flashcards">
            
            {/* Header info */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
                  <span className="bg-blue-600 text-white p-1.5 rounded-xl text-xs">🎴</span>
                  Վարժություն 69: Իսպաներեն-Հայերեն Բառախաղ
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Կտտացրե՛ք իսպաներեն նախադասության վրա՝ հայերեն թարգմանությունը տեսնելու համար:
                </p>
              </div>

              {/* Progress and Filters */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  id="filter-all"
                  onClick={() => setCardFilter('all')}
                  className={`text-[11px] font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    cardFilter === 'all' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  Բոլորը ({exercise69Cards.length})
                </button>
                <button
                  id="filter-phrases"
                  onClick={() => setCardFilter('phrase')}
                  className={`text-[11px] font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    cardFilter === 'phrase' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  Արտահայտություններ
                </button>
                <button
                  id="filter-sentences"
                  onClick={() => setCardFilter('sentence')}
                  className={`text-[11px] font-black px-4 py-2 rounded-xl transition-all cursor-pointer ${
                    cardFilter === 'sentence' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  Նախադասություններ
                </button>
              </div>
            </div>

            {/* Interactive Flashcard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="flashcards-grid">
              {exercise69Cards
                .filter(card => cardFilter === 'all' || card.category === cardFilter)
                .map((card, idx) => {
                  const isFlipped = flippedCards[idx] || false;
                  const isMastered = masteredCards[idx] || false;

                  return (
                    <div
                      key={idx}
                      id={`card-${idx}`}
                      onClick={() => toggleFlip(idx)}
                      className={`relative min-h-[145px] rounded-3xl p-5 border shadow-sm transition-all duration-300 cursor-pointer select-none flex flex-col justify-between ${
                        isFlipped 
                          ? 'bg-gradient-to-br from-blue-50/60 to-blue-50/20 border-blue-200 shadow-md shadow-blue-100/20' 
                          : 'bg-white hover:bg-slate-50/60 border-slate-100 hover:shadow-md'
                      } ${isMastered ? 'ring-2 ring-emerald-500/60' : ''}`}
                    >
                      {/* Top Header line */}
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                        <span>
                          {card.category === 'phrase' ? 'Արտահայտություն' : 'Նախադասություն'}
                        </span>
                        
                        {/* Audio & Mastered Status triggers inside card */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid flip
                              playSpeech(card.spanish);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-blue-600 transition-all"
                            title="Արտասանել"
                          >
                            <Volume2 size={13} />
                          </button>
                          
                          <button
                            id={`card-master-${idx}`}
                            onClick={(e) => toggleMastered(idx, e)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isMastered 
                                ? 'bg-emerald-500 border-emerald-500 text-white' 
                                : 'bg-white border-slate-200 text-slate-400 hover:text-emerald-500'
                            }`}
                            title={isMastered ? "Արդեն սերտել եմ" : "Նշել որպես սերտած"}
                          >
                            <Check size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Content Section (Word / Phrase) */}
                      <div className="my-3 text-center">
                        {!isFlipped ? (
                          <div className="font-mono text-base md:text-lg font-black text-slate-800">
                            {card.spanish}
                          </div>
                        ) : (
                          <div className="space-y-1.5 animate-fadeIn">
                            <div className="font-mono text-[11px] text-slate-400 line-through">
                              {card.spanish}
                            </div>
                            <div className="text-sm md:text-base font-bold text-slate-900 border-t border-blue-100/40 pt-1.5">
                              {card.armenian}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Touch Reveal Instruction Banner */}
                      <div className="text-[9px] text-center text-slate-400 font-bold border-t border-slate-100 pt-2">
                        {!isFlipped ? 'Սեղմե՛ք թարգմանությունը տեսնելու համար' : 'Սեղմե՛ք կրկին իսպաներենը տեսնելու համար'}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Quick completion message */}
            <div className="bg-slate-800 text-white p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 flex-1">
                <span className="text-xl">🎓</span>
                <h4 className="font-extrabold text-white text-sm">Արդյունավետության Ցուցանիշ:</h4>
                <p className="text-slate-400 text-xs">
                  Դուք արդեն անգիր արեցիք <strong>{Object.values(masteredCards).filter(Boolean).length} / {exercise69Cards.length}</strong> արտահայտություն կամ նախադասություն:
                </p>
              </div>
              <button
                onClick={() => {
                  setFlippedCards({});
                  setMasteredCards({});
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all border border-white/10 cursor-pointer"
              >
                Մաքրել առաջընթացը
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer / Copyright / No tech larp as instructed */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            Իսպաներենի քերականության ուսուցման համակարգ հայերենով:
          </p>
          <div className="flex justify-center gap-4 text-[10px] text-slate-400 font-bold">
            <span>© 2026 Spanish Grammar Lab</span>
            <span>•</span>
            <span>Level A1 - A2 Coursebook</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
