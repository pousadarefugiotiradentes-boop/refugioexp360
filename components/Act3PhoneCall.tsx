
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { 
  Phone, 
  PhoneOff, 
  MicOff,
  Speaker, 
  Video, 
  Lock, 
  AlertCircle,
  Maximize2
} from 'lucide-react';
import { generateTTS } from '../services/geminiService';

interface Act3PhoneCallProps {
  userProfile: UserProfile;
  onComplete: () => void;
  onDecline: () => void;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
  interface Window {
    aistudio?: AIStudio;
  }
}

function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodePCMToAudioBuffer(
  uint8Array: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000
): Promise<AudioBuffer> {
  const int16Array = new Int16Array(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength / 2);
  const audioBuffer = ctx.createBuffer(1, int16Array.length, sampleRate);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < int16Array.length; i++) {
    channelData[i] = int16Array[i] / 32768.0;
  }
  return audioBuffer;
}

const Act3PhoneCall: React.FC<Act3PhoneCallProps> = ({ userProfile, onComplete, onDecline }) => {
  const [status, setStatus] = useState<'ringing' | 'connected' | 'ended'>('ringing');
  const [timer, setTimer] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [quotaError, setQuotaError] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const isPlayingRef = useRef(false);
  
  const vibrateRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);

  // Link direto do Dropbox para o som de vibração fornecido pelo usuário
  const VIBRATE_SFX_URL = "https://dl.dropboxusercontent.com/scl/fi/ov2kevkt11lokxvnbs44g/celular-vibrando.mp3?rlkey=jxwpvwzv1tszkhst44pt3fyvl";
  const joaquimAvatar = "https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png";

  const joaquimScript = `Oi, tá me ouvindo? Olha só, tenho que ser rápido, não tenho muito tempo! Descobri um Refúgio aqui em Tiradentes! vou te mandar o meu login e senha em uma plataforma do Refúgio que tem todos os detalhes. Tenho que desligar agora, eles estão chegando!`;

  useEffect(() => {
    // Inicializa o som de vibração
    const vibrateAudio = new Audio(VIBRATE_SFX_URL);
    vibrateAudio.loop = true;
    vibrateAudio.volume = 0.8;
    vibrateRef.current = vibrateAudio;
    
    if (status === 'ringing') {
      vibrateAudio.play().catch(e => console.log("Som de vibração requer interação prévia no navegador."));
    }

    return () => {
      vibrateRef.current?.pause();
      vibrateRef.current = null;
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (status === 'connected' && !quotaError) {
      vibrateRef.current?.pause();
      interval = setInterval(() => setTimer(t => t + 1), 1000);
      
      // Som sutil de batimento cardíaco ou ruído de fundo da ligação
      heartbeatRef.current = new Audio('https://cdn.pixabay.com/audio/2021/11/24/audio_3d1a3848b3.mp3');
      heartbeatRef.current.loop = true;
      heartbeatRef.current.volume = 0.08;
      heartbeatRef.current.play().catch(() => {});
    }
    
    return () => {
      clearInterval(interval);
      heartbeatRef.current?.pause();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [status, quotaError]);

  const handleOpenKeySelector = async () => {
    try {
      await window.aistudio?.openSelectKey();
      setQuotaError(false);
      setStatus('ringing');
      handleAccept();
    } catch (e) {
      console.error(e);
    }
  };

  const playJoaquimVoice = async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;

    try {
      const result = await generateTTS(joaquimScript);
      
      if (result === "QUOTA_EXCEEDED") {
        setQuotaError(true);
        return;
      }

      if (!result) throw new Error("API Failure");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      const uint8Array = decodeBase64(result);
      const audioBuffer = await decodePCMToAudioBuffer(uint8Array, audioCtx, 24000);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 2.0; // Voz do Joaquim um pouco mais alta e clara
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      source.onended = () => {
        setTimeout(() => {
          setStatus('ended');
          setFadeOut(true);
          setTimeout(onComplete, 1200);
        }, 1500);
      };

      source.start();
    } catch (err: any) {
      // Fallback em caso de erro na voz
      setTimeout(() => {
        setStatus('ended');
        setFadeOut(true);
        onComplete();
      }, 5000);
    }
  };

  const handleDecline = () => {
    vibrateRef.current?.pause();
    setFadeOut(true);
    setTimeout(onDecline, 500);
  };

  const handleAccept = () => {
    if (status !== 'ringing') return;
    vibrateRef.current?.pause();
    setStatus('connected');
    playJoaquimVoice();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (quotaError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0b141a] text-white p-8 font-sans">
        <div className="max-w-xs w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">Limite de IA Atingido</h2>
            <p className="text-[#8696a0] text-sm">A conexão com Joaquim foi interrompida. Ative sua própria chave para ouvir o segredo dele.</p>
          </div>
          <button 
            onClick={handleOpenKeySelector} 
            className="w-full bg-[#00a884] text-white py-4 rounded-full font-bold uppercase tracking-widest shadow-xl active:scale-95 transition-all"
          >
            Configurar Chave
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-[#0b141a] text-white relative overflow-hidden transition-all duration-700 font-sans ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Background WhatsApp Pattern Over Dark Canvas */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:450px_auto]"></div>

      {/* Header Section */}
      <div className="relative z-20 flex flex-col items-center text-center pt-16 px-6">
        <div className="flex items-center gap-1.5 text-[#8696a0] text-[10px] font-black uppercase tracking-[0.15em] mb-2 opacity-60">
          <Lock className="w-3 h-3" />
          <span>Segurança de ponta a ponta</span>
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

      {/* Avatar Centerpiece */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        <div className="relative">
          {/* Enhanced Pulse Rings for Ringing state */}
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
            {/* Glossy overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none"></div>
          </div>

          {status === 'connected' && (
            <div className="absolute bottom-5 right-10 w-11 h-11 bg-[#00a884] border-[5px] border-[#0b141a] rounded-full flex items-center justify-center shadow-2xl animate-in zoom-in-0 duration-700">
               <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse shadow-sm"></div>
            </div>
          )}
        </div>
      </div>

      {/* Controls Container */}
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
              <button 
                onClick={handleAccept} 
                className="w-18 h-18 md:w-22 md:h-22 bg-[#00a884] rounded-full flex items-center justify-center shadow-[0_15px_30px_rgba(0,168,132,0.3)] active:scale-90 transition-all hover:brightness-110 animate-bounce"
              >
                <Phone className="text-white fill-white w-8 h-8 md:w-10 md:h-10" />
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
