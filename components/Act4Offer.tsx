import React from 'react';
import { UserProfile } from '../types';
import { HERO_IMAGE_URL, LOGO_URL } from '../constants';
import { 
  Coffee, 
  Car, 
  ArrowRight, 
  MapPin, 
  Navigation, 
  Eye, 
  TreePine, 
  ShieldAlert 
} from 'lucide-react';

interface Act4OfferProps {
  userProfile: UserProfile;
  onAbort?: () => void;
}

const Act4Offer: React.FC<Act4OfferProps> = ({ userProfile, onAbort }) => {
  const BOOKING_URL = "https://api.whatsapp.com/send?phone=5532998135902&text=Oi%20Joaquim%2C%20gostaria%20de%20ativar%20meu%20plano%20de%20fuga%21";
  const VIRTUAL_TOUR_URL = "https://www.google.com/maps/embed?pb=!4v1769471411322!6m8!1m7!1sCAoSHENJQUJJaERwb19wdS1DUVpLN2pRY1g1QW81ZkE.!2m2!1d-21.10843422899292!2d-44.16852750791136!3f353.93514061676234!4f-0.5637616834684138!5f0.7820865974627469";
  
  const handleBooking = () => { window.location.href = BOOKING_URL; };

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] text-white overflow-y-auto scroll-smooth font-sans selection:bg-amber-500 selection:text-black h-full">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-end p-6 md:p-16 overflow-hidden shrink-0">
        <div 
          className="absolute inset-0 bg-cover bg-center animate-slow-zoom opacity-80"
          style={{ backgroundImage: `url('${HERO_IMAGE_URL}')`, backgroundPosition: 'center 40%' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        
        <div className="relative z-30 max-w-5xl w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 pb-16">
          <div className="space-y-4">
            <div className="bg-amber-500 text-black text-[11px] md:text-[13px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl w-fit">
              PLANO DE FUGA ATIVADO
            </div>
            <h1 className="text-5xl md:text-[9rem] xl:text-[10rem] font-black uppercase tracking-tighter leading-[0.85] italic">
              FUJA DA<br/> <span className="text-amber-500">ROTINA </span>AGORA!
            </h1>
            <p className="text-lg md:text-3xl text-zinc-100 max-w-3xl font-medium leading-tight border-l-4 border-amber-500 pl-6">
              Muito prazer, eu sou o Joaquim e estou aqui para ajudá-lo no seu plano de fuga. Bem-vindo ao seu Refúgio em Tiradentes.
            </p>
          </div>
          <button 
            onClick={handleBooking}
            className="w-full md:w-fit bg-amber-600 hover:bg-amber-500 text-white px-10 md:px-14 py-7 rounded-2xl font-black text-xl uppercase italic tracking-widest transition-all shadow-2xl flex items-center justify-center gap-4 group"
          >
            PERSONALIZAR PLANO DE FUGA <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

      {/* Plano de Fuga Section */}
      <section className="bg-zinc-950 py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-amber-500">
                <Navigation className="w-5 h-5" /> 
                <span className="text-sm font-black uppercase tracking-[0.4em]">PLANO DE FUGA PERSONALIZADO.</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter">VEM PRO <span className="text-amber-500">REFÚGIO.</span></h2>
              <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed font-light italic text-center">
                "Fuja… da rotina… agora! #VemProRefúgioTiradentes"
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: Coffee, title: "Café da Manhã Mineiro", desc: "Mesa farta típica de casa de vó" },
                { icon: Car, title: "Estacionamento Coberto", desc: "Deixe seu carro seguro e caminhe" },
                { icon: MapPin, title: "Localização Privilegiada", desc: "Perto do centro, longe do barulho" },
                { icon: TreePine, title: "Paz, Tranquilidade e Sossego", desc: "Um refúgio para recuperar energias" }
              ].map((item, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-zinc-900 border border-white/5 hover:border-amber-500/30 transition-all">
                  <item.icon className="w-10 h-10 text-amber-500 mb-4" />
                  <h4 className="font-black text-sm uppercase tracking-wider mb-2">{item.title}</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed uppercase font-bold">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="aspect-video rounded-[3rem] overflow-hidden border border-white/10 bg-black shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src="https://www.youtube.com/embed/KYBYv6fQX0o?autoplay=0" 
              frameBorder="0" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Tour Virtual Section */}
      <section className="py-24 md:py-32 px-6 bg-black text-center space-y-16">
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-4 text-amber-500">
            <Eye className="w-6 h-6 animate-pulse" /> 
            <span className="text-sm font-black uppercase tracking-[0.6em]">TELEPORTE-SE PARA O REFÚGIO</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight text-white">
            QUE TAL CONHECER O <br/> <span className="text-amber-500">REFÚGIO</span> DE PERTO?
          </h2>
          <p className="text-zinc-400 text-xl md:text-2xl max-w-2xl mx-auto font-light">
            Que tal conhecer o Refúgio mais de perto?
          </p>
        </div>
        <div className="max-w-5xl mx-auto aspect-video md:min-h-[600px] rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(245,158,11,0.1)] relative">
          <iframe 
            src={VIRTUAL_TOUR_URL} 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy"
          ></iframe>
        </div>
        <p className="text-xs md:text-sm text-zinc-500 font-bold uppercase tracking-[0.2em] max-w-2xl mx-auto leading-relaxed">
          Clique nas setas para caminhar pelo Refúgio e conhecer nossos quartos! Sinta-se em casa!
        </p>
      </section>

      {/* CTA Final Section */}
      <section className="py-32 md:py-48 px-6 bg-[#050505] text-center space-y-12 border-t border-white/5">
        <h3 className="text-5xl md:text-[7rem] font-black italic uppercase tracking-tighter text-white">
          ESTÁ ESPERANDO <span className="text-amber-500 underline decoration-white/10">O QUÊ?</span>
        </h3>
        <p className="text-zinc-400 text-xl md:text-3xl font-medium uppercase tracking-widest">
          A sua única missão aqui? Descansar!
        </p>
        <div className="w-full max-w-lg mx-auto space-y-4">
          <button 
            onClick={handleBooking} 
            className="w-full bg-white text-black py-7 md:py-9 rounded-[2rem] md:rounded-[2.5rem] font-black text-2xl uppercase tracking-widest hover:bg-amber-500 transition-all shadow-2xl active:scale-95"
          >
            CONFIRMAR PLANO DE FUGA
          </button>
          <button 
            onClick={onAbort} 
            className="w-full bg-transparent border-2 border-red-900/30 text-red-600/50 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:text-red-600 hover:border-red-600 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <ShieldAlert className="w-4 h-4" /> ABORTAR MISSÃO
          </button>
        </div>
      </section>

      <footer className="py-24 text-center flex flex-col items-center gap-10 bg-black shrink-0">
         <div className="w-48 md:w-64 aspect-square bg-white rounded-full p-10 flex items-center justify-center shadow-xl">
            <img src={LOGO_URL} alt="Logo" className="w-full h-auto object-contain" />
         </div>
         <div className="space-y-6 w-full px-6">
           <p className="text-sm md:text-2xl text-zinc-500 uppercase tracking-[0.4em] md:tracking-[0.8em] font-black leading-tight italic text-center">
             Tú és o meu Refúgio <br className="md:hidden" /> e a minha fortaleza.
           </p>
           <p className="text-[10px] text-zinc-700 uppercase tracking-[0.4em] font-black">
             Feito com ❤️ pel'O Forno
           </p>
         </div>
      </footer>
    </div>
  );
};

export default Act4Offer;