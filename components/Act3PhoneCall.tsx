import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { 
  Phone, 
  PhoneOff, 
  MicOff,
  Speaker, 
  Plus, 
  User, 
  Grid, 
  Video, 
  Lock, 
  Volume2, 
  AlertCircle, 
  Key, 
  ExternalLink,
  MoreHorizontal,
  ChevronDown,
  UserPlus
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

  const joaquimScript = `Oi, tá me ouvindo? Olha só, tenho que ser rápido, não tenho muito tempo! Descobri um Refúgio aqui em Tiradentes! vou te mandar o meu login e senha em uma plataforma do Refúgio que tem todos os detalhes. Tenho que desligar agora, eles estão chegando!`;
  const joaquimAvatar = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800";

  useEffect(() => {
    vibrateRef.current = new Audio('https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73456.mp3');
    vibrateRef.current.loop = true;
    vibrateRef.current.volume = 0.6;
    
    if (status === 'ringing') {
      vibrateRef.current.play().catch(e => console.log("Som de vibração requer interação prévia"));
    }

    return () => {
      vibrateRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    let interval: any;
    if (status === 'connected' && !quotaError) {
      vibrateRef.current?.pause();
      interval = setInterval(() => setTimer(t => t + 1), 1000);
      
      heartbeatRef.current = new Audio('https://cdn.pixabay.com/audio/2021/11/24/audio_3d1a3848b3.mp3');
      heartbeatRef.current.loop = true;
      heartbeatRef.current.volume = 0.15;
      heartbeatRef.current.play().catch(() => {});
    }
    
    return () => {
      clearInterval(interval);
      heartbeatRef.current?.pause();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(err => console.error("Erro ao fechar AudioContext:", err));
      }
    };
  }, [status, quotaError]);

  const handleOpenKeySelector = async () => {
    try {
      await window.aistudio?.openSelectKey();
      setQuotaError(false);
      setStatus('ringing');
      isPlayingRef.current = false;
      handleAccept();
    } catch (e) {
      console.error("Erro ao abrir seletor de chave:", e);
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

      if (!result) throw new Error("Falha na resposta da API Gemini");

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }

      const uint8Array = decodeBase64(result);
      const audioBuffer = await decodePCMToAudioBuffer(uint8Array, audioCtx, 24000);

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      
      const gainNode = audioCtx.createGain();
      gainNode.gain.value = 1.6; 

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      source.onended = () => {
        setTimeout(() => {
          setStatus('ended');
          setFadeOut(true);
          setTimeout(onComplete, 1000);
        }, 1200);
      };

      source.start();
    } catch (err: any) {
      console.error("Erro voz Joaquim:", err);
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
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0b141a] text-white p-8 font-sans relative overflow-hidden">
        <div className="relative z-10 max-w-sm w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-[#202c33] border border-red-500/50 rounded-full flex items-center justify-center mx-auto shadow-lg">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Conexão Interrompida</h2>
            <p className="text-[#8696a0] text-sm leading-relaxed">
              O tráfego de dados excedeu o limite gratuito. Para continuar o diagnóstico, utilize sua própria chave de acesso.
            </p>
          </div>
          <button 
            onClick={handleOpenKeySelector}
            className="w-full bg-[#00a884] text-white py-4 rounded-xl font-bold text-sm uppercase shadow-lg active:scale-95 transition-all"
          >
            Ativar Chave Própria
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-[#0b141a] text-white relative overflow-hidden transition-all duration-500 font-sans ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:400px_auto]"></div>

      <div className="relative z-20 flex justify-between items-start p-6 pt-10">
        <button className="p-2 bg-[#202c33]/40 rounded-full">
          <ChevronDown className="w-6 h-6 text-white" />
        </button>
        
        <div className="flex flex-col items-center text-center">
          <h2 className="text-xl font-medium tracking-wide">Joaquim Recepção</h2>
          {status === 'connected' ? (
            <p className="text-sm text-[#8696a0] mt-1">{formatTime(timer)}</p>
          ) : (
            <div className="flex flex-col items-center">
               <p className="text-xs text-[#8696a0] mt-1 flex items-center gap-1">
                 <Lock className="w-3 h-3" /> Criptografia de ponta a ponta
               </p>
               <p className="text-sm text-white mt-2 animate-pulse font-bold">Chamando...</p>
            </div>
          )}
        </div>

        <button className="p-2 bg-[#202c33]/40 rounded-full">
          <UserPlus className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center relative z-10 -mt-20">
        <div className="relative">
          <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-2 border-[#202c33] shadow-2xl relative">
            <img src={joaquimAvatar} className="w-full h-full object-cover" alt="Joaquim" />
            <div className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${status === 'connected' ? 'opacity-0' : 'opacity-100'}`}></div>
          </div>
          {status === 'connected' && (
            <div className="absolute bottom-4 right-8 w-6 h-6 bg-[#00a884] border-4 border-[#0b141a] rounded-full animate-pulse shadow-lg"></div>
          )}
        </div>
      </div>

      <div className="relative z-20 pb-12 px-6">
        {status === 'ringing' && (
           <div className="flex justify-around items-center mb-12 animate-in slide-in-from-bottom-10">
              <div className="flex flex-col items-center gap-2">
                <button onClick={handleDecline} className="w-16 h-16 bg-[#ea0038] rounded-full flex items-center justify-center shadow-xl active:scale-90 transition-transform hover:brightness-110">
                   <PhoneOff className="text-white w-7 h-7" />
                </button>
                <span className="text-[11px] text-[#8696a0] font-medium">Recusar</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <button onClick={handleAccept} className="w-16 h-16 bg-[#00a884] rounded-full flex items-center justify-center shadow-xl animate-bounce active:scale-90 transition-transform hover:brightness-110">
                   <Phone className="text-white fill-white w-7 h-7" />
                </button>
                <span className="text-[11px] text-[#8696a0] font-medium">Aceitar</span>
              </div>
           </div>
        )}

        <div className={`bg-[#202c33]/90 backdrop-blur-lg rounded-[2.5rem] p-4 flex justify-between items-center transition-all duration-500 ${status === 'connected' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
          <button className="w-12 h-12 bg-[#202c33] rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </button>
          <button className="w-12 h-12 bg-[#202c33] rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <Video className="w-6 h-6 text-white" />
          </button>
          <button className="w-12 h-12 bg-[#00a884]/20 rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <Volume2 className="w-6 h-6 text-[#00a884]" />
          </button>
          <button className="w-12 h-12 bg-[#202c33] rounded-full flex items-center justify-center active:scale-90 transition-transform">
            <MicOff className="w-6 h-6 text-white" />
          </button>
          <button 
            onClick={() => { setFadeOut(true); setTimeout(onComplete, 500); }}
            className="w-14 h-14 bg-[#ea0038] rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform"
          >
            <PhoneOff className="text-white w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Act3PhoneCall;