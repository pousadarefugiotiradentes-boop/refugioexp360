
import React from 'react';
import { UserProfile } from '../types';
import { HERO_IMAGE_URL, LOGO_URL } from '../constants';
import { 
  Coffee, 
  Car, 
  ArrowRight, 
  MapPin, 
  ShieldCheck,
  Star,
  Heart,
  Navigation,
  Eye,
  Maximize2,
  TreePine,
  ShieldAlert
} from 'lucide-react';

interface Act4OfferProps {
  userProfile: UserProfile;
  onAbort?: () => void;
}

const Act4Offer: React.FC<Act4OfferProps> = ({ userProfile, onAbort }) => {
  const BOOKING_URL = "https://www.refugiotiradentes.com.br/";
  const VIRTUAL_TOUR_URL = "https://www.google.com/maps/embed?pb=!4v1769471411322!6m8!1m7!1sCAoSHENJQUJJaERwb19wdS1DUVpLN2pRY1g1QW81ZkE.!2m2!1d-21.10843422899292!2d-44.16852750791136!3f353.93514061676234!4f-0.5637616834684138!5f0.7820865974627469";
  
  const YOUTUBE_ID = "KYBYv6fQX0o";
  const YOUTUBE_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_ID}?enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`;
  
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2000";

  const handleBooking = () => {
    window.location.href = BOOKING_URL;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-white overflow-y-auto scroll-smooth font-sans selection:bg-amber-500 selection:text-black">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[750px] flex flex-col justify-end p-6 md:p-16 overflow-hidden shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center scale-100 animate-slow-zoom transition-transform duration-[30s]"
          style={{ 
            backgroundImage: `url('${HERO_IMAGE_URL}'), url('${FALLBACK_IMAGE}')`,
            backgroundPosition: 'center 40%' 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent z-10" />
        
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 pointer-events-none hidden lg:flex justify-between px-16 xl:px-32">
           <div className="w-44 h-44 bg-white rounded-full flex flex-col items-center justify-center p-5 border-[14px] border-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-left-24 duration-1000 rotate-[-5deg]">
              <img src={LOGO_URL} alt="Selo" className="w-24 opacity-95" />
              <span className="text-[9px] font-black text-zinc-500 mt-2 uppercase tracking-widest">Est. 2004</span>
           </div>
           <div className="w-44 h-44 bg-white rounded-full flex flex-col items-center justify-center p-5 border-[14px] border-zinc-900 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] animate-in slide-in-from-right-24 duration-1000 rotate-[5deg]">
              <img src={LOGO_URL} alt="Selo" className="w-24 opacity-95" />
              <span className="text-[9px] font-black text-zinc-500 mt-2 uppercase tracking-widest">Tiradentes</span>
           </div>
        </div>
        
        <div className="relative z-30 max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-500 text-black text-[11px] md:text-[13px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.6)]">
                PLANO DE FUGA ATIVADO
              </div>
              <div className="flex -space-x-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />)}
              </div>
            </div>
            
            <h1 className="text-6xl md:text-[9rem] xl:text-[11rem] font-black uppercase tracking-tighter leading-[0.75] italic drop-shadow-2xl">
              FUJA DA<br/>
              <span className="text-amber-500">ROTINA </span>AGORA!
            </h1>
            
            <p className="text-xl md:text-3xl text-zinc-100 max-w-3xl font-medium leading-tight drop-shadow-2xl border-l-4 border-amber-500 pl-6">
              Muito prazer, eu sou o Joaquim e estou aqui para ajudá-lo no seu plano de fuga. <span className="italic font-black text-white">Sejam bem-vindos ao seu Refúgio em Tiradentes.</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button 
              onClick={handleBooking}
              className="bg-amber-600 hover:bg-amber-500 text-white px-14 py-7 rounded-2xl font-black text-lg uppercase italic tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_60px_-15px_rgba(217,119,6,0.6)] flex items-center gap-4 group"
            >
              PERSONALIZAR PLANO DE FUGA
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Seção de Experiência */}
      <section className="bg-zinc-950 py-32 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-center relative z-10">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Navigation className="w-5 h-5 text-amber-500" />
                <span className="text-amber-500 text-sm font-black uppercase tracking-[0.4em]">Um Refúgio (quase) secreto</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-none">
                PLANO DE <span className="text-amber-500">FUGA.</span>
              </h2>
              <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed font-light">
                Fuja… da rotina… agora! #VemProRefúgioTiradentes.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { icon: Coffee, title: "Café da Manhã Mineiro", desc: "Pão de queijo quentinho, bolos feitos em casa. Mesa farta típica de casa de vó" },
                { icon: Car, title: "Estacionamento Coberto", desc: "Deixe seu carro seguro aqui e vai caminhar por Tiradentes sossegado" },
                { icon: MapPin, title: "Localização Privilegiada", desc: "Perto do centro o bastante para ir a pé, longe o suficiente para o seu sossego" },
                { icon: TreePine, title: "Paz, Tranquilidade e Sossego", desc: "Um refúgio seguro para descansar e recuperar as energias" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col gap-4 p-8 rounded-[2rem] bg-zinc-900 border border-white/5 hover:border-amber-500/30 transition-all group">
                  <item.icon className="w-10 h-10 text-amber-500" />
                  <div>
                    <h4 className="font-black text-base md:text-lg uppercase tracking-wider mb-2 text-white">{item.title}</h4>
                    <p className="text-sm md:text-base text-zinc-500 leading-relaxed uppercase tracking-tighter">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative group">
             <div className="absolute -inset-10 bg-amber-500/5 blur-[100px] rounded-full"></div>
             <div className="relative aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 group-hover:scale-[1.01] transition-transform duration-700 bg-black">
                <iframe 
                  width="100%" 
                  height="100%" 
                  src={YOUTUBE_EMBED_URL} 
                  title="Refúgio Tiradentes Experience"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
             </div>
          </div>
        </div>
      </section>

      {/* Portal de Imersão (Tour Virtual) */}
      <section className="py-32 px-6 bg-black relative">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-4 text-amber-500 mb-2">
              <Eye className="w-6 h-6 animate-pulse" />
              <span className="text-sm font-black uppercase tracking-[0.6em]">Tour Virtual 360</span>
            </div>
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-white">
              TELEPORTE-SE PARA<br/>
              O <span className="text-amber-500">REFÚGIO</span>
            </h2>
            <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto font-light">
              Que tal conhecer o seu Refúgio mais de perto e sentir-se como se já estivesse aqui?
            </p>
          </div>

          <div className="relative group max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-900/50 via-amber-500/20 to-amber-900/50 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
              <div className="bg-zinc-800/80 px-8 py-3 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-[12px] font-black uppercase tracking-widest text-zinc-400">Portal 01: Entrada Principal</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-[11px] font-mono text-zinc-600 uppercase hidden sm:block">Lat: -21.1084 | Long: -44.1685</div>
                  <Maximize2 className="w-5 h-5 text-zinc-600" />
                </div>
              </div>

              <div className="w-full aspect-[4/3] sm:aspect-video md:min-h-[600px]">
                <iframe 
                  src={VIRTUAL_TOUR_URL} 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>

              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]"></div>
            </div>
          </div>
          
          <div className="text-center max-w-3xl mx-auto px-4">
            <p className="text-sm md:text-base text-zinc-500 font-bold uppercase tracking-wider leading-relaxed bg-zinc-900/40 p-6 rounded-3xl border border-white/5 shadow-inner">
              Clique nas setas para caminhar pelo Refúgio, arraste para "mover a cabeça" para os lados, entre no Salão do café e nos quartos Standard no térreo ou suba as escadas e conheça os quartos Superiores! Sinta-se em casa!
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-40 px-6 bg-[#050505] relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10 flex flex-col items-center">
          <h3 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-[0.85] text-white">
            TÁ ESPERANDO <span className="text-amber-500 underline decoration-white/10">O QUÊ?</span>
          </h3>
          <p className="text-zinc-400 text-xl md:text-3xl font-medium mb-4">
            A sua única missão aqui? Descansar!
          </p>
          <div className="w-full max-w-lg space-y-4">
            <button 
              onClick={handleBooking}
              className="w-full bg-white text-black py-8 rounded-[2.5rem] font-black text-2xl uppercase tracking-widest hover:bg-amber-500 transition-all shadow-[0_40px_80px_-20px_rgba(255,255,255,0.15)] active:scale-95 group"
            >
              CONFIRMAR PLANO DE FUGA
            </button>
            
            <button 
              onClick={onAbort}
              className="w-full bg-transparent border-2 border-red-900/30 text-red-600/50 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.3em] hover:bg-red-900/10 hover:text-red-600 hover:border-red-600 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <ShieldAlert className="w-4 h-4" />
              ABORTAR MISSÃO
            </button>
          </div>
        </div>
      </section>

      <footer className="py-24 text-center flex flex-col items-center gap-8 bg-black">
         {/* Box circular da logo - aspect-square e rounded-full para formar um círculo perfeito */}
         <div className="w-full max-w-lg aspect-square bg-white rounded-full p-16 flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.05)] transition-transform hover:scale-[1.02]">
            <img src={LOGO_URL} alt="Logo Refúgio" className="w-full max-w-[320px] h-auto object-contain" />
         </div>
         
         <div className="space-y-6 w-full px-4 overflow-hidden">
           {/* Frase com quebra de linha forçada: "Tu és o meu Refúgio" / "e minha fortaleza." */}
           <p className="text-sm sm:text-lg md:text-xl text-zinc-500 uppercase tracking-[0.2em] sm:tracking-[0.4em] md:tracking-[0.6em] font-black leading-tight mx-auto">
             Tú és o meu Refúgio <br /> e minha fortaleza.
           </p>
           <p className="text-[10px] sm:text-[11px] text-zinc-700 uppercase tracking-[0.4em] font-bold">
             Feito com ❤️ pel'O Forno
           </p>
         </div>

         <div className="flex gap-4 opacity-10">
            <Heart className="w-5 h-5 text-red-500 animate-pulse" />
         </div>
      </footer>
    </div>
  );
};

export default Act4Offer;
