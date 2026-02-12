import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  ClipboardList, 
  Activity, 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  MessageSquare,
  Thermometer,
  Zap,
  Info
} from 'lucide-react';

interface Act0StressQuizProps {
  onComplete: () => void;
}

type QuestionType = 'boolean' | 'scale';

interface Question {
  id: number;
  text: string;
  type: QuestionType;
  category: string;
  foundation?: string;
}

const QUESTIONS: Question[] = [
  // SEÇÃO 1: FILTRO DE REATIVIDADE LÍMBICA (SIM / NÃO)
  {
    id: 1,
    text: "O som de um e-mail chegando fora do horário comercial ativa em você a mesma resposta neurofisiológica de um encontro com um predador no topo da cadeia alimentar?",
    type: 'boolean',
    category: 'Ambiente Laboral',
    foundation: 'Hipervigilância por Cortisol'
  },
  {
    id: 2,
    text: "Sua pálpebra desenvolveu um código Morse próprio (tremor involuntário) para pedir socorro enquanto você olha para o computador?",
    type: 'boolean',
    category: 'Saúde Física',
    foundation: 'Mioquimia por fadiga adrenal'
  },
  {
    id: 3,
    text: "Você sente uma vontade genuína de arremessar o celular na parede ao ouvir a frase: 'consegue dar um pulinho numa call rapidinha'?",
    type: 'boolean',
    category: 'Saúde Mental',
    foundation: 'Sobrecarga sensorial e reatividade límbica'
  },
  {
    id: 4,
    text: "Seu 'Modo de Sobrevivência' já deletou o cache da sua memória recente? (Ex: Entrar num cômodo e esquecer o que ia fazer)",
    type: 'boolean',
    category: 'Fadiga Cognitiva',
    foundation: 'Atrofia temporária do hipocampo'
  },
  {
    id: 5,
    text: "Você já respondeu 'Tô bem, e você?' enquanto, internamente, seu cérebro gritava um pedido de resgate em alto mar?",
    type: 'boolean',
    category: 'Social',
    foundation: 'Dissociação emocional e exaustão'
  },
  // SEÇÃO 2: TERMÔMETRO DE DEGRADAÇÃO SISTÊMICA (ESCALA 1 A 5)
  {
    id: 6,
    text: "Meu sono não é um processo reparador, é apenas um desmaio temporário entre episódios de exaustão cognitiva.",
    type: 'scale',
    category: 'Ciclo do Sono',
    foundation: 'Reparação celular e fase REM'
  },
  {
    id: 7,
    text: "Minha paciência para lidar com a incompetência alheia é inversamente proporcional ao número de abas abertas no meu navegador.",
    type: 'scale',
    category: 'Fadiga Cognitiva',
    foundation: 'Esgotamento do Córtex Pré-frontal'
  },
  {
    id: 8,
    text: "O brilho azul das telas é a última coisa que vejo antes de apagar e a primeira que busco ao acordar, e eu odeio cada segundo disso.",
    type: 'scale',
    category: 'Saúde Digital',
    foundation: 'Dependência de dopamina barata'
  },
  {
    id: 9,
    text: "Sinto que meu cérebro é um navegador com 47 abas abertas, 3 travadas e uma música tocando no fundo que eu não sei de onde vem.",
    type: 'scale',
    category: 'Ruído Mental',
    foundation: 'Carga cognitiva acumulada'
  },
  {
    id: 10,
    text: "Se um portal para uma vila silenciosa em Minas Gerais se abrisse agora, eu pularia nele sem nem pegar as chaves de casa ou o carregador.",
    type: 'scale',
    category: 'Vontade de Fuga',
    foundation: 'Intenção de sobrevivência extrema'
  }
];

