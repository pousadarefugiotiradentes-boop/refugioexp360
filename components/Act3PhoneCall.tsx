import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { 
  Phone, 
  PhoneOff, 
  MessageSquare,
  MicOff,
  Mic,
  Volume2,
  Lock,
  ChevronUp
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
  
  // Estados de simulação para os botões pós-atendimento
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  // Ref para detecção de gestos (swipe)
  const touchStartY = useRef<number | null>(null);

  const vibrateRef = useRef<HTMLAudioElement | null>(null);
  const joaquimVoiceRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);
  
  const vibratePlayPromise = useRef<Promise<void> | null>(null);
  const voicePlayPromise = useRef<Promise<void> | null>(null);
  const heartbeatPlayPromise = useRef<Promise<void> | null>(null);

  const VIBRATE_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/ov2kevkt11lokxvnbs44g/celular-vibrando.mp3?rlkey=jxwpvwzv1tszkhst44pt3fyvl";
  const JOAQUIM_VOICE_URL = "https://dl.dropboxusercontent.com/scl/fi/syvbwm8r21kdctghvlkmv/joaquim-chamando.mp3?rlkey=34rdytesptpapd79v128gmtcw";
  const joaquimAvatar = "https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png";

  const ORIGINAL_VOICE_VOLUME = 0.6;
  const BOOSTED_VOICE_VOLUME = 0.9; // Aumento de 50% em relação a 0.6

  const safePause = (audioRef: React.RefObject<HTMLAudioElement | null>, promiseRef: React.RefObject<Promise<void> | null>) => {
    if (audioRef.current && promiseRef.current) {
      promiseRef.current.then(() => { if (audioRef.current) audioRef.current.pause(); }).catch(() => {});
    } else if (audioRef.current) { audioRef.current.pause(); }
  };

  useEffect(() => {
    const vibrateAudio = new Audio(VIBRATE_SFX_URL);
    vibrateAudio.loop = true;
    vibrateAudio.volume = 1.0; 
    vibrateRef.current = vibrateAudio;
    
    const voiceAudio = new Audio(JOAQUIM_VOICE_URL);
    // Nível original de 0.6 para permitir aumento de 50% sem estourar o limite de 1.0
    voiceAudio.volume = ORIGINAL_VOICE_VOLUME;
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
      vibratePlayPromise.current.catch(() => {});
    }

    return () => {
      safePause(vibrateRef, vibratePlayPromise);
      safePause(joaquimVoiceRef, voicePlayPromise);
      vibrateRef.current = null;
    };
  }, []);

  // Efeito para gerenciar o volume da voz do Joaquim baseado no estado do viva-voz
  useEffect(() => {
    if (joaquimVoiceRef.current) {
      // Se o alto-falante (viva-voz) estiver ligado, aumentamos em 50% (de 0.6 para 0.9)
      // Caso contrário, volta ao nível original (0.6)
      joaquimVoiceRef.current.volume = isSpeakerOn ? BOOSTED_VOICE_VOLUME : ORIGINAL_VOICE_VOLUME;
    }
  }, [isSpeakerOn]);

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

  const handleAccept = () => {
    if (status !== 'ringing') return;
    if (onVolumeChange) onVolumeChange(0.05); 
    safePause(vibrateRef, vibratePlayPromise);
    setStatus('connected');
    if (joaquimVoiceRef.current) {
      voicePlayPromise.current = joaquimVoiceRef.current.play();
      voicePlayPromise.current.catch(() => {
        setTimeout(() => { setStatus('ended'); setFadeOut(true); onDecline(); }, 5000);
      });
    }
  };

  const handleDecline = () => {
    safePause(vibrateRef, vibratePlayPromise);
    setFadeOut(true);
    setTimeout(onDecline, 500);
  };

  const handleManualHangup = () => {
    safePause(joaquimVoiceRef, voicePlayPromise);
    setFadeOut(true);
    setTimeout(onDecline, 600);
  };

  // Handlers para o Gesto Omni-Touch
  const onTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
    touchStartY.current = y;
  };

  const onTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    const y = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY;
    if (touchStartY.current !== null) {
      const diff = Math.abs(touchStartY.current - y);
      // Se houver um arrasto significativo (mais de 10px) ou apenas um toque
      if (diff > 10 || diff <= 10) {
        handleAccept();
      }
    }
    touchStartY.current = null;
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex-1 flex flex-col bg-[#0b141a] text-white relative overflow-hidden transition-all duration-700 font-sans 
      ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      
      {/* WhatsApp Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat"></div>

      {/* Header Info (WhatsApp Style) */}
      <div className="relative z-20 flex flex-col items-center text-center pt-16 px-8">
        <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-[#e9edef] mb-1">
          Joaquim Pousada...
        </h2>
        <div className="flex items-center gap-2 text-[#8696a0] text-sm font-normal">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-4 h-4 opacity-70" alt="WA" />
          <span>+55 32 9813-5902</span>
        </div>
        
        <div className="mt-6">
          {status === 'connected' ? (
            <span className="text-lg md:text-2xl text-[#00a884] font-medium">{formatTime(timer)}</span>
          ) : (
            <p className="text-sm md:text-lg text-[#8696a0] uppercase tracking-[0.2em] font-medium animate-pulse">Chamada de voz do WhatsApp</p>
          )}
        </div>
      </div>

      {/* Center Avatar */}
      <div className="flex-1 flex items-center justify-center relative z-10 p-6">
        <div className="relative">
          {status === 'ringing' && (
            <div className="absolute inset-[-15px] rounded-full border border-[#00a884]/20 animate-ping opacity-30"></div>
          )}
          <div className={`
            w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-[1px] border-white/5 
            shadow-2xl relative transition-all duration-700
            ${status === 'connected' ? 'scale-110' : 'scale-100'}
          `}>
            <img src={joaquimAvatar} className="w-full h-full object-cover" alt="Joaquim" />
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="relative z-20 pb-20 px-8">
        {status === 'ringing' ? (
          <div className="flex flex-col items-center gap-12 max-w-lg mx-auto">
            {/* Texto de Gesto */}
            <div className="flex flex-col items-center gap-2 opacity-60 animate-bounce">
              <ChevronUp className="w-6 h-6 text-[#00a884]" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold">Deslizar para aceitar</span>
            </div>

            {/* Ações principais */}
            <div className="flex items-center justify-between w-full px-4">
              {/* Recusar */}
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={handleDecline} 
                  className="w-16 h-16 md:w-20 md:h-20 bg-[#ea0038] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <PhoneOff className="text-white fill-white w-6 h-6 md:w-8 md:h-8" />
                </button>
                <span className="text-[10px] md:text-xs text-[#8696a0] font-bold uppercase tracking-widest">Recusar</span>
              </div>

              {/* Atender (Omni-Touch Button) */}
              <div className="flex flex-col items-center">
                <button 
                  onMouseDown={onTouchStart}
                  onMouseUp={onTouchEnd}
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  onDoubleClick={handleAccept}
                  className="w-20 h-20 md:w-24 md:h-24 bg-[#00a884] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,168,132,0.4)] active:scale-95 transition-all animate-button-pulse"
                >
                  <Phone className="text-white fill-white w-8 h-8 md:w-10 md:h-10" />
                </button>
              </div>

              {/* Conversar */}
              <div className="flex flex-col items-center gap-3">
                <button 
                  onClick={handleDecline}
                  className="w-16 h-16 md:w-20 md:h-20 bg-[#202c33] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all"
                >
                  <MessageSquare className="text-white fill-white w-6 h-6 md:w-8 md:h-8" />
                </button>
                <span className="text-[10px] md:text-xs text-[#8696a0] font-bold uppercase tracking-widest">Conversar</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto bg-[#202c33]/95 backdrop-blur-xl rounded-[3rem] p-6 md:p-8 flex justify-around items-center shadow-2xl border border-white/5">
            <button 
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300
                ${isSpeakerOn ? 'bg-white text-black' : 'bg-[#2a3942] text-white hover:bg-[#32434d]'}`}
            >
              <Volume2 className={`w-6 h-6 md:w-7 md:h-7 ${isSpeakerOn ? 'fill-current' : ''}`} />
            </button>

            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300
                ${isMuted ? 'bg-[#00a884] text-white' : 'bg-[#00a884]/10 text-[#00a884]'}`}
            >
              {isMuted ? <MicOff className="w-6 h-6 md:w-7 md:h-7" /> : <Mic className="w-6 h-6 md:w-7 md:h-7" />}
            </button>

            <button 
              onClick={handleManualHangup} 
              className="w-16 h-16 md:w-20 md:h-20 bg-[#ea0038] rounded-full flex items-center justify-center shadow-xl active:scale-90"
            >
              <PhoneOff className="text-white fill-white w-8 h-8 md:w-10 md:h-10" />
            </button>
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className="absolute bottom-6 left-0 w-full flex justify-center opacity-30 pointer-events-none">
        <div className="flex items-center gap-2 text-[8px] font-bold tracking-[0.2em]">
          <span>🔒 Criptografia (quase) de Ponta a Ponta 🔓</span>
        </div>
      </div>
    </div>
  );
};

export default Act3PhoneCall;