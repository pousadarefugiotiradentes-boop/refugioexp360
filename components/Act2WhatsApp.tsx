
import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message } from '../types';
import { 
  Phone, MoreVertical, Send, CheckCheck, User, ArrowLeft, Video, 
  Smile, Paperclip, Camera, Mic, ShieldAlert, Play, Pause, XCircle, Clock
} from 'lucide-react';

interface Act2WhatsAppProps {
  userProfile: UserProfile;
  onDecision: (decision: 'call' | 'login' | 'exit') => void;
  mode?: 'normal' | 'after-decline';
  onFinalComplete?: () => void;
}

const AudioBubble = ({ onComplete, onPlayStarted }: { onComplete: () => void; onPlayStarted: () => void }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hasStartedRef = useRef(false);
  const JOAQUIM_VOICE_URL = "https://dl.dropboxusercontent.com/scl/fi/syvbwm8r21kdctghvlkmv/joaquim-chamando.mp3?rlkey=34rdytesptpapd79v128gmtcw";

  useEffect(() => {
    const audio = new Audio(JOAQUIM_VOICE_URL);
    audio.onended = () => {
      setIsPlaying(false);
      onComplete();
    };
    audio.ontimeupdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };
    audioRef.current = audio;
    return () => audio.pause();
  }, [onComplete]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
      if (!hasStartedRef.current) {
        onPlayStarted();
        hasStartedRef.current = true;
      }
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-white rounded-r-lg rounded-bl-lg p-3 shadow-sm flex items-center space-x-3 w-fit max-w-[85%] animate-in fade-in slide-in-from-left-2 text-[#111b21]">
      <div className="relative shrink-0">
        <img src="https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png" className="w-10 h-10 rounded-full object-cover" alt="Joaquim" />
        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5"><Mic className="w-3 h-3 text-[#00a884]" /></div>
      </div>
      <button onClick={togglePlay} className="text-[#54656f] shrink-0">
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

const Act2WhatsApp: React.FC<Act2WhatsAppProps> = ({ userProfile, onDecision, mode = 'normal', onFinalComplete }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [step, setStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [audioStep, setAudioStep] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const addMessage = (text: string, sender: 'mentor' | 'user') => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text, sender, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  useEffect(() => {
    setIsOnline(true);
    if (mode === 'after-decline') {
      setStep(100); 
    }
  }, [mode]);

  useEffect(() => {
    const runScript = async () => {
      if (step === 0 && mode === 'normal') {
        setTimeout(() => { addMessage(`Uai credo, cê tá bem? O que é que houve?`, 'mentor'); setStep(1); }, 1000);
      } else if (step === 1) {
        setTimeout(() => { setIsTyping(true); setTimeout(() => { setIsTyping(false); addMessage(`Recebi uma notificação dizendo que cê tava tendo um troço! Que foi?`, 'mentor'); setStep(2); }, 2000); }, 1500);
      } else if (step === 2) {
        setTimeout(() => { setIsTyping(true); setTimeout(() => { setIsTyping(false); addMessage(`Tá tudo bem aí? Responde logo!`, 'mentor'); setStep(3); }, 1500); }, 1500);
      } else if (step === 3) {
        setTimeout(() => setShowOptions(true), 1000);
      } else if (step === 10) {
        setIsTyping(true);
        setTimeout(() => { setIsTyping(false); addMessage(`preciso de te contar sobre uns segredos que descobri em Tiradentes...`, 'mentor'); setStep(11); }, 2000);
      } else if (step === 11) {
        setIsTyping(true);
        setTimeout(() => { setIsTyping(false); addMessage("Você tem um minuto aí? Posso te ligar?", 'mentor'); setStep(14); }, 2500);
      } else if (step === 100) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(`Não pode atender agora, né? Entendo... Então, vou te mandar um audio, quando puder escuta!`, 'mentor');
          setTimeout(() => setAudioStep(true), 1000);
        }, 2000);
      }
    };
    runScript();
  }, [step]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, audioStep]);

  const handleUserResponse = (text: string) => {
    if (!text.trim()) return;
    setShowOptions(false);
    addMessage(text, 'user');
    setStep(10);
  };

  const handleManualSend = () => {
    if (inputValue.trim()) {
      handleUserResponse(inputValue);
      setInputValue('');
    }
  };

  const startAudioSequence = () => {
    const sequence = [
      { text: "Anota ai o login e a senha pra você acessar o sistema:", delay: 2000 },
      { text: "o login é SUPERADMIN", delay: 5000 },
      { text: "senha: meurefugio", delay: 8000 },
      { text: "Não compartilha com ninguém, eim! Fica só entre nós!", delay: 12000 },
      { text: "Acessa logo, pode sair do ar a qualquer momento!", delay: 16000 }
    ];

    sequence.forEach((item) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(item.text, 'mentor');
        }, 1200);
      }, item.delay);
    });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#E5DDD5] font-sans overflow-hidden text-[#111b21]">
      <style>{`
        @keyframes staggeredPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.95; }
        }
        .pulse-1 { animation: staggeredPulse 2s infinite ease-in-out; }
        .pulse-2 { animation: staggeredPulse 2s infinite ease-in-out 0.5s; }
        .pulse-3 { animation: staggeredPulse 2s infinite ease-in-out 1s; }
        .pulse-4 { animation: staggeredPulse 2s infinite ease-in-out 1.5s; }
      `}</style>

      <div className="bg-[#008069] text-white p-3 flex items-center justify-between shadow-md z-50 h-16 shrink-0">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5" />
          <img src="https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png" className="w-10 h-10 rounded-full object-cover border border-white/10" alt="J" />
          <div>
            <h1 className="font-bold text-sm">Joaquim Recepção</h1>
            <p className="text-[10px] opacity-80">{isOnline ? 'online' : 'conectando...'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Video className="w-5 h-5 cursor-pointer" onClick={() => onDecision('call')} />
          <Phone className="w-4 h-4 cursor-pointer" onClick={() => onDecision('call')} />
          <MoreVertical className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-[length:450px_auto]">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-2 shadow-sm relative text-[14px] leading-tight ${msg.sender === 'user' ? 'bg-[#d9fdd3] rounded-l-lg rounded-br-lg' : 'bg-white rounded-r-lg rounded-bl-lg'}`}>
              <p className="pr-12 text-[#111b21]">{msg.text}</p>
              <div className="absolute bottom-1 right-2 flex items-center space-x-1 text-[9px] text-[#667781]">
                <span>{msg.timestamp}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
              </div>
            </div>
          </div>
        ))}

        {audioStep && <AudioBubble onPlayStarted={startAudioSequence} onComplete={() => onDecision('login')} />}
        {isTyping && <div className="bg-white px-4 py-2 rounded-xl text-xs italic text-[#667781] w-fit animate-pulse shadow-sm border border-black/5">digitando...</div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-[#F0F2F5] p-2 pb-4 flex items-end space-x-2 relative z-50">
        <div className="flex-1 bg-white rounded-[26px] flex items-center px-3 min-h-[48px] shadow-sm">
          <button onClick={() => setShowEmoji(!showEmoji)} className="focus:outline-none">
            <Smile className={`w-6 h-6 ${showEmoji ? 'text-[#00a884]' : 'text-[#54656f]'}`} />
          </button>
          <input 
            type="text" 
            value={inputValue} 
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleManualSend()}
            placeholder="Digite sua mensagem" 
            className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-[#111b21]"
          />
          <Paperclip className="w-5 h-5 text-[#54656f] -rotate-45" />
          <Camera className="w-5 h-5 text-[#54656f]" />
        </div>
        <button 
          onClick={inputValue.trim() ? handleManualSend : undefined}
          className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
        >
          {inputValue.trim() ? (
            <Send className="w-5 h-5 text-white" />
          ) : (
            <Mic className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      {showEmoji && (
        <div className="bg-white p-4 grid grid-cols-6 gap-2 border-t animate-in slide-in-from-bottom-2">
          {['🙂', '🙃', '😅', '🤔', '😴', '😱'].map(emoji => (
            <button 
              key={emoji} 
              onClick={() => { setInputValue(prev => prev + emoji); setShowEmoji(false); }}
              className="text-2xl hover:bg-gray-100 p-2 rounded"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {showOptions && (
        <div className="absolute bottom-24 left-4 right-4 flex flex-col items-end space-y-2 z-[60] animate-in slide-in-from-bottom-4 duration-500 max-h-[60vh] overflow-y-auto no-scrollbar">
          <p className="text-[10px] text-[#54656f] font-bold uppercase tracking-wider mb-1 pr-2">Sugestões de Resposta</p>
          <button 
            onClick={() => handleUserResponse("Tá tudo jóia, uai! 🙃 E com você?")} 
            className="pulse-1 bg-[#005c4b] text-white px-6 py-3 rounded-2xl text-[13px] font-bold shadow-xl active:scale-95 transition-all text-right border border-white/10"
          >
            Tá tudo jóia, uai! 🙃 E com você?
          </button>
          <button 
            onClick={() => handleUserResponse("Ah, mais ou menos, tô num cansaço danado!")} 
            className="pulse-2 bg-[#005c4b] text-white px-6 py-3 rounded-2xl text-[13px] font-bold shadow-xl active:scale-95 transition-all text-right border border-white/10 animate-in slide-in-from-bottom-2 duration-700"
          >
            Ah, mais ou menos, tô num cansaço danado!
          </button>
          <button 
            onClick={() => handleUserResponse("Tô bem não, tô no meu limite, não aguento mais...")} 
            className="pulse-3 bg-[#005c4b] text-white px-6 py-3 rounded-2xl text-[13px] font-bold shadow-xl active:scale-95 transition-all text-right border border-white/10 animate-in slide-in-from-bottom-3 duration-800"
          >
            Tô bem não, tô no meu limite, não aguento mais...
          </button>
          <button 
            onClick={() => handleUserResponse("Nada é tão ruim que não possa piorar!")} 
            className="pulse-4 bg-[#005c4b] text-white px-6 py-3 rounded-2xl text-[13px] font-bold shadow-xl active:scale-95 transition-all text-right border border-white/10 animate-in slide-in-from-bottom-4 duration-1000"
          >
            Nada é tão ruim que não possa piorar!
          </button>
        </div>
      )}

      {step === 14 && !isTyping && (
        <div className="absolute bottom-24 left-4 right-4 bg-white/95 backdrop-blur p-5 rounded-3xl shadow-2xl space-y-3 border border-[#00a884]/20 animate-in slide-in-from-bottom-8 duration-700 z-[60]">
          <p className="text-[10px] text-[#667781] font-bold uppercase tracking-widest text-center mb-1">Ação Sugerida</p>
          
          <div className="space-y-2">
            <button onClick={() => onDecision('call')} className="w-full bg-[#00a884] text-white py-4 rounded-2xl font-black uppercase tracking-tight flex justify-between items-center px-6 shadow-lg hover:brightness-110 active:scale-[0.98] transition-all">
              <span>PODE LIGAR AGORA!</span>
              <Phone className="w-5 h-5 fill-current" />
            </button>
            
            <button 
              onClick={() => { addMessage("Me liga mais tarde", 'user'); setStep(100); }} 
              className="w-full bg-white border border-[#8696a0]/30 text-[#54656f] py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-gray-50 active:scale-[0.98] transition-all"
            >
              <span>Me liga mais tarde</span>
              <Clock className="w-4 h-4" />
            </button>

            <button 
              onClick={() => onDecision('exit')} 
              className="w-full bg-red-50 text-red-600 py-3.5 rounded-2xl font-bold uppercase text-[12px] tracking-widest flex justify-between items-center px-6 hover:bg-red-100 active:scale-[0.98] transition-all"
            >
              <span>Bloquear contato</span>
              <XCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Act2WhatsApp;