const Act0StressQuiz: React.FC<Act0StressQuizProps> = ({ onComplete }) => {
  const [currentIdx, setCurrentIdx] = useState(-1); // -1 is Intro
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const isIntro = currentIdx === -1;
  const currentQuestion = QUESTIONS[currentIdx];

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
    setTimeout(() => {
      if (currentIdx < QUESTIONS.length - 1) {
        setCurrentIdx(prev => prev + 1);
      } else {
        calculateResult();
      }
    }, 300);
  };

  const calculateResult = () => {
    let totalScore = 0;
    Object.entries(answers).forEach(([id, val]) => {
      if (typeof val === 'boolean') {
        if (val) totalScore += 10;
      } else {
        // Fix: Explicitly cast 'val' to number to avoid the TypeScript error "The left-hand side of an arithmetic operation must be of type 'any', 'number', 'bigint' or an enum type."
        totalScore += (Number(val) * 2);
      }
    });
    setScore(totalScore);
    setShowResult(true);
  };

  const getStressLevel = () => {
    if (score > 80) return { title: 'COLAPSO SISTÊMICO IMINENTE', color: 'text-red-600', desc: 'Sua bateria social e biológica está operando em -4%. O sistema pode ejetar a qualquer momento.' };
    if (score > 50) return { title: 'FADIGA ADRENAL CRÔNICA', color: 'text-orange-500', desc: 'Você está funcionando no modo de segurança. Suas respostas são automáticas e sua alegria é um mito urbano.' };
    return { title: 'STRESS EM FASE DE INCUBAÇÃO', color: 'text-amber-500', desc: 'Você ainda finge que está tudo bem, mas sua pálpebra já começou a ensaiar um solo de bateria.' };
  };

  const stressInfo = getStressLevel();

  if (showResult) {
    return (
      <div className="flex-1 flex flex-col bg-zinc-950 text-white p-6 md:p-12 overflow-y-auto font-sans selection:bg-amber-500 selection:text-black no-scrollbar">
        <div className="max-w-3xl w-full mx-auto space-y-12 py-10 animate-in fade-in zoom-in duration-700">
          
          <div className="bg-zinc-900/50 border-2 border-white/5 rounded-[3rem] p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-amber-500 to-red-600"></div>
             
             <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Stethoscope className="w-12 h-12 text-red-600 animate-pulse" />
             </div>

             <div className="space-y-4">
                <h2 className="text-zinc-500 text-sm font-black uppercase tracking-[0.4em]">Diagnóstico de Triagem:</h2>
                <h1 className={`text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-none ${stressInfo.color}`}>
                  {stressInfo.title}
                </h1>
                <p className="text-zinc-400 text-lg md:text-2xl font-medium max-w-xl mx-auto leading-tight italic">
                  "{stressInfo.desc}"
                </p>
             </div>
          </div>

          <div className="bg-white text-zinc-950 rounded-[3rem] p-10 md:p-16 space-y-10 shadow-2xl relative">
            <div className="flex items-center justify-between border-b-2 border-zinc-200 pb-8">
               <div>
                  <h3 className="font-black text-2xl uppercase tracking-tighter italic">RECEITUÁRIO DE EMERGÊNCIA</h3>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Protocolo: #TIRADENTES-2026-REFUGIO</p>
               </div>
               <img src="https://i.postimg.cc/q7hsz5Yd/logo-refugio-quadrada-sem-fundo.png" className="w-16 h-16 grayscale opacity-20" alt="Stamp" />
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                 <div className="shrink-0 w-8 h-8 rounded-full border-2 border-zinc-950 flex items-center justify-center font-black">Rx</div>
                 <div className="space-y-6 flex-1">
                   <ul className="space-y-4 font-bold text-lg md:text-xl italic list-disc pl-5 leading-snug">
                     <li>Caminhar a pé pelos becos históricos de Tiradentes até perder a noção do tempo.</li>
                     <li>Subir a Serra de São José até a Cachoeira do Mangue (Imersão forçada em H2O natural).</li>
                     <li>Frequentar bares/restaurantes com música ao vivo (mínimo 3x/semana).</li>
                     <li>Administrar uma dose de cachaça mineira de alambique a cada 7 dias (uso oral).</li>
                     <li>Dieta Balanceada: Pão de queijo de 8 em 8 horas acompanhado de vinhos e queijos premiados.</li>
                   </ul>
                 </div>
              </div>

              <div className="bg-zinc-100 p-8 rounded-3xl border-l-8 border-red-600 space-y-4">
                 <h4 className="font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> RECOMENDAÇÃO FINAL
                 </h4>
                 <p className="text-xl md:text-2xl font-black text-zinc-900 leading-tight uppercase italic">
                    INTERNAÇÃO IMEDIATA DE PELO MENOS TRÊS DIAS NA POUSADA REFÚGIO TIRADENTES.
                 </p>
                 <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">O não cumprimento desta ordem pode resultar em obsolescência humana precoce.</p>
              </div>
            </div>

            <div className="pt-10 flex flex-col items-center gap-6">
              <div className="text-center">
                 <p className="font-black text-zinc-400 italic mb-1 uppercase tracking-tighter">Assinado digitalmente por:</p>
                 <p className="text-2xl font-black uppercase italic tracking-tighter text-zinc-950">Dr. Joaquim</p>
                 <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.3em]">CRM: Comitê do Repouso Mineiro</p>
              </div>

              <button 
                onClick={() => window.location.href = "https://api.whatsapp.com/send?phone=5532998135902&text=Oi%20Joaquim%2C%20o%20detector%20disse%20que%20meu%20caso%20%C3%A9%20grave!%20Quero%20ativar%20meu%20plano%20de%20fuga%20agora!"}
                className="w-full bg-[#00a884] hover:bg-[#009079] text-white py-8 rounded-3xl font-black text-2xl uppercase italic tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl group"
              >
                FALAR COM JOAQUIM <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>

              <button onClick={onComplete} className="text-zinc-400 font-bold uppercase text-xs tracking-widest hover:text-zinc-600 transition-colors">Voltar para a página principal</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isIntro) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-black text-white p-6 md:p-12 font-sans overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1010_0%,_#000000_100%)]"></div>
        <div className="max-w-lg w-full relative z-10 space-y-10 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto border border-red-600/40">
            <Thermometer className="w-12 h-12 text-red-600 animate-pulse" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
              STRESS <br/><span className="text-red-600">DETECTOR</span> <span className="text-zinc-700">2.0</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic">
              "Uai, o sistema não mente. Seu processador humano tá superaquecendo. Vamos fazer uma triagem rápida para ver se você precisa de um descanso... ou de uma internação imediata."
            </p>
          </div>
          <button 
            onClick={() => setCurrentIdx(0)}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-2xl font-black text-2xl uppercase italic tracking-widest transition-all shadow-[0_0_40px_rgba(220,38,38,0.3)] flex items-center justify-center gap-4 group"
          >
            INICIAR TRIAGEM <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-black text-white p-6 md:p-12 font-sans overflow-hidden relative" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
      
      <div className="max-w-3xl w-full mx-auto flex flex-col h-full relative z-10">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-12 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-black" />
             </div>
             <div>
                <h4 className="font-black text-xs uppercase tracking-widest text-zinc-500">QUESTÃO {currentIdx + 1}/{QUESTIONS.length}</h4>
                <p className="font-black text-red-600 text-[10px] uppercase tracking-[0.3em]">{currentQuestion.category}</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black italic text-zinc-800">{Math.round(((currentIdx + 1) / QUESTIONS.length) * 100)}%</div>
          </div>
        </div>

        {/* Question Area */}
        <div className="flex-1 flex flex-col justify-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="space-y-4">
            {currentQuestion.foundation && (
               <span className="bg-red-600/10 text-red-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-red-600/20">
                  FUNDAMENTO: {currentQuestion.foundation}
               </span>
            )}
            <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight text-white drop-shadow-2xl">
              "{currentQuestion.text}"
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {currentQuestion.type === 'boolean' ? (
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleAnswer(true)}
                  className="bg-white text-black py-8 rounded-3xl font-black text-2xl uppercase italic tracking-widest hover:bg-zinc-200 transition-all shadow-xl flex items-center justify-center gap-3"
                >
                  SIM <CheckCircle2 className="w-8 h-8" />
                </button>
                <button 
                  onClick={() => handleAnswer(false)}
                  className="bg-zinc-900 border border-white/10 text-white py-8 rounded-3xl font-black text-2xl uppercase italic tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
                >
                  NÃO <AlertTriangle className="w-8 h-8 text-zinc-600" />
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((val) => (
                    <button 
                      key={val}
                      onClick={() => handleAnswer(val)}
                      className="aspect-square bg-zinc-900 border border-white/10 rounded-2xl flex flex-col items-center justify-center hover:bg-red-600 hover:text-black hover:border-red-600 transition-all group"
                    >
                      <span className="text-3xl font-black italic">{val}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">
                   <span>QUASE UM MONGE</span>
                   <span>VOU EXPLODIR AGORA</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-12 pb-6 flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
           <Info className="w-4 h-4" />
           <p className="text-[10px] font-bold uppercase tracking-[0.2em]">O Stress Detector utiliza algoritmos de processamento de exaustão moderna. Responda com honestidade visceral.</p>
        </div>
      </div>
    </div>
  );
};

export default Act0StressQuiz;