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
    <div className="bg-white rounded-r-lg rounded-bl-lg p-3 shadow-sm flex items-center space-x-3 w-fit max-w-[85%] animate-in fade-in slide-in-from-left-2 text-[#111b21] mb-2">
      <div className="relative shrink-0">
        <img src="https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png" className="w-10 h-10 rounded-full object-cover" alt="Joaquim" />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><Mic className="w-3 h-3 text-[#00a884]" /></div>
      </div>
      <button onClick={togglePlay} className="text-[#54656f] shrink-0 outline-none">
        {isPlaying ? <Pause className="fill-current w-6 h-6" /> : <Play className="fill-current w-6 h-6" />}
      </button>
      <div className="flex-1 space-y-1 min-w-[140px]">
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden w-32 md:w-48 relative">
          <div className="absolute inset-0 bg-[#00a884] transition-all" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="flex justify-between text-[9px] text-[#667781]">
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

  useEffect(() => {
    setIsOnline(true);
    if (mode === 'after-decline') {
      setStep(100); 
    }
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
          addTimer(() => {
            if (!sequenceStartedRef.current) startAudioSequence();
          }, 5000);
        }, 1000);
      }, 2000);
    }
  }, [step, mode]);

  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    const timer = setTimeout(scrollToBottom, 150);
    return () => clearTimeout(timer);
  }, [messages, isTyping, showFinalCta, showOptions, step]);

  const handleUserResponse = (text: string) => {
    if (!text.trim()) return;
    setShowOptions(false);
    addMessage(text, 'user');
    
    // Se o CTA final já está visível ou se estamos no modo após declínio,
    // qualquer mensagem deve avançar para o login secreto em vez de voltar para o step 10
    if (showFinalCta || mode === 'after-decline') {
      addTimer(() => {
        onDecision('login');
      }, 1500);
    } else {
      setStep(10);
    }
  };

  const handleManualSend = () => {
    if (inputValue.trim()) {
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
            addTimer(() => setShowFinalCta(true), 1000);
          }
        }, 1200);
      }, item.delay);
    });
  };

  const isAnyOptionOpen = showOptions || (step === 14 && !isTyping && mode !== 'after-decline');

  return (
    <div className="flex flex-col h-screen w-full bg-[#E5DDD5] font-sans overflow-hidden text-[#111b21]">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="sticky top-0 bg-[#008069] text-white p-3 flex items-center justify-between shadow-md z-[100] h-16 shrink-0">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
          <img src="https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png" className="w-10 h-10 rounded-full object-cover border border-white/10" alt="J" />
          <div>
            <h1 className="font-bold text-sm">Joaquim da Recepção</h1>
            <p className="text-[10px] opacity-80">{isOnline ? 'online' : 'conectando...'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Video className="w-5 h-5 cursor-pointer" onClick={() => onDecision('call')} />
          <Phone className="w-4 h-4 cursor-pointer" onClick={() => onDecision('call')} />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:450px_auto] no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.isAudio ? (
              <AudioBubble 
                onPlayStarted={startAudioSequence} 
                onComplete={() => {
                  // Se o audio acabar, e for a versão "depois de recusar",
                  // o fluxo natural continua com as mensagens de login
                }} 
                onVolumeChange={onVolumeChange}
              />
            ) : (
              <div className={`max-w-[85%] px-4 py-2 shadow-sm relative text-[14px] leading-tight ${msg.sender === 'user' ? 'bg-[#d9fdd3] rounded-l-lg rounded-br-lg' : 'bg-white rounded-r-lg rounded-bl-lg'}`}>
                <p className="pr-12 text-[#111b21]">{msg.text}</p>
                <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-[9px] text-[#667781]">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && <div className="bg-white px-4 py-2 rounded-xl text-xs italic text-[#667781] w-fit animate-pulse shadow-sm border border-black/5">digitando...</div>}
        {showFinalCta && (
          <div className="flex justify-start animate-in zoom-in slide-in-from-left-4 duration-500 py-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden min-w-[240px] max-w-[85%] border border-black/5">
              <div className="px-4 py-3 text-[14px] text-[#111b21]">Acesse o sistema aqui:</div>
              <button 
                onClick={() => onDecision('login')}
                className="w-full border-t border-gray-100 py-4 px-4 text-[#00a884] font-bold text-[14px] flex items-center justify-center gap-2 hover:bg-gray-50 active:bg-gray-100 transition-colors uppercase tracking-tight"
              >
                <ExternalLink className="w-4 h-4" />
                ACESSAR SUPER DEEP DARK WEB
              </button>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-2" />
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isAnyOptionOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pt-2">
          {showOptions && (
            <div className="bg-white/95 backdrop-blur p-5 rounded-3xl shadow-xl space-y-3 border border-[#00a884]/20 animate-in slide-in-from-bottom-4 duration-500">
              <p className="text-[10px] text-[#667781] font-bold uppercase tracking-widest text-center mb-1">Sugestões de Resposta</p>
              <div className="space-y-2">
                <button onClick={() => handleUserResponse("Tá tudo jóia, uai! 🙃 E com você?")} className="w-full bg-[#00a884] text-white py-4 rounded-2xl font-black uppercase tracking-tight flex justify-between items-center px-6 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                  <span className="text-left">TÁ TUDO JÓIA, UAI!</span>
                  <Smile className="w-5 h-5" />
                </button>
                <button onClick={() => handleUserResponse("Ah, mais ou menos, tô num cansaço danado!")} className="w-full bg-white border border-[#8696a0]/30 text-[#54656f] py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-gray-50 active:scale-[0.98] transition-all">
                  <span className="text-left">AH, MAIS OU MENOS...</span>
                  <Frown className="w-4 h-4" />
                </button>
                <button onClick={() => handleUserResponse("Tô no meu limite, não aguento mais...")} className="w-full bg-white border border-[#8696a0]/30 text-[#54656f] py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-gray-50 active:scale-[0.98] transition-all">
                  <span className="text-left">TÔ NO MEU LIMITE</span>
                  <AlertTriangle className="w-4 h-4" />
                </button>
                <button onClick={() => handleUserResponse("Nada é tão ruim que não possa piorar!")} className="w-full bg-red-50 border border-red-200 text-red-600 py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-red-100 active:scale-[0.98] transition-all">
                  <span className="text-left">PODE PIORAR...</span>
                  <Skull className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          {step === 14 && !isTyping && mode !== 'after-decline' && (
            <div className="bg-white/95 backdrop-blur p-5 rounded-3xl shadow-xl space-y-3 border border-[#00a884]/20 animate-in slide-in-from-bottom-4 duration-500">
              <p className="text-[10px] text-[#667781] font-bold uppercase tracking-widest text-center mb-1">Ação Sugerida</p>
              <div className="space-y-2">
                <button onClick={() => onDecision('call')} className="w-full bg-[#00a884] text-white py-4 rounded-2xl font-black uppercase tracking-tight flex justify-between items-center px-6 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
                  <span className="text-left">PODE LIGAR, UAI!</span>
                  <Phone className="w-5 h-5 fill-current" />
                </button>
                <button onClick={() => { addMessage("Me liga mais tarde", 'user'); setStep(100); }} className="w-full bg-white border border-[#8696a0]/30 text-[#54656f] py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-gray-50 active:scale-[0.98] transition-all">
                  <span className="text-left">ME LIGA MAIS TARDE</span>
                  <Clock className="w-4 h-4" />
                </button>
                <button onClick={() => onDecision('exit')} className="w-full bg-red-50 border border-red-200 text-red-600 py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-red-100 active:scale-[0.98] transition-all">
                  <span className="text-left">BLOQUEAR CONTATO</span>
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="bg-[#F0F2F5] p-2 pb-4 flex items-end space-x-2 relative z-50 shrink-0">
        <div className="flex-1 bg-white rounded-[26px] flex items-center px-3 min-h-[48px] shadow-sm">
          <button onClick={() => setShowEmoji(!showEmoji)} className="focus:outline-none"><Smile className={`w-6 h-6 ${showEmoji ? 'text-[#00a884]' : 'text-[#54656f]'}`} /></button>
          <input type="text" value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleManualSend()} placeholder="Digite sua mensagem" className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-[#111b21]" />
          <Paperclip className="w-5 h-5 text-[#54656f] -rotate-45" /><Camera className="w-5 h-5 text-[#54656f]" />
        </div>
        <button onClick={inputValue.trim() ? handleManualSend : undefined} className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
          {inputValue.trim() ? <Send className="w-5 h-5 text-white" /> : <Mic className="w-5 h-5 text-white" />}
        </button>
      </div>
      {showEmoji && (
        <div className="bg-white p-4 grid grid-cols-6 gap-2 border-t animate-in slide-in-from-bottom-2 shrink-0">
          {['🙂', '🙃', '😅', '🤔', '😴', '😱'].map(emoji => (
            <button key={emoji} onClick={() => { setInputValue(prev => prev + emoji); setShowEmoji(false); }} className="text-2xl hover:bg-gray-100 p-2 rounded">{emoji}</button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Act2WhatsApp;