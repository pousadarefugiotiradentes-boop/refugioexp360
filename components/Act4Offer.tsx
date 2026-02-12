import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { HERO_IMAGE_URL, LOGO_URL } from '../constants';
import { 
  ArrowRight, 
  MapPin, 
  ChevronDown,
  RefreshCw,
  ShieldAlert,
  ClipboardCheck,
  MessageSquare,
  Activity,
  Calendar,
  Check,
  Coffee,
  Car,
  Wind,
  ChevronLeft,
  ChevronRight,
  Heart
} from 'lucide-react';

interface Act4OfferProps {
  userProfile: UserProfile;
  onAbort?: () => void;
  onRestart?: () => void;
  onQuiz?: () => void;
}

const TESTIMONIAL_CARDS = [
  "https://i.postimg.cc/nzzpgc3G/1.jpg",
  "https://i.postimg.cc/76Wwk8Rm/10.jpg",
  "https://i.postimg.cc/Qtyh3Gzm/11.jpg",
  "https://i.postimg.cc/26KrDRtT/13.jpg",
  "https://i.postimg.cc/wvvgZTw2/3.jpg",
  "https://i.postimg.cc/XJJ4m7s8/4.jpg",
  "https://i.postimg.cc/PxxT9rSM/5.jpg",
  "https://i.postimg.cc/9MMCKFLn/6.jpg",
  "https://i.postimg.cc/HxxdRs6v/7.jpg",
  "https://i.postimg.cc/sXXsqDTL/8.jpg",
  "https://i.postimg.cc/633tg5MF/9.jpg"
];

