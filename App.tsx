
import React, { useState, useEffect, useRef } from 'react';
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
import { Shield, Power, Volume2, VolumeX, LayoutGrid } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<FunnelStep>(FunnelStep.INDEX);
  const [blueScreenMode, setBlueScreenMode] = useState<'intro' | 'final'>('intro');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Visitante',
    struggle: '',
    answers: {}
  });

  // Motor de áudio persistente
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<any>(null);

  const AUDIO_SOURCE = "https://dl.dropboxusercontent.com/scl/fi/a712ue0yjxqwio6v9b9t5/trilha-exp-360-refugio-TESTE-5-PREMASTERED.mp3?rlkey=hld15nfh2qyjd8virxn14dzmd";
  const DEFAULT_VOLUME = 0.7;

  useEffect(() => {
    const audio = new Audio();
    audio.src = AUDIO_SOURCE;
    audio.loop = false;
    audio.volume = DEFAULT_VOLUME;
    audio.preload = "auto";
    
    audio.onerror = () => {
      console.warn("Aviso: Falha ao carregar áudio do Dropbox.");
    };

    mainAudioRef.current = audio;

    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current.src = "";
        mainAudioRef.current = null;
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, []);

  const fadeVolume = (targetVolume: number, duration: number = 1000) => {
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
  };

  const toggleMute = () => {
    if (mainAudioRef.current) {
      const newMutedState = !isMuted;
      mainAudioRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  const navigateTo = (nextStep: FunnelStep, delay = 0) => {
    if (delay > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setStep(nextStep);
        setIsTransitioning(false);
      }, delay);
    } else {
      setStep(nextStep);
    }
  };

  const startExperience = () => {
    if (mainAudioRef.current) {
      mainAudioRef.current.play().catch(e => {
        console.error("Erro ao reproduzir áudio:", e);
      });
    }
    navigateTo(FunnelStep.BIOMETRIC_ANALYSIS);
  };

  const handleSelectDevStep = (selectedStep: FunnelStep) => {
    setStep(selectedStep);
  };

  const handleBiometricComplete = () => {
    navigateTo(FunnelStep.ERROR_SCREEN);
  };

  const handleErrorComplete = () => {
    setBlueScreenMode('intro');
    navigateTo(FunnelStep.BLUE_SCREEN);
  };

  const handleBlueScreenComplete = () => {
    if (blueScreenMode === 'intro') {
      navigateTo(FunnelStep.BREATHING);
    } else {
      navigateTo(FunnelStep.WHATSAPP);
    }
  };

  const handleBreathingComplete = () => {
    setBlueScreenMode('final');
    navigateTo(FunnelStep.BLUE_SCREEN);
  };

  const handleWhatsAppDecision = (decision: 'call' | 'login' | 'exit') => {
    if (decision === 'call') navigateTo(FunnelStep.PHONE_CALL);
    else if (decision === 'login') navigateTo(FunnelStep.SECRET_LOGIN);
    else navigateTo(FunnelStep.AUTODESTRUCT);
  };

  const handleCallComplete = () => {
    fadeVolume(DEFAULT_VOLUME, 1000);
    navigateTo(FunnelStep.SECRET_LOGIN, 500);
  };

  const handleCallDecline = () => {
    fadeVolume(DEFAULT_VOLUME, 1000);
    navigateTo(FunnelStep.OFFER, 500);
  };

  const handleLoginComplete = () => {
    navigateTo(FunnelStep.OFFER, 800);
  };

  const DevControls = () => (
    <button 
      onClick={() => setStep(FunnelStep.INDEX)}
      className="fixed bottom-4 right-4 z-[9999] bg-white/5 hover:bg-white/10 backdrop-blur-md text-white/20 hover:text-white p-3 rounded-full border border-white/5 transition-all shadow-lg"
    >
      <LayoutGrid className="w-5 h-5" />
    </button>
  );

  const AudioControl = () => (
    <button 
      onClick={toggleMute}
      className={`fixed top-4 right-4 z-[100] p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[#8EFF8E] transition-all hover:bg-black/60 shadow-xl ${step === FunnelStep.START_SCREEN ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
    </button>
  );

  if (step === FunnelStep.INDEX) {
    return <DevIndex onSelectStep={handleSelectDevStep} onStartNormalFlow={() => setStep(FunnelStep.START_SCREEN)} />;
  }

  if (step === FunnelStep.START_SCREEN) {
    return (
      <div className="min-h-screen w-full bg-[#050505] flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#050505_100%)]"></div>
        
        <div className="relative z-10 text-center space-y-16 animate-in fade-in zoom-in duration-1000 max-w-lg w-full">
          <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
             <div className="absolute inset-0 rounded-full border border-white/[0.02]"></div>
             <div className="absolute inset-4 rounded-full border border-white/[0.04]"></div>
             <div className="absolute inset-8 rounded-full bg-[#121212] border border-[#8EFF8E]/10 flex items-center justify-center shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                <Shield className="w-20 h-20 text-[#8EFF8E]/40 stroke-[1px]" />
             </div>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-white text-3xl md:text-5xl font-black tracking-[0.2em] uppercase italic leading-[1.1] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              ATIVE O SEU SEXTO <br/> SENTIDO:
            </h1>
            <p className="text-[#8EFF8E] text-[10px] md:text-xs uppercase tracking-[0.6em] font-black animate-pulse opacity-90 drop-shadow-[0_0_8px_rgba(142,255,142,0.3)]">
              Ative o som e aumente o volume!
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-14">
            <button 
              onClick={startExperience}
              className="group relative px-12 py-7 bg-[#8EFF8E] text-black font-black text-lg md:text-xl uppercase italic tracking-[0.05em] rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(142,255,142,0.4)] flex items-center gap-4 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-[-30deg]"></div>
              <Power className="w-7 h-7 stroke-[3px]" />
              INICIAR DIAGNÓSTICO
            </button>
            
            <p className="text-zinc-700 text-[10px] md:text-[11px] max-w-[340px] mx-auto leading-relaxed font-sans font-bold uppercase tracking-tighter opacity-70 text-center">
              "Fique tranquilo, pois é só uma simulação/brincadeira! Não se preocupe, não coletaremos seus dados (biométricos)."
            </p>
          </div>
        </div>
        
        <DevControls />
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full flex flex-col bg-black relative transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
      <AudioControl />

      {step === FunnelStep.BIOMETRIC_ANALYSIS && <Act0BiometricAnalysis onComplete={handleBiometricComplete} />}
      {step === FunnelStep.ERROR_SCREEN && <Act0Error onComplete={handleErrorComplete} />}
      {step === FunnelStep.BLUE_SCREEN && <Act0BlueScreen mode={blueScreenMode} onComplete={handleBlueScreenComplete} />}
      {step === FunnelStep.BREATHING && <Act0Breathing onComplete={handleBreathingComplete} />}
      {step === FunnelStep.WHATSAPP && <Act2WhatsApp userProfile={userProfile} onDecision={handleWhatsAppDecision} />}
      {step === FunnelStep.PHONE_CALL && (
        <Act3PhoneCall 
          userProfile={userProfile} 
          onComplete={handleCallComplete} 
          onDecline={handleCallDecline} 
          onVolumeChange={(vol) => fadeVolume(vol, 1200)}
        />
      )}
      {step === FunnelStep.SECRET_LOGIN && <Act5SecretLogin onComplete={handleLoginComplete} />}
      {step === FunnelStep.AUTODESTRUCT && <Act6Autodestruct />}
      {step === FunnelStep.OFFER && <Act4Offer userProfile={userProfile} />}

      {isTransitioning && (
        <div className="fixed inset-0 z-[999] pointer-events-none bg-black animate-glitch opacity-30"></div>
      )}
      
      <DevControls />
    </div>
  );
};

export default App;
