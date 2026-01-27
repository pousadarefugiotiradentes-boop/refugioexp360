import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Message } from '../types';
import { 
  Phone, 
  MoreVertical, 
  Send, 
  CheckCheck, 
  User, 
  ArrowLeft, 
  Video, 
  Smile, 
  Paperclip, 
  Camera, 
  Mic,
  ShieldAlert
} from 'lucide-react';

interface Act2WhatsAppProps {
  userProfile: UserProfile;
  onDecision: (decision: 'call' | 'login' | 'exit') => void;
}

const Act2WhatsApp: React.FC<Act2WhatsAppProps> = ({ userProfile, onDecision }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const [step, setStep] = useState(0);
  const [suggestionStep, setSuggestionStep] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const initialUserOptions = [
    "Tá tudo joia, uai! 🙃 E com você?",
    "Sei não, ando sentindo um cansaço danado!",
    "Nada é tão ruim que não possa piorar!"
  ];

  const emojis = ["😊", "👍", "🙌", "🙏", "☕", "🏡", "✨", "🤔", "🤩", "❤️", "😂", "😢"];

  const addMessage = (text: string, sender: 'mentor' | 'user', isAudio = false) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      text, sender, isAudio,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    // Simular o tempo de o contato ficar 'online'
    const onlineTimer = setTimeout(() => setIsOnline(true), 1200);
    return () => clearTimeout(onlineTimer);
  }, []);

  useEffect(() => {
    const runScript = async () => {
      if (step === 0) {
        setTimeout(() => {
          addMessage(`Uai credo, cê tá bem? O que é que houve?`, 'mentor');
          setStep(1);
        }, 1000);
      } else if (step === 1) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage(`Recebi uma notificação aqui dizendo que cê tava tendo um troço, um piripaque! Que foi?`, 'mentor');
            setStep(2);
          }, 2000);
        }, 1500);
      } else if (step === 2) {
        setTimeout(() => {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            addMessage(`Tá tudo bem aí? Responde logo, to preocupado com você!`, 'mentor');
            setStep(3);
          }, 1500);
        }, 1500);
      } else if (step === 3) {
        setTimeout(() => {
          setShowOptions(true);
          setTimeout(() => setSuggestionStep(1), 300);
          setTimeout(() => setSuggestionStep(2), 900);
          setTimeout(() => setSuggestionStep(3), 1500);
        }, 1000);
      } else if (step === 10) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(`preciso de te contar sobre uns segredos que descobri esses dias aqui em Tiradentes...`, 'mentor');
          setStep(11);
        }, 2000);
      } else if (step === 11) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage("Tenho que ser rápido, não tenho muito tempo.", 'mentor');
          setStep(12);
        }, 2500);
      } else if (step === 12) {
        setTimeout(() => {
          setStep(13);
        }, 1000);
      } else if (step === 13) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          addMessage(`Você tem um minuto aí? Posso te ligar agora, rapidinho?`, 'mentor');
          setStep(14);
        }, 1500);
      }
    };
    runScript();
  }, [step]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, suggestionStep, showOptions]);

  const handleInitialChoice = (option: string) => {
    setShowOptions(false);
    setSuggestionStep(0);
    addMessage(option, 'user');
    setStep(10);
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text) {
      if (step >= 14) {
        onDecision('call');
      } else if (step === 3) {
        handleInitialChoice(initialUserOptions[0]);
      }
      return;
    }
    
    addMessage(text, 'user');
    setInputValue('');
    setShowEmojiPicker(false);
    
    if (step === 3) {
      setShowOptions(false);
      setSuggestionStep(0);
      setStep(10);
    }
  };

  const handleEmojiClick = (e: string) => {
    setInputValue(prev => prev + e);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#E5DDD5] font-sans overflow-hidden">
      <div className="bg-[#008069] text-white p-3 flex items-center justify-between shadow-md z-50 shrink-0 h-16">
        <div className="flex items-center space-x-2">
          <ArrowLeft className="w-5 h-5 cursor-pointer" />
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden flex items-center justify-center border border-white/10">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <h1 className="font-bold text-sm">Joaquim Recepção</h1>
            <p className="text-[10px] opacity-80 transition-opacity duration-500">
              {isOnline ? 'online' : 'visto por último hoje às ' + new Date().getHours() + ':' + new Date().getMinutes()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Video className="w-5 h-5 cursor-pointer" onClick={() => onDecision('call')} />
          <Phone className="w-4 h-4 cursor-pointer" onClick={() => onDecision('call')} />
          <MoreVertical className="w-5 h-5 cursor-pointer" />
        </div>
      </div>

      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain scroll-smooth"
      >
        <div className="flex justify-center my-4">
          <span className="bg-[#D1E4F3] text-[#54656f] text-[10px] font-bold px-3 py-1 rounded-lg uppercase shadow-sm">Hoje</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
            <div className={`max-w-[85%] px-3 py-1.5 shadow-sm relative text-[14px] ${msg.sender === 'user' ? 'bg-[#d9fdd3] rounded-l-lg rounded-br-lg' : 'bg-white rounded-r-lg rounded-bl-lg'}`}>
              <div className={`absolute top-0 w-3 h-3 ${msg.sender === 'user' ? '-right-1.5 bg-[#d9fdd3] clip-path-tail-right' : '-left-1.5 bg-white clip-path-tail-left'}`}></div>
              <p className="pr-10">{msg.text}</p>
              <div className="absolute bottom-1 right-1.5 flex items-center space-x-1 text-[9px] text-[#667781]">
                <span>{msg.timestamp}</span>
                {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="bg-white px-4 py-2 rounded-xl text-xs italic text-gray-500 w-fit animate-pulse shadow-sm relative ml-1.5">
            <div className="absolute top-0 -left-1.5 w-3 h-3 bg-white clip-path-tail-left"></div>
            digitando...
          </div>
        )}

        <div ref={messagesEndRef} className="h-4 w-full" />
      </div>

      <div className="bg-transparent shrink-0 z-40">
        {showOptions && (
          <div className="p-3 flex flex-col items-end space-y-2 bg-black/5 backdrop-blur-sm">
            <p className="text-[10px] text-[#54656f] font-black uppercase tracking-widest mr-2 opacity-50">Escolha uma resposta:</p>
            {initialUserOptions.map((opt, i) => i < suggestionStep && (
              <button 
                key={i} 
                onClick={() => handleInitialChoice(opt)} 
                className="max-w-[90%] text-right px-5 py-3.5 rounded-2xl bg-[#005c4b] text-white font-bold text-[13px] shadow-lg animate-in slide-in-from-right-8 fade-in duration-500 active:scale-95 animate-pulse-staggered border border-white/10"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {step >= 14 && !isTyping && (
          <div className="p-3 bg-black/5 backdrop-blur-sm space-y-2 animate-in slide-in-from-bottom-6">
            <button onClick={() => onDecision('call')} className="w-full bg-[#00a884] text-white rounded-xl py-4 px-6 text-sm font-bold shadow-xl active:scale-95 flex items-center justify-between group">
              <span className="uppercase tracking-tight">SE FOR RAPIDINHO, PODE LIGAR AGORA!</span>
              <Phone className="w-4 h-4 group-hover:animate-bounce" />
            </button>
            <button onClick={() => onDecision('call')} className="w-full bg-white text-[#008069] border border-[#e9edef] rounded-xl py-4 px-6 text-sm font-bold shadow-md active:scale-95 flex items-center justify-between">
              <span className="uppercase tracking-tight">ME LIGA MAIS TARDE!</span>
              <MoreVertical className="w-4 h-4" />
            </button>
            <button onClick={() => onDecision('exit')} className="w-full bg-red-50 text-red-600 border border-red-100 rounded-xl py-2 px-6 text-[10px] font-bold active:scale-95 flex items-center justify-between opacity-70">
              <span className="uppercase tracking-tight">BLOQUEAR CONTATO</span>
              <ShieldAlert className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 right-4 bg-white rounded-2xl shadow-2xl p-4 grid grid-cols-6 gap-4 z-[100] animate-in slide-in-from-bottom-2 border border-gray-100">
            {emojis.map(e => (
              <button key={e} onClick={() => handleEmojiClick(e)} className="text-2xl p-1 hover:bg-gray-100 rounded-lg transition-colors">{e}</button>
            ))}
          </div>
        )}

        <div className="p-2 flex items-end space-x-2 bg-[#F0F2F5] pb-4">
          <div className="flex-1 bg-white rounded-[26px] flex items-center px-3 min-h-[48px] shadow-sm">
            <Smile className="w-6 h-6 text-[#54656f] shrink-0 cursor-pointer" onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
            <input 
              ref={inputRef} 
              type="text" 
              value={inputValue} 
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Mensagem" 
              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent text-[#111b21]"
            />
            <div className="flex space-x-4 shrink-0 px-1">
              <Paperclip className="w-5 h-5 text-[#54656f] -rotate-45 cursor-pointer" onClick={() => onDecision('call')} />
              {!inputValue.trim() && <Camera className="w-5 h-5 text-[#54656f] cursor-pointer" onClick={() => onDecision('call')} />}
            </div>
          </div>
          <button 
            onClick={handleSendMessage}
            className="bg-[#00a884] w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform shrink-0"
          >
            {inputValue.trim() ? <Send className="w-5 h-5 text-white ml-0.5" /> : <Mic className="w-5 h-5 text-white" />}
          </button>
        </div>
      </div>

      <style>{`
        .clip-path-tail-right { clip-path: polygon(0 0, 0% 100%, 100% 0); }
        .clip-path-tail-left { clip-path: polygon(100% 0, 100% 100%, 0 0); }
      `}</style>
    </div>
  );
};

export default Act2WhatsApp;