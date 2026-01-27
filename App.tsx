
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FunnelStep, UserProfile } from './types';
import DevIndex from './components/DevIndex';
import Act0BiometricAnalysis from './components/Act0BiometricAnalysis';
import Act0Error from './components/Act0Error';
import Act0Breathing from './components/Act0Breathing';
import Act0BlueScreen from './components/Act0BlueScreen';
import Act2WhatsApp from './components/Act2WhatsApp';
import Act3PhoneCall from './components/Act3PhoneCall';
import Act4Offer from './components/Act4Offer';
import Act5SecretLogin from './components/Act5SecretLogin';
import Act6Autodestruct from './components/Act6Autodestruct';
import { HERO_IMAGE_URL, LOGO_URL } from './constants';
import { Shield, Power, Volume2, VolumeX, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<FunnelStep>(FunnelStep.INDEX);
  const [blueScreenMode, setBlueScreenMode] = useState<'intro' | 'final'>('intro');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [whatsappMode, setWhatsappMode] = useState<'normal' | 'after-decline'>('normal');
  const [userProfile] = useState<UserProfile>({
    name: 'Visitante',
    struggle: '',
    answers: {}
  });

  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<any>(null);

  const AUDIO_SOURCE = "https://dl.dropboxusercontent.com/scl/fi/a712ue0yjxqwio6v9b9t5/trilha-exp-360-refugio-TESTE-5-PREMASTERED.mp3?rlkey=hld15nfh2qyjd8virxn14dzmd";
  const JOAQUIM_VOICE_URL = "https://dl.dropboxusercontent.com/scl/fi/syvbwm8r21kdctghvlkmv/joaquim-chamando.mp3?rlkey=34rdytesptpapd79v128gmtcw";
  const JOAQUIM_AVATAR = "https://i.postimg.cc/1XhTqCyf/joaquim-perfil-2.png";
  const DEFAULT_VOLUME = 0.7;

  useEffect(() => {
    // Pré-carregamento de Ativos (Auditoria Item B)
    const preloadImages = [HERO_IMAGE_URL, LOGO_URL, JOAQUIM_AVATAR];
    preloadImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const voicePreload = new Audio();
    voicePreload.src = JOAQUIM_VOICE_URL;
    voicePreload.preload = "auto";

    const audio = new Audio();
    audio.src = AUDIO_SOURCE;
    audio.loop = false;
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

  const fadeVolume = useCallback((targetVolume: number, duration: number = 1000) => {
    if (!mainAudioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    
    const startVolume = mainAudioRef.current.volume;
    const distance = targetVolume - startVolume;
    const steps = 20;
    const stepDuration = duration / steps;
    let currentStep = 0;

    fadeIntervalRef.current = setInterval(() => {
      currentStep++;
      if (mainAudioRef.current) {
        mainAudioRef.current.volume = startVolume + (distance * (currentStep / steps));
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

  const handleBiometricComplete = useCallback(() => {
    navigateTo(FunnelStep.ERROR_SCREEN);
  }, [navigateTo]);

  const handleErrorComplete = useCallback(() => {
    setBlueScreenMode('intro');
    navigateTo(FunnelStep.BLUE_SCREEN);
  }, [navigateTo]);

  const handleBlueScreenComplete = useCallback(() => {
    if (blueScreenMode === 'intro') {
      navigateTo(FunnelStep.BREATHING);
    } else {
      navigateTo(FunnelStep.WHATSAPP);
    }
  }, [navigateTo, blueScreenMode]);

  const handleBreathingComplete = useCallback(() => {
    setBlueScreenMode('final');
    navigateTo(FunnelStep.BLUE_SCREEN);
  }, [navigateTo]);

  const handleCallComplete = useCallback(() => {
    fadeVolume(DEFAULT_VOLUME, 1000);
    navigateTo(FunnelStep.SECRET_LOGIN, 500);
  }, [navigateTo, fadeVolume]);

  const handleCallDecline = useCallback(() => {
    fadeVolume(DEFAULT_VOLUME, 1000);
    setWhatsappMode('after-decline');
    navigateTo(FunnelStep.WHATSAPP, 500);
  }, [navigateTo, fadeVolume]);

  const handleWhatsAppDecision = useCallback((decision: 'call' | 'login' | 'exit') => {
    if (decision === 'call') navigateTo(FunnelStep.PHONE_CALL);
    else if (decision === 'login') navigateTo(FunnelStep.SECRET_LOGIN);
    else navigateTo(FunnelStep.AUTODESTRUCT);
  }, [navigateTo]);

  const handleFinalLoginTransition = useCallback(() => {
    navigateTo(FunnelStep.SECRET_LOGIN, 1000);
  }, [navigateTo]);

  const handleSecretLoginComplete = useCallback(() => {
    navigateTo(FunnelStep.OFFER, 800);
  }, [navigateTo]);

  if (step === FunnelStep.INDEX) {
    return (
      <DevIndex 
        onSelectStep={(s, mode) => {
          if (mode) setWhatsappMode(mode as any);
          else setWhatsappMode('normal');
          setStep(s);
        }} 
        onStartNormalFlow={() => {
          setWhatsappMode('normal');
          setStep(FunnelStep.START_SCREEN);
        }} 
      />
    );
  }

  if (step === FunnelStep.START_SCREEN) {
    return (
      <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#050505_100%)]"></div>
        <div className="relative z-10 text-center space-y-16 animate-in fade-in zoom-in duration-1000 max-w-lg w-full flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border border-white/[0.02]"></div>
             <div className="absolute inset-8 rounded-full bg-[#121212] border border-[#8EFF8E]/10 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                <Shield className="w-20 h-20 text-[#8EFF8E]/40 stroke-[1px]" />
             </div>
          </div>
          <div className="space-y-8">
            <h1 className="text-white text-3xl md:text-5xl font-black tracking-[0.1em] uppercase italic leading-[1.1]">
              MEDIDOR DE NÍVEL <br/> DE STRESS
            </h1>
            <p className="text-[#8EFF8E] text-sm md:text-base uppercase tracking-[0.4em] font-black animate-pulse opacity-90">
              Ative o som e aumente o volume!
            </p>
          </div>
          <button 
            onClick={handleStartExperience}
            className="group relative px-12 py-7 bg-[#8EFF8E] text-black font-black text-lg md:text-xl uppercase italic tracking-[0.05em] rounded-full transition-all hover:scale-110 active:scale-95 flex items-center gap-4 animate-button-pulse"
          >
            INICIAR DIAGNÓSTICO
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col bg-black relative transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <button onClick={toggleMute} className="fixed top-4 right-4 z-[100] p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[#8EFF8E]">
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
      </button>

      {step === FunnelStep.BIOMETRIC_ANALYSIS && <Act0BiometricAnalysis onComplete={handleBiometricComplete} />}
      {step === FunnelStep.ERROR_SCREEN && <Act0Error onComplete={handleErrorComplete} />}
      {step === FunnelStep.BLUE_SCREEN && <Act0BlueScreen mode={blueScreenMode} onComplete={handleBlueScreenComplete} />}
      {step === FunnelStep.BREATHING && <Act0Breathing onComplete={handleBreathingComplete} />}
      {step === FunnelStep.WHATSAPP && <Act2WhatsApp userProfile={userProfile} onDecision={handleWhatsAppDecision} mode={whatsappMode} onFinalComplete={handleFinalLoginTransition} onVolumeChange={(vol) => fadeVolume(vol, 1200)} />}
      {step === FunnelStep.PHONE_CALL && <Act3PhoneCall userProfile={userProfile} onComplete={handleCallComplete} onDecline={handleCallDecline} onVolumeChange={(vol) => fadeVolume(vol, 1200)} />}
      {step === FunnelStep.SECRET_LOGIN && <Act5SecretLogin onComplete={handleSecretLoginComplete} />}
      {step === FunnelStep.AUTODESTRUCT && <Act6Autodestruct onComplete={() => navigateTo(FunnelStep.OFFER)} />}
      {step === FunnelStep.OFFER && <Act4Offer userProfile={userProfile} />}

      <button onClick={() => setStep(FunnelStep.INDEX)} className="fixed bottom-4 right-4 z-[9999] bg-white/5 text-white/20 p-3 rounded-full border border-white/5">
        <LayoutGrid className="w-5 h-5" />
      </button>
    </div>
  );
};

export default App;
