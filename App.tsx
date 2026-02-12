
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FunnelStep, UserProfile } from './types';
import DevIndex from './components/DevIndex';
import Act0BiometricAnalysis from './components/Act0BiometricAnalysis';
import Act0Error from './components/Act0Error';
import Act0Breathing from './components/Act0Breathing';
import Act0BlueScreen from './components/Act0BlueScreen';
import Act0InstagramScroll from './components/Act0InstagramScroll';
import Act2WhatsApp from './components/Act2WhatsApp';
import Act3PhoneCall from './components/Act3PhoneCall';
import Act4Offer from './components/Act4Offer';
import Act5SecretLogin from './components/Act5SecretLogin';
import Act6Autodestruct from './components/Act6Autodestruct';
import Act0StressQuiz from './components/Act0StressQuiz';
import { HERO_IMAGE_URL, LOGO_URL } from './constants';
import { Shield, Power, Volume2, VolumeX, LayoutGrid, Activity, Info, HeartPulse, Play } from 'lucide-react';

const App: React.FC = () => {
  // Iniciando diretamente no START_SCREEN para produção
  const [step, setStep] = useState<FunnelStep>(FunnelStep.START_SCREEN);
  const [blueScreenMode, setBlueScreenMode] = useState<'intro' | 'final'>('intro');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [whatsappMode, setWhatsappMode] = useState<'normal' | 'after-decline'>('normal');
  const [userProfile] = useState<UserProfile>({
    name: 'Visitante'
  });

  // Desativado por padrão para esconder ferramentas de dev
  const [showDevTools, setShowDevTools] = useState(false);

  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<any>(null);

  const AUDIO_SOURCE = "https://dl.dropboxusercontent.com/scl/fi/a712ue0yjxqwio6v9b9t5/trilha-exp-360-refugio-TESTE-5-PREMASTERED.mp3?rlkey=hld15nfh2qyjd8virxn14dzmd";
  const OFFER_AUDIO_SOURCE = "https://dl.dropboxusercontent.com/scl/fi/xfo1ep382nu8tyd6p5a4z/Vamos-fugir-from-Gilberto-Gil-e-The-Wailers.mp3?rlkey=stzm6mvzz8uzip3wlly8ub25s"; 
  const JOAQUIM_AVATAR = "https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png";
  const DEFAULT_VOLUME = 0.7;

  useEffect(() => {
    const preloadImages = [HERO_IMAGE_URL, LOGO_URL, JOAQUIM_AVATAR];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const audio = new Audio();
    audio.src = AUDIO_SOURCE;
    audio.loop = true;
    audio.volume = DEFAULT_VOLUME;
    audio.preload = "auto";
    mainAudioRef.current = audio;

    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (step === FunnelStep.OFFER && mainAudioRef.current) {
      fadeVolume(0, 2000);
      setTimeout(() => {
        if (mainAudioRef.current) {
          mainAudioRef.current.pause();
          mainAudioRef.current.src = OFFER_AUDIO_SOURCE;
          mainAudioRef.current.load();
          mainAudioRef.current.play().catch(e => console.error("Erro ao tocar música da oferta:", e));
          fadeVolume(DEFAULT_VOLUME, 3000);
        }
      }, 2100);
    }
  }, [step]);

  const fadeVolume = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!mainAudioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
    const startVolume = mainAudioRef.current.volume;
    const distance = targetVolume - startVolume;
    const steps = 40; 
    const stepDuration = duration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (mainAudioRef.current) {
        const nextVolume = startVolume + (distance * (currentStep / steps));
        mainAudioRef.current.volume = Math.max(0, Math.min(1, nextVolume));
      }
      if (currentStep >= steps) {
        if (mainAudioRef.current) mainAudioRef.current.volume = targetVolume;
        clearInterval(fadeIntervalRef.current);
      }
    }, stepDuration);
  }, []);

  const toggleMute = useCallback(() => {
    if (mainAudioRef.current) {
      const newMutedState = !isMuted;
      mainAudioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  }, [isMuted]);

  const navigateTo = useCallback((nextStep: FunnelStep, delay = 0) => {
    if (delay > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(nextStep);
        setIsTransitioning(false);
      }, delay);
    } else {
      setStep(nextStep);
    }
  }, []);

  const handleStartExperience = useCallback(() => {
    if (mainAudioRef.current) mainAudioRef.current.play().catch(() => {});
    navigateTo(FunnelStep.BIOMETRIC_ANALYSIS);
  }, [navigateTo]);

  return (
    <div className={`min-h-screen w-full flex flex-col bg-black relative transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      {step !== FunnelStep.INDEX && (
        <button onClick={toggleMute} className="fixed top-4 right-4 z-[100] p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[#8EFF8E]">
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6 animate-pulse" />}
        </button>
      )}

      {/* TELA DEV INDEX (Oculta por padrão) */}
      {step === FunnelStep.INDEX && (
        <DevIndex 
          onSelectStep={(s, mode) => {
            if (mode === 'after-decline') setWhatsappMode('after-decline');
            else setWhatsappMode('normal');
            
            if (mode === 'blue-final') setBlueScreenMode('final');
            else setBlueScreenMode('intro');
            
            navigateTo(s);
          }} 
          onStartNormalFlow={() => navigateTo(FunnelStep.START_SCREEN)} 
        />
      )}

      {step === FunnelStep.START_SCREEN && (
        <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#050505_100%)]"></div>
          <div className="relative z-10 text-center space-y-4 md:space-y-6 animate-in fade-in zoom-in duration-1000 max-w-lg w-full flex flex-col items-center pb-12 md:pb-0">
            <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center">
               <div className="absolute inset-6 md:inset-8 rounded-full bg-[#121212] border border-[#8EFF8E]/20 flex items-center justify-center shadow-[inset_0_0_50px_rgba(142,255,142,0.1)] group overflow-hidden">
                  <Activity className="w-16 h-16 md:w-20 md:h-20 text-[#8EFF8E] animate-jitter stroke-[1.5px] relative z-10 drop-shadow(0 0 15px #8EFF8E)" />
               </div>
            </div>
            <div className="space-y-2 md:space-y-4">
              <h1 className="text-white text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85]">
                STRESS <br/><span className="text-[#8EFF8E]">DETECTOR</span>
              </h1>
              <div className="pt-2 md:pt-4 flex items-center justify-center gap-3">
                <Volume2 className="w-4 h-4 text-[#8EFF8E] animate-pulse" />
                <p className="text-[#8EFF8E] text-[10px] md:text-sm uppercase tracking-[0.4em] font-black animate-pulse opacity-90">
                  Ative o som e aumente o volume!
                </p>
              </div>
            </div>
            <button onClick={handleStartExperience} className="group relative px-10 py-5 md:px-12 md:py-7 bg-[#8EFF8E] text-black font-black text-xl md:text-2xl uppercase italic tracking-widest rounded-full transition-all hover:scale-110 active:scale-95 flex items-center gap-4 animate-button-pulse mt-4">
              <Play className="w-5 h-5 md:w-7 md:h-7 fill-current" />
              INICIAR DIAGNÓSTICO
            </button>
          </div>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xs px-4 flex flex-col items-center">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[10px] text-zinc-600 text-center transition-all duration-300 hover:text-zinc-400 hover:text-sm active:text-sm hover:scale-110 active:scale-105 hover:bg-white/10 cursor-help leading-tight italic">
              Fique tranquilo, é só uma simulação. Respeitamos a LGPD e não coletaremos seus dados (biométricos) 🤭.
            </div>
            <p className="mt-3 text-[9px] text-zinc-800 uppercase tracking-[0.4em] font-black text-center whitespace-nowrap">
              Feito com ❤ pel'O Forno
            </p>
          </div>
        </div>
      )}

      {step === FunnelStep.BIOMETRIC_ANALYSIS && <Act0BiometricAnalysis onComplete={() => navigateTo(FunnelStep.ERROR_SCREEN)} />}
      {step === FunnelStep.ERROR_SCREEN && <Act0Error onComplete={() => navigateTo(FunnelStep.BLUE_SCREEN)} />}
      {step === FunnelStep.BLUE_SCREEN && <Act0BlueScreen mode={blueScreenMode} onComplete={() => blueScreenMode === 'intro' ? navigateTo(FunnelStep.INSTAGRAM_SCROLL) : navigateTo(FunnelStep.BREATHING)} />}
      {step === FunnelStep.INSTAGRAM_SCROLL && <Act0InstagramScroll onComplete={() => {setBlueScreenMode('final'); navigateTo(FunnelStep.BLUE_SCREEN);}} />}
      {step === FunnelStep.BREATHING && <Act0Breathing onComplete={() => navigateTo(FunnelStep.WHATSAPP)} />}
      {step === FunnelStep.WHATSAPP && <Act2WhatsApp userProfile={userProfile} onDecision={(d) => d === 'call' ? navigateTo(FunnelStep.PHONE_CALL) : navigateTo(FunnelStep.SECRET_LOGIN)} mode={whatsappMode} onVolumeChange={(vol) => fadeVolume(vol, 1200)} />}
      {step === FunnelStep.PHONE_CALL && <Act3PhoneCall userProfile={userProfile} onComplete={() => navigateTo(FunnelStep.SECRET_LOGIN)} onDecline={() => {setWhatsappMode('after-decline'); navigateTo(FunnelStep.WHATSAPP);}} onVolumeChange={(vol) => fadeVolume(vol, 1200)} />}
      {step === FunnelStep.SECRET_LOGIN && <Act5SecretLogin onComplete={() => navigateTo(FunnelStep.OFFER)} />}
      {step === FunnelStep.OFFER && <Act4Offer userProfile={userProfile} onAbort={() => navigateTo(FunnelStep.AUTODESTRUCT)} onRestart={() => navigateTo(FunnelStep.START_SCREEN)} onQuiz={() => navigateTo(FunnelStep.STRESS_QUIZ)} />}
      {step === FunnelStep.STRESS_QUIZ && <Act0StressQuiz onComplete={() => navigateTo(FunnelStep.OFFER)} />}
      {step === FunnelStep.AUTODESTRUCT && <Act6Autodestruct onComplete={() => navigateTo(FunnelStep.OFFER)} />}

      {showDevTools && step !== FunnelStep.INDEX && (
        <button onClick={() => setStep(FunnelStep.INDEX)} className="fixed bottom-4 right-4 z-[9999] bg-white/5 text-white/20 p-3 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
          <LayoutGrid className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};

export default App;
