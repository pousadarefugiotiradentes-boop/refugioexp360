import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message } from '../types';
import { 
  Phone, MoreVertical, Send, CheckCheck, ArrowLeft, Video, 
  Smile, Paperclip, Camera, Mic, Play, Pause, XCircle, Clock, ExternalLink,
  Frown, AlertTriangle, Skull
} from 'lucide-react';

interface Act2WhatsAppProps {
  userProfile: UserProfile;
  onDecision: (decision: 'call' | 'login' | 'exit') => void;
  mode?: 'normal' | 'after-decline';
  onFinalComplete?: () => void;
  onVolumeChange?: (volume: number) => void;
}

const AudioBubble = ({ 
  onComplete, 
  onPlayStarted, 
  onVolumeChange 
}: { 
  onComplete: () => void; 
  onPlayStarted: () => void;
  onVolumeChange?: (volume: number) => void;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const JOAQUIM_VOICE_URL = "https://dl.dropboxusercontent.com/scl/fi/syvbwm8r21kdctghvlkmv/joaquim-chamando.mp3?rlkey=34rdytesptpapd79v128gmtcw";

  const onCompleteRef = useRef(onComplete);
  const onPlayStartedRef = useRef(onPlayStarted);
  const onVolumeChangeRef = useRef(onVolumeChange);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onPlayStartedRef.current = onPlayStarted;
    onVolumeChangeRef.current = onVolumeChange;
  }, [onComplete, onPlayStarted, onVolumeChange]);

  useEffect(() => {
    const audio = new Audio(JOAQUIM_VOICE_URL);
    audio.onended = () => {
      setIsPlaying(false);
      if (onVolumeChangeRef.current) onVolumeChangeRef.current(0.7);
      onCompleteRef.current();
    };
    audio.ontimeupdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      if (onVolumeChangeRef.current) onVolumeChangeRef.current(0.7);
    } else {
      audioRef.current?.play();
      if (onVolumeChangeRef.current) onVolumeChangeRef.current(0.07);
      if (!hasStartedRef.current) {
        onPlayStartedRef.current();
        hasStartedRef.current = true;
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-r-2xl rounded-bl-2xl p-3 md:p-4 shadow-sm flex items-center space-x-4 w-fit max-w-[90%] animate-in fade-in slide-in-from-left-2 text-[#111b21] mb-3">
      <div className="relative shrink-0">
        <img src="https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png" className="w-10 h-10 md:w-14 md:h-14 rounded-full object-cover" alt="Joaquim" />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm"><Mic className="w-3 h-3 md:w-4 md:h-4 text-[#00a884]" /></div>
      </div>
      <button onClick={togglePlay} className="text-[#54656f] shrink-0 outline-none hover:scale-110 transition-transform">
        {isPlaying ? <Pause className="fill-current w-7 h-7 md:w-9 md:h-9" /> : <Play className="fill-current w-7 h-7 md:w-9 md:h-9" />}
      </button>
      <div className="flex-1 space-y-2 min-w-[140px] md:min-w-[200px]">
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full relative">
          <div className="absolute inset-0 bg-[#00a884] transition-all" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] md:text-xs text-[#667781] font-medium">
          <span>0:53</span>
          <div className="flex items-center space-x-1">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Act2WhatsApp: React.FC<Act2WhatsAppProps> = ({ onDecision, mode = 'normal', onVolumeChange }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [step, setStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [showFinalCta, setShowFinalCta] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const sequenceStartedRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<any[]>([]);

  const addTimer = (fn: () => void, delay: number) => {
    const timer = setTimeout(fn, delay);
    timersRef.current.push(timer);
    return timer;
  };

  const addMessage = (text: string, sender: 'mentor' | 'user', isAudio = false) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text, sender, isAudio, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    setIsOnline(true);
    if (mode === 'after-decline') setStep(100); 
    return () => timersRef.current.forEach(clearTimeout);
  }, [mode]);

  useEffect(() => {
    if (step === 0 && mode === 'normal') {
      addTimer(() => { addMessage(`Uai credo, cê tá bem? O que é que houve?`, 'mentor'); setStep(1); }, 1000);
    } else if (step === 1) {
      addTimer(() => { 
        setIsTyping(true); 
        addTimer(() => { 
          setIsTyping(false); 
          addMessage(`Recebi uma notificação dizendo que cê tava tendo um troço! Que foi?`, 'mentor'); 
          setStep(2); 
        }, 2000); 
      }, 1500);
    } else if (step === 2) {
      addTimer(() => { 
        setIsTyping(true); 
        addTimer(() => { 
          setIsTyping(false); 
          addMessage(`Tá tudo bem aí? Responde logo!`, 'mentor'); 
          setStep(3); 
        }, 1500); 
      }, 1500);
    } else if (step === 3) {
      addTimer(() => setShowOptions(true), 1000);
    } else if (step === 10 && mode !== 'after-decline') {
      setIsTyping(true);
      addTimer(() => { 
        setIsTyping(false); 
        addMessage(`Preciso de te contar sobre uns segredos que descobri em Tiradentes...`, 'mentor'); 
          setStep(11); 
      }, 2000);
    } else if (step === 11 && mode !== 'after-decline') {
      setIsTyping(true);
      addTimer(() => { 
        setIsTyping(false); 
        addMessage("Você tem um minuto aí? Posso te ligar?", 'mentor'); 
        setStep(14); 
      }, 2500);
    } else if (step === 100) {
      setIsTyping(true);
      addTimer(() => {
        setIsTyping(false);
        addMessage(`Não pode atender agora, né? Entendo... Então, vou te mandar um audio, quando puder escuta!`, 'mentor');
        addTimer(() => {
          addMessage('', 'mentor', true);
        }, 1000);
      }, 2000);
    }
  }, [step, mode]);

  useEffect(() => {
    scrollToBottom('auto');
    const timer = setTimeout(() => scrollToBottom('smooth'), 100);
    return () => clearTimeout(timer);
  }, [messages, isTyping, showFinalCta, showOptions, step, showEmoji]);

  const handleUserResponse = (text: string) => {
    if (!text.trim()) return;
    setShowOptions(false);
    addMessage(text, 'user');
    if (showFinalCta || mode === 'after-decline' || step >= 100) {
      addTimer(() => onDecision('login'), 1500);
    } else if (step === 14) {
      addTimer(() => onDecision('call'), 800);
    } else {
      setStep(10);
    }
  };

  const handleManualSend = () => {
    if (inputValue.trim() && isUserTurn) {
      handleUserResponse(inputValue);
      setInputValue('');
    }
  };

  const startAudioSequence = () => {
    if (sequenceStartedRef.current) return;
    sequenceStartedRef.current = true;
    const sequence = [
      { text: "Anota ai o login e a senha pra você acessar o sistema:", delay: 2000 },
      { text: "o login é SUPERADMIN", delay: 5000 },
      { text: "senha: meurefugio", delay: 8000 },
      { text: "Não compartilha com ninguém, eim! Fica só entre nós!", delay: 11000 },
      { text: "Acessa logo, pode sair do ar a qualquer momento!", delay: 14000 }
    ];
    sequence.forEach((item, index) => {
      addTimer(() => {
        setIsTyping(true);
        addTimer(() => {
          setIsTyping(false);
          addMessage(item.text, 'mentor');
          if (index === sequence.length - 1) {
            addTimer(() => {
              setShowFinalCta(true);
            }, 1000);
          }
        }, 1200);
      }, item.delay);
    });
  };

  const handleAudioComplete = () => {
    // Quando o áudio termina, garantimos que o usuário seja levado ao login secreto
    // Damos um tempo extra de 5 segundos para que ele possa processar as informações visuais
    addTimer(() => {
      onDecision('login');
    }, 5000);
  };

  const isUserTurn = showOptions || (step === 14 && !isTyping && mode !== 'after-decline') || showFinalCta;
  const isAnyOptionOpen = showOptions || (step === 14 && !isTyping && mode !== 'after-decline') || showFinalCta;

  return (
    <div className="flex flex-col h-screen w-full bg-[#E5DDD5] font-sans overflow-hidden text-[#111b21] relative">
      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      
      <div className="sticky top-0 bg-[#008069] text-white p-3 md:p-5 flex items-center justify-between shadow-md z-[100] h-14 md:h-20 shrink-0 landscape:h-12">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-5 h-5 md:w-7 md:h-7 cursor-pointer" />
          <img src="https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png" className="w-9 h-9 md:w-12 md:h-12 rounded-full object-cover" alt="J" />
          <div>
            <h1 className="font-bold text-sm md:text-lg">Joaquim</h1>
            <p className="text-xs md:text-sm opacity-80">{isOnline ? 'online' : 'conectando...'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-5">
          <Video className="w-5 h-5 md:w-7 md:h-7 cursor-pointer" onClick={() => onDecision('call')} />
          <Phone className="w-4 h-4 md:w-6 md:h-6 cursor-pointer" onClick={() => onDecision('call')} />
          <MoreVertical className="w-5 h-5 md:w-7 md:h-7" />
        </div>
      </div>
      
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:450px_auto] no-scrollbar relative">
        <div className="space-y-4 md:space-y-6 pb-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.isAudio ? (
                <AudioBubble onPlayStarted={startAudioSequence} onComplete={handleAudioComplete} onVolumeChange={onVolumeChange} />
              ) : (
                <div className={`max-w-[85%] px-4 py-2.5 md:px-6 md:py-4 shadow-sm relative text-base md:text-xl leading-relaxed ${msg.sender === 'user' ? 'bg-[#d9fdd3] rounded-l-2xl rounded-br-2xl' : 'bg-white rounded-r-2xl rounded-bl-2xl'}`}>
                  <p className="pr-12 text-[#111b21]">{msg.text}</p>
                  <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-[10px] md:text-xs text-[#667781] font-medium">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-4 h-4 md:w-5 md:h-5 text-[#53bdeb]" />}
                  </div>
                </div>
              )}
            </div>
          ))}
          {isTyping && <div className="bg-white px-4 py-2 rounded-2xl text-xs md:text-sm italic text-[#667781] w-fit animate-pulse shadow-sm font-medium border border-gray-100">digitando...</div>}
          
          {showFinalCta && (
            <div className="flex justify-start py-4">
              <div className="bg-white rounded-2xl shadow-[0_2px_5px_rgba(0,0,0,0.1)] overflow-hidden min-w-[260px] max-w-[85%] border border-black/[0.03]">
                <div className="px-5 py-4 text-sm md:text-lg font-bold text-[#111b21] bg-white">Acesse o sistema:</div>
                <div className="px-5 pb-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">Credenciais de Acesso:</p>
                  <p className="text-xs md:text-sm font-mono bg-zinc-50 p-2 rounded border border-zinc-100">Login: SUPERADMIN<br/>Senha: meurefugio</p>
                </div>
                <button 
                  onClick={() => onDecision('login')} 
                  className="w-full border-t border-gray-100 py-4 px-5 text-[#00a884] font-black text-sm md:text-lg flex items-center justify-center gap-3 uppercase tracking-wider bg-white hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-5 h-5" /> ACESSAR SUPER DEEP DARK WEB
                </button>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className={`transition-all duration-300 overflow-hidden shrink-0 ${isAnyOptionOpen ? 'max-h-[350px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-2 landscape:pb-2">
          {showOptions && (
            <div className="bg-white/95 backdrop-blur-xl p-4 md:p-6 rounded-[2.5rem] shadow-2xl space-y-3 landscape:grid landscape:grid-cols-2 landscape:gap-3 landscape:space-y-0">
              <button onClick={() => handleUserResponse("Tá tudo jóia, uai! 🙃")} className="w-full bg-[#00a884] text-white py-4 md:py-6 rounded-2xl font-black uppercase text-xs md:text-lg flex justify-between items-center px-6 hover:scale-[1.02] transition-transform">
                <span>TÁ TUDO JÓIA!</span> <Smile className="w-6 h-6" />
              </button>
              <button onClick={() => handleUserResponse("Nada é tão ruim que não possa piorar.")} className="w-full bg-red-50 border-2 border-red-200 text-red-600 py-4 md:py-6 rounded-2xl font-black uppercase text-xs md:text-base flex justify-between items-center px-6">
                <span>PIOR QUE TÁ NÃO FICA</span> <Skull className="w-6 h-6" />
              </button>
              <button onClick={() => handleUserResponse("Tô no meu limite...")} className="w-full bg-white border-2 border-gray-200 text-gray-600 py-4 md:py-6 rounded-2xl font-black uppercase text-xs md:text-base flex justify-between items-center px-6 landscape:hidden">
                <span>TÔ NO MEU LIMITE</span> <AlertTriangle className="w-6 h-6" />
              </button>
            </div>
          )}
          {step === 14 && !isTyping && mode !== 'after-decline' && (
            <div className="bg-white/95 backdrop-blur-xl p-4 rounded-[2.5rem] shadow-2xl space-y-3 landscape:flex landscape:space-y-0 landscape:gap-3">
              <button onClick={() => onDecision('call')} className="w-full bg-[#00a884] text-white py-5 md:py-7 rounded-2xl font-black uppercase text-sm md:text-xl flex justify-between items-center px-8 shadow-lg hover:bg-[#009079]">
                <span>PODE LIGAR!</span> <Phone className="w-6 h-6 fill-current" />
              </button>
              <button onClick={() => { addMessage("Me liga mais tarde", 'user'); setStep(100); }} className="w-full bg-white border-2 border-gray-200 text-gray-500 py-4 md:py-6 rounded-2xl font-black uppercase text-xs md:text-base flex justify-between items-center px-6">
                <span>ME LIGA MAIS TARDE</span> <Clock className="w-6 h-6" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#F0F2F5] p-2 md:p-4 flex items-end space-x-3 relative z-50 shrink-0 landscape:py-2">
        <div className={`flex-1 bg-white rounded-[2rem] flex items-center px-5 min-h-[48px] md:min-h-[64px] shadow-sm border border-gray-200/50 ${!isUserTurn ? 'opacity-60' : ''}`}>
          <Smile className={`w-6 h-6 md:w-8 md:h-8 ${showEmoji ? 'text-[#00a884]' : 'text-[#54656f]'}`} />
          <input 
            type="text" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleManualSend()} 
            disabled={!isUserTurn}
            placeholder={isUserTurn ? "Digite..." : "..."} 
            className="flex-1 px-3 py-2 text-base md:text-xl outline-none bg-transparent placeholder:font-bold" 
          />
          <Camera className="w-6 h-6 text-[#54656f] landscape:hidden" />
        </div>
        <button 
          onClick={inputValue.trim() && isUserTurn ? handleManualSend : undefined} 
          className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg transition-all ${!isUserTurn && !inputValue.trim() ? 'bg-gray-300' : 'bg-[#00a884] active:scale-90'}`}
        >
          {inputValue.trim() ? <Send className="w-5 h-5 md:w-7 md:h-7 text-white" /> : <Mic className="w-5 h-5 md:w-7 md:h-7 text-white" />}
        </button>
      </div>
    </div>
  );
};

export default Act2WhatsApp;