const RevealOnScroll: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    if (domRef.current) observer.observe(domRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={domRef} className={`transition-all duration-1000 transform ${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
      {children}
    </div>
  );
};

const Act4Offer: React.FC<Act4OfferProps> = ({ userProfile, onAbort, onRestart, onQuiz }) => {
  const BOOKING_URL = "https://api.whatsapp.com/send?phone=5532998135902&text=Oi%20Joaquim%2C%20gostaria%20de%20ativar%20meu%20plano%20de%20fuga%21";
  const VIRTUAL_TOUR_URL = "https://www.google.com/maps/embed?pb=!4v1769471411322!6m8!1m7!1sCAoSHENJQUJJaERwb19wdS1DUVpLN2pRY1g1QW81ZkE.!2m2!1d-21.10843422899292!2d-44.16852750791136!3f353.93514061676234!4f-0.5637616834684138!5f0.7820865974627469";
  
  const tourSectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const [personalization, setPersonalization] = useState({
    cafe: true,
    estacionamento: true,
    localizacao: true,
    paz: true
  });

  const scrollToTour = () => {
    tourSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleOption = (key: keyof typeof personalization) => {
    setPersonalization(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.querySelector('div')?.clientWidth || 420;
      const gap = 24;
      const scrollAmount = cardWidth + gap;
      
      container.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
      setIsPaused(true);
      setTimeout(() => setIsPaused(false), 10000);
    }
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 50) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const cardWidth = container.querySelector('div')?.clientWidth || 420;
          const gap = 24;
          container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-white overflow-y-auto scroll-smooth font-sans selection:bg-amber-500 selection:text-black h-full no-scrollbar">
      {/* Hero Section */}
      <section 
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest('button')) {
            scrollToTour();
          }
        }}
        className="relative min-h-screen flex flex-col justify-end p-6 md:p-16 overflow-hidden shrink-0 cursor-pointer"
      >
        <div className="absolute inset-0 bg-cover bg-center animate-slow-zoom opacity-80" style={{ backgroundImage: `url('${HERO_IMAGE_URL}')`, backgroundPosition: 'center 40%' }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        
        <div className="absolute top-8 left-8 z-30 flex items-center gap-4">
          <img 
            src={LOGO_URL} 
            className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full p-3 shadow-2xl transition-transform hover:scale-105" 
            alt="Logo Refúgio" 
          />
        </div>

        <div className="relative z-30 max-w-5xl w-full mx-auto space-y-8 pb-24">
          <div className="space-y-4">
            <div className="bg-amber-500 text-black text-[11px] md:text-[13px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl w-fit">PLANO DE FUGA ATIVADO</div>
            <h1 className="text-5xl md:text-[9rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] italic">FUJA DA<br/> <span className="text-amber-500">ROTINA </span>AGORA!</h1>
            <p className="text-lg md:text-3xl text-zinc-100 max-w-3xl font-medium leading-tight border-l-4 border-amber-500 pl-6">Muito prazer, eu sou o Joaquim e estou aqui para ajudá-lo no seu plano de fuga. Bem-vindo ao seu Refúgio em Tiradentes.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = BOOKING_URL;
              }} 
              className="w-full md:w-fit bg-amber-600 hover:bg-amber-500 text-white px-10 md:px-14 py-7 rounded-2xl font-black text-xl uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 group"
            >
              ATIVAR MEU PLANO DE FUGA <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
          <ChevronDown className="w-10 h-10 text-zinc-500" />
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-zinc-950 py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <RevealOnScroll className="space-y-10">
            <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
              O SEU <span className="text-amber-500">REFÚGIO</span>
            </h2>
            <div className="space-y-6 text-zinc-400 text-lg md:text-2xl leading-relaxed">
              <p>Localizada a poucos passos do centro histórico, tem estacionamento coberto e um generoso café da manhã mineiro inclusos. O Refúgio é seu porto seguro em Tiradentes, seu ponto de fuga da rotina e extração da realidade.</p>
              <p>Considerada uma das melhores pousadas da cidade pelo Prêmio Traveller Review Awards 2025.</p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll className="relative group" delay={200}>
            <div className="absolute -inset-4 bg-amber-500/10 rounded-[3rem] blur-3xl group-hover:bg-amber-500/20 transition-all"></div>
            <img src={HERO_IMAGE_URL} className="relative rounded-[3rem] w-full aspect-[4/5] object-cover shadow-2xl grayscale hover:grayscale-0 transition-all duration-1000 border border-white/5" alt="Fachada Refúgio" />
          </RevealOnScroll>
        </div>
      </section>

      {/* Intermediate CTA Button */}
      <section className="bg-black py-16 px-6 flex justify-center">
        <RevealOnScroll className="w-full flex justify-center">
          <button 
            onClick={() => window.location.href = BOOKING_URL} 
            className="w-full md:w-fit bg-amber-600 hover:bg-amber-500 text-white px-12 py-8 rounded-3xl font-black text-xl uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 group"
          >
            FAZER RESERVA <Calendar className="w-8 h-8 group-hover:rotate-12 transition-transform" />
          </button>
        </RevealOnScroll>
      </section>

      {/* PERSONALIZAÇÃO SECTION */}
      <section className="bg-zinc-950 py-24 px-6 border-y border-white/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
        <div className="max-w-4xl mx-auto space-y-16">
          <RevealOnScroll className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">PERSONALIZE SEU <br/><span className="text-amber-500">PLANO DE FUGA</span></h2>
            <p className="text-zinc-500 uppercase text-xs font-black tracking-[0.4em]">Selecione os itens essenciais para sua extração</p>
          </RevealOnScroll>

          <RevealOnScroll delay={200} className="flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              {[
                { id: 'cafe', label: 'Café da manhã mineiro', icon: Coffee },
                { id: 'estacionamento', label: 'Estacionamento coberto', icon: Car },
                { id: 'localizacao', label: 'Localização Privilegiada', icon: MapPin },
                { id: 'paz', label: 'Paz e sossego', icon: Wind }
              ].map((item) => {
                const isSelected = personalization[item.id as keyof typeof personalization];
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggleOption(item.id as keyof typeof personalization)}
                    className={`
                      cursor-pointer group flex items-center justify-between p-6 md:p-8 rounded-3xl border-2 transition-all duration-300
                      ${isSelected 
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)]' 
                        : 'bg-white/5 border-white/10 opacity-50'}
                    `}
                  >
                    <div className="flex items-center gap-5">
                      <div className={`p-3 rounded-2xl transition-colors ${isSelected ? 'bg-amber-500 text-black' : 'bg-white/10 text-white'}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className={`text-lg md:text-xl font-black uppercase italic tracking-tight ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                        {item.label}
                      </span>
                    </div>
                    <div className={`
                      w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all
                      ${isSelected ? 'bg-amber-500 border-amber-500' : 'border-white/20'}
                    `}>
                      <Check className="w-5 h-5 text-black stroke-[4px] opacity-0 transition-opacity" style={{ opacity: isSelected ? 1 : 0 }} />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8 text-center space-y-10 w-full flex flex-col items-center">
              <p className="text-amber-500/60 text-[10px] md:text-xs font-black uppercase tracking-widest">
                * ✓ Todos os itens inclusos em todos os nossos pacotes.
              </p>
              
              <button 
                onClick={() => window.location.href = BOOKING_URL} 
                className="w-full md:w-fit bg-amber-600 hover:bg-amber-500 text-white px-12 py-8 rounded-3xl font-black text-xl uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 group"
              >
                FALAR COM O JOAQUIM <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Virtual Tour Section */}
      <section ref={tourSectionRef} className="py-20 md:py-32 px-6 bg-black relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[120px]"></div>
        <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
          <RevealOnScroll className="text-center space-y-4">
            <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter italic">RECONHECIMENTO <span className="text-amber-500">360º</span></h2>
            <p className="text-zinc-500 uppercase text-xs md:text-sm font-black tracking-[0.4em]">Explore nosso território antes da extração</p>
          </RevealOnScroll>
          
          <div className="space-y-12 flex flex-col items-center">
            <RevealOnScroll className="h-[65vh] md:h-auto md:aspect-video w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl relative group">
              <iframe 
                src={VIRTUAL_TOUR_URL} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy"
                title="Tour Virtual Refúgio Tiradentes"
                className="grayscale-[0.5] contrast-125 group-hover:grayscale-0 transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border-[1rem] md:border-[1.5rem] border-black/20"></div>
            </RevealOnScroll>

            <RevealOnScroll delay={200} className="w-full flex justify-center">
              <button 
                onClick={() => window.location.href = BOOKING_URL} 
                className="w-full md:w-fit bg-amber-600 hover:bg-amber-500 text-white px-12 py-8 rounded-3xl font-black text-xl uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 group"
              >
                ATIVAR PLANO DE FUGA <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel Section - Optimized UX */}
      <section className="bg-zinc-950 py-24 border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <RevealOnScroll className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-amber-500 font-black text-xs uppercase tracking-[0.3em]">
                <Heart className="w-4 h-4 fill-current" /> Relatos de Fuga Bem Sucedida
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">O QUE ANDAM <span className="text-amber-500">SUSPIRANDO</span> POR AÍ</h2>
              <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-widest italic opacity-60">Fragmentos de realidade colhidos diretamente de quem já escapou.</p>
            </div>
            <div className="hidden md:flex gap-4">
              <button 
                onClick={() => scrollTestimonials('left')}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-amber-500/50 transition-all group"
                aria-label="Anterior"
              >
                <ChevronLeft className="w-6 h-6 text-zinc-400 group-hover:text-amber-500" />
              </button>
              <button 
                onClick={() => scrollTestimonials('right')}
                className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 hover:border-amber-500/50 transition-all group"
                aria-label="Próximo"
              >
                <ChevronRight className="w-6 h-6 text-zinc-400 group-hover:text-amber-500" />
              </button>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={300} className="relative group/carousel">
            {/* Carousel Navigation Arrows - Floating Style */}
            <button 
              onClick={() => scrollTestimonials('left')}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 hidden md:flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all shadow-2xl group/btn"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-7 h-7 group-hover/btn:-translate-x-1 transition-transform" />
            </button>
            
            <button 
              onClick={() => scrollTestimonials('right')}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-40 w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 hidden md:flex items-center justify-center hover:bg-amber-500 hover:text-black transition-all shadow-2xl group/btn"
              aria-label="Próximo"
            >
              <ChevronRight className="w-7 h-7 group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <div 
              ref={scrollContainerRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 cursor-grab active:cursor-grabbing scroll-smooth"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {TESTIMONIAL_CARDS.map((url, idx) => (
                <div 
                  key={idx} 
                  className="min-w-[320px] md:min-w-[440px] aspect-square snap-start rounded-[2.5rem] overflow-hidden border border-white/10 bg-transparent group shadow-2xl hover:border-amber-500/40 hover:scale-[1.02] transition-all duration-500"
                >
                  <img 
                    src={url} 
                    alt={`Depoimento ${idx + 1}`} 
                    className="w-full h-full object-contain grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Mobile-only visual indicator */}
            <div className="md:hidden flex justify-center gap-2 mt-4">
               {TESTIMONIAL_CARDS.map((_, i) => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-800 transition-colors" />
               ))}
            </div>

            {/* Edge fading effects */}
            <div className="absolute top-0 left-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none hidden md:block z-30"></div>
            <div className="absolute top-0 right-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none hidden md:block z-30"></div>
          </RevealOnScroll>
        </div>
      </section>

      {/* FINAL QUIZ INVITATION */}
      <section className="bg-zinc-950 py-32 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <RevealOnScroll className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/40">
                <Activity className="w-8 h-8 text-amber-500" />
              </div>
            </div>
            <h2 className="text-3xl md:text-6xl font-black uppercase italic tracking-tighter leading-tight">
              DESEJA DESCOBRIR O SEU <br/><span className="text-amber-500">NÍVEL DE ESTRESSE ATUAL?</span>
            </h2>
            <p className="text-zinc-500 text-sm md:text-xl font-medium max-w-2xl mx-auto italic">
              "Faça o teste, responda a um rápido Quiz e descubra! Emita o relatório completo ou o seu atestado de afastamento médico em caso de níveis extremos de stress. 🤭"
            </p>
          </RevealOnScroll>
          
          <RevealOnScroll delay={300}>
            <button 
              onClick={onQuiz} 
              className="w-full md:w-fit bg-white/5 hover:bg-white/10 text-white border border-white/20 px-12 py-8 rounded-3xl font-black text-xl uppercase italic tracking-widest transition-all flex items-center justify-center gap-4 mx-auto group shadow-2xl"
            >
              <ClipboardCheck className="w-8 h-8 text-amber-500" />
              REALIZAR DIAGNÓSTICO COMPLETO<br/>STRESS_DETECTOR QUIZ 2.0
            </button>
          </RevealOnScroll>
        </div>
      </section>

      {/* Control Buttons Section */}
      <section className="bg-black py-12 px-6 flex flex-col items-center gap-6">
        <button 
          onClick={onRestart}
          className="flex items-center gap-3 text-zinc-500 hover:text-white uppercase text-xs font-black tracking-[0.3em] transition-colors py-4"
        >
          <RefreshCw className="w-4 h-4" /> REINICIAR EXPERIÊNCIA
        </button>

        <button 
          onClick={onAbort}
          className="flex items-center gap-3 text-red-900/40 hover:text-red-600 uppercase text-xs font-black tracking-[0.3em] transition-colors py-4 border border-red-900/20 px-8 rounded-full"
        >
          <ShieldAlert className="w-4 h-4" /> ABORTAR MISSÃO
        </button>
      </section>

      {/* Pre-Footer CTA */}
      <div className="bg-[#050505] pt-16 flex flex-col items-center gap-4 px-6">
        <button 
          onClick={() => window.location.href = BOOKING_URL} 
          className="w-full md:w-fit bg-amber-600 hover:bg-amber-500 text-white px-12 py-7 rounded-3xl font-black text-xl uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 group"
        >
          FALE COM O JOAQUIM <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform" />
        </button>
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.4em] mb-4">E PERSONALIZE SEU PLANO DE FUGA!</p>
      </div>

      {/* Footer */}
      <footer className="bg-[#050505] py-20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-12 text-center">
          <div className="space-y-6 flex flex-col items-center">
            <img src={LOGO_URL} className="w-24 h-24 bg-white rounded-full p-2 shadow-xl" alt="Logo Refúgio" />
            <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
              Rua Manoel Moraes Batista Júnior 253 Tiradentes
            </p>
          </div>
          <div className="space-y-4 text-center">
            <p className="text-zinc-500 text-xs font-black uppercase tracking-[0.4em] italic mb-8">Tú és o meu Refúgio e minha fortaleza.</p>
            <div className="flex justify-center gap-6">
              <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-black">STRESS_DETECTOR</span>
              <span className="text-[10px] text-zinc-800 uppercase tracking-widest font-black">© Feito com 🤎 pel'O Forno</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Act4Offer;