
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { 
  Phone, 
  PhoneOff, 
  MicOff,
  Speaker, 
  Video, 
  Lock, 
  Maximize2
} from 'lucide-react';

interface Act3PhoneCallProps {
  userProfile: UserProfile;
  onComplete: () => void;
  onDecline: () => void;
  onVolumeChange?: (volume: number) => void;
}

const Act3PhoneCall: React.FC<Act3PhoneCallProps> = ({ userProfile, onComplete, onDecline, onVolumeChange }) => {
  const [status, setStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [timer, setTimer] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  
  const vibrateRef = useRef<HTMLAudioElement | null>(null);
  const joaquimVoiceRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);
  
  const vibratePlayPromise = useRef<Promise<void> | null>(null);
  const voicePlayPromise = useRef<Promise<void> | null>(null);
  const heartbeatPlayPromise = useRef<Promise<void> | null>(null);

  const VIBRATE_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/ov2kevkt11lokxvnbs44g/celular-vibrando.mp3?rlkey=jxwpvwzv1tszkhst44pt3fyvl";
  const JOAQUIM_VOICE_URL = "https://dl.dropboxusercontent.com/scl/fi/syvbwm8r21kdctghvlkmv/joaquim-chamando.mp3?rlkey=34rdytesptpapd79v128gmtcw";
  const joaquimAvatar = "https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png";

  const safePause = (audioRef: React.RefObject<HTMLAudioElement | null>, promiseRef: React.RefObject<Promise<void> | null>) => {
    if (audioRef.current && promiseRef.current) {
      promiseRef.current
        .then(() => {
          if (audioRef.current) audioRef.current.pause();
        })
        .catch(() => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  useEffect(() => {
    const vibrateAudio = new Audio(VIBRATE_SFX_URL);
    vibrateAudio.loop = true;
    vibrateAudio.volume = 0.8;
    vibrateRef.current = vibrateAudio;
    
    const voiceAudio = new Audio(JOAQUIM_VOICE_URL);
    voiceAudio.preload = "auto";
    voiceAudio.volume = 1.0;
    voiceAudio.onended = () => {
      setTimeout(() => {
        setStatus('ended');
        setFadeOut(true);
        setTimeout(onComplete, 1200);
      }, 500);
    };
    joaquimVoiceRef.current = voiceAudio;

    if (status === 'ringing') {
      vibratePlayPromise.current = vibrateAudio.play();
      vibratePlayPromise.current.catch(() => console.log("Interação necessária para tocar som."));
    }

    return () => {
      safePause(vibrateRef, vibratePlayPromise);
      safePause(joaquimVoiceRef, voicePlayPromise);
      vibrateRef.current = null;
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (status === 'connected') {
      safePause(vibrateRef, vibratePlayPromise);
      interval = setInterval(() => setTimer(t => t + 1), 1000);
      
      const hbAudio = new Audio('https://cdn.pixabay.com/audio/2021/11/24/audio_3d1a3848b3.mp3');
      hbAudio.loop = true;
      hbAudio.volume = 0.08;
      heartbeatRef.current = hbAudio;
      heartbeatPlayPromise.current = hbAudio.play();
      heartbeatPlayPromise.current.catch(() => {});
    }
    
    return () => {
      clearInterval(interval);
      safePause(heartbeatRef, heartbeatPlayPromise);
    };
  }, [status]);

  const handleDecline = () => {
    safePause(vibrateRef, vibratePlayPromise);
    setFadeOut(true);
    setTimeout(onDecline, 500);
  };

  const handleAccept = () => {
    if (status !== 'ringing') return;
    
    // Reduz volume da trilha principal em 90% (0.07 do original 0.7)
    if (onVolumeChange) onVolumeChange(0.07);

    safePause(vibrateRef, vibratePlayPromise);
    setStatus('connected');
    
    if (joaquimVoiceRef.current) {
      voicePlayPromise.current = joaquimVoiceRef.current.play();
      voicePlayPromise.current.catch(err => {
        console.error("Erro ao reproduzir voz do Joaquim:", err);
        setTimeout(() => {
          setStatus('ended');
          setFadeOut(true);
          onComplete();
        }, 5000);
      });
    }
  };

  // Handlers para gesto de arrastar para cima (Swipe Up)
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaY = touchStartY - touchEndY;
    
    // Se arrastou para cima mais que 30px, aceita a chamada
    if (deltaY > 30) {
      handleAccept();
    }
    setTouchStartY(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex-1 flex flex-col bg-[#0b141a] text-white relative overflow-hidden transition-all duration-700 font-sans ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:450px_auto]"></div>

      <div className="relative z-20 flex flex-col items-center text-center pt-16 px-6">
        <div className="flex items-center gap-1.5 text-[#8696a0] text-[10px] font-black uppercase tracking-[0.15em] mb-2 opacity-60">
          <Lock className="w-3 h-3" />
          <span>Criptografia de ponta a ponta</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e9edef] drop-shadow-sm">Joaquim Recepção</h2>
        
        <div className="mt-3">
          {status === 'connected' ? (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-top-2">
              <span className="text-lg text-[#00a884] font-bold tracking-wider">{formatTime(timer)}</span>
              <p className="text-[10px] text-[#8696a0] uppercase font-bold tracking-[0.2em] mt-1">Ligação em curso</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <p className="text-xl text-[#e9edef] font-medium animate-pulse tracking-wide">Chamando...</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative">
          {status === 'ringing' && (
            <>
              <div className="absolute inset-[-15px] rounded-full border border-[#00a884]/20 animate-[ping_3s_infinite] opacity-50"></div>
              <div className="absolute inset-[-30px] rounded-full border border-[#00a884]/10 animate-[ping_3.5s_infinite] opacity-30"></div>
              <div className="absolute inset-[-50px] rounded-full bg-[#00a884]/5 animate-pulse duration-[2500ms]"></div>
            </>
          )}
          
          <div className={`
            w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-[4px] border-[#202c33] 
            shadow-[0_20px_80px_rgba(0,0,0,0.6)] relative transition-all duration-[1500ms]
            ${status === 'connected' ? 'scale-110' : 'scale-100'}
          `}>
            <img 
              src={joaquimAvatar} 
              className={`w-full h-full object-cover transition-all duration-1000 ${status === 'connected' ? 'grayscale-0' : 'grayscale-[0.15] brightness-90'}`} 
              alt="Joaquim" 
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none"></div>
          </div>

          {status === 'connected' && (
            <div className="absolute bottom-5 right-10 w-11 h-11 bg-[#00a884] border-[5px] border-[#0b141a] rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in-0 duration-700">
               <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-sm"></div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-20 pb-20 px-10">
        {status === 'ringing' ? (
          <div className="flex justify-between items-center max-w-sm mx-auto animate-in slide-in-from-bottom-12 duration-1000">
            <div className="flex flex-col items-center gap-4 group">
              <button 
                onClick={handleDecline} 
                className="w-18 h-18 md:w-22 md:h-22 bg-[#ea0038] rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(234,0,56,0.3)] active:scale-90 transition-all hover:brightness-110"
              >
                <PhoneOff className="text-white fill-white w-8 h-8 md:w-10 md:h-10" />
              </button>
              <span className="text-[13px] text-[#8696a0] font-bold uppercase tracking-widest group-hover:text-white transition-colors">Recusar</span>
            </div>
            
            <div className="flex flex-col items-center gap-4 group">
              {/* Botão Aceitar Otimizado: Suporta toque, clique e swipe up */}
              <button 
                onClick={handleAccept} 
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className="w-18 h-18 md:w-22 md:h-22 bg-[#00a884] rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(0,168,132,0.3)] active:scale-95 touch-none transition-all hover:brightness-110 animate-bounce"
                aria-label="Aceitar Chamada"
              >
                <Phone className="text-white fill-white w-8 h-8 md:w-10 md:h-10 pointer-events-none" />
              </button>
              <span className="text-[13px] text-[#8696a0] font-bold uppercase tracking-widest group-hover:text-[#00a884] transition-colors">Aceitar</span>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-[#202c33]/90 backdrop-blur-2xl rounded-[40px] p-6 flex justify-between items-center transition-all duration-700 shadow-[0_25px_60px_rgba(0,0,0,0.5)] border border-white/5 animate-in slide-in-from-bottom-20">
            <button className="w-14 h-14 bg-[#2a3942] rounded-full flex items-center justify-center active:scale-90 transition-transform hover:bg-[#374955] text-white">
              <Speaker className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 bg-[#2a3942] rounded-full flex items-center justify-center active:scale-90 transition-transform hover:bg-[#374955] text-white">
              <Video className="w-6 h-6" />
            </button>
            <button className="w-14 h-14 bg-[#00a884]/15 rounded-full flex items-center justify-center active:scale-90 transition-transform text-[#00a884]">
              <MicOff className="w-6 h-6" />
            </button>
            <button 
              onClick={() => { setFadeOut(true); setTimeout(onComplete, 600); }}
              className="w-16 h-16 bg-[#ea0038] rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform hover:brightness-110"
            >
              <PhoneOff className="text-white fill-white w-7 h-7" />
            </button>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 left-0 w-full flex justify-center opacity-10 pointer-events-none">
        <Maximize2 className="w-4 h-4 text-white" />
      </div>

      <style>{`
        .w-18 { width: 4.5rem; }
        .h-18 { height: 4.5rem; }
        .w-22 { width: 5.5rem; }
        .h-22 { height: 5.5rem; }
      `}</style>
    </div>
  );
};

export default Act3PhoneCall;
