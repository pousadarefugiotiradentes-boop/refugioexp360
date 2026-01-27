
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

  // Referência para a trilha sonora principal (persistente)
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Instancia o áudio no carregamento da página (Pre-loading)
    // Usando o nome exato fornecido por você
    const audio = new Audio('Som respiração - Rubens Borges (youtube).mp3'); 
    audio.loop = false; // Não desejamos loop
    audio.volume = 0.8;
    mainAudioRef.current = audio;

    return () => {
      if (mainAudioRef.current) {
        mainAudioRef.current.pause();
        mainAudioRef.current = null;
      }
    };
  }, []);

  // Controle de Mute
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
    // Inicia a trilha sonora principal no gesto do usuário
    if (mainAudioRef.current) {
      mainAudioRef.current.play().catch(e => {
        console.warn("A reprodução do áudio foi bloqueada ou o arquivo não foi encontrado:", e);
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
    navigateTo(FunnelStep.SECRET_LOGIN, 500);
  };

  const handleCallDecline = () => {
    navigateTo(FunnelStep.OFFER, 500);
  };

  const handleLoginComplete = () => {
    navigateTo(FunnelStep.OFFER, 800);
  };

  const DevControls = () => (
    <button 
      onClick={() => setStep(FunnelStep.INDEX)}
      className="fixed bottom-4 right-4 z-[9999] bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all shadow-2xl"
      title="Voltar ao Mission Control"
    >
      <LayoutGrid className="w-5 h-5" />
    </button>
  );

  // Widget de Áudio Global
  const AudioControl = () => (
    <button 
      onClick={toggleMute}
      className="fixed top-4 right-4 z-[100] p-3 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-[#8EFF8E] hover:bg-black/40 transition-all active:scale-90"
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-pulse" />}
    </button>
  );

  if (step === FunnelStep.INDEX) {
    return <DevIndex onSelectStep={handleSelectDevStep} onStartNormalFlow={() => setStep(FunnelStep.START_SCREEN)} />;
  }

  // TELA INICIAL (Sexto Sentido)
  if (step === FunnelStep.START_SCREEN) {
    return (
      <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center p-6 font-mono overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-40"></div>
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

        <div className="relative z-10 text-center space-y-12 animate-in fade-in zoom-in duration-1000 max-w-lg w-full">
          <div className="w-32 h-32 bg-zinc-900 border border-[#8EFF8E]/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(142,255,142,0.15)] relative">
            <div className="absolute inset-0 border border-[#8EFF8E]/10 rounded-full animate-ping"></div>
            <Shield className="w-16 h-16 text-[#8EFF8E]/80 animate-pulse relative z-10" />
          </div>
          
          <div className="space-y-4">
            <h1 className="text-white text-2xl md:text-3xl font-black tracking-[0.25em] uppercase italic leading-tight">
              ATIVE O SEU SEXTO SENTIDO:
            </h1>
            <p className="text-[#8EFF8E] text-xs md:text-sm uppercase tracking-[0.4em] font-bold animate-pulse">
              Ative o som e aumente o volume!
            </p>
          </div>
          
          <div className="flex flex-col items-center space-y-10">
            <button 
              onClick={startExperience}
              className="group relative px-14 py-6 bg-[#8EFF8E] text-black font-black text-base md:text-lg uppercase italic tracking-[0.15em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_50px_rgba(142,255,142,0.5)] flex items-center gap-4"
            >
              <Power className="w-6 h-6" />
              INICIAR DIAGNÓSTICO
            </button>
            
            <p className="text-zinc-600 text-[10px] md:text-[11px] max-w-[320px] mx-auto leading-relaxed font-sans font-medium opacity-80">
              "Fique tranquilo, pois é só uma simulação/brincadeira! Não se preocupe, não coletaremos seus dados (biométricos)."
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-5 pointer-events-none">
          <div className="flex space-x-12 text-[8px] uppercase tracking-[1em] text-white">
            <span>BIT_OS</span>
            <span>SYSTEM_READY</span>
            <span>V.2026</span>
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
      {step === FunnelStep.PHONE_CALL && <Act3PhoneCall userProfile={userProfile} onComplete={handleCallComplete} onDecline={handleCallDecline} />}
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
