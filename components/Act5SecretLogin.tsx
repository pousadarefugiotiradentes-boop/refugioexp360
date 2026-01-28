
import React, { useState, useEffect, useRef } from 'react';
import { Shield, Key, Eye, EyeOff, Terminal, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';

interface Act5SecretLoginProps {
  onComplete: () => void;
}

const DataRainBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const characters = "01ABCDEF";
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = new Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 10, 0.05)";
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = "rgba(255, 183, 0, 0.15)";
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 50);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-20" />;
};

const Act5SecretLogin: React.FC<Act5SecretLoginProps> = ({ onComplete }) => {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('meurefugio'); 
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState<string | null>(null);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setTimeout(onComplete, 2000);
  };

  const handleRecover = () => {
    setIsRecovering(true);
    setTimeout(() => {
      setPassword('RESTORED_26');
      setShowPass(true);
      setRecoveryMessage('Sua senha foi restaurada com sucesso!');
      setIsRecovering(false);
      
      setTimeout(() => {
        handleLogin();
      }, 2000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-white font-mono h-screen relative overflow-hidden">
      <DataRainBackground />
      
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>
      
      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center">
          <div className="relative inline-block mb-[20px]">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full"></div>
            <div className="w-24 h-24 bg-zinc-900 border border-amber-500/30 rounded-full relative flex items-center justify-center shadow-[0_0_30px_rgba(255,183,0,0.2)]">
              <Shield className="w-12 h-12 text-amber-500 animate-pulse" />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-sm font-normal text-[#E0E0E0] mb-1 uppercase tracking-tighter">Super Deep Dark Web</span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#FFB700] tracking-wide uppercase italic drop-shadow-[0_0_10px_rgba(255,183,0,0.4)]">
              REFÚGIO TIRADENTES
            </h1>
            <p className="mt-3 text-xs md:text-[12px] font-normal text-[#D4AF37] italic">
              "Tú és o meu Refúgio!"
            </p>
          </div>
        </div>

        {recoveryMessage && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top-4 duration-500 mt-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <CheckCircle2 className="w-5 h-5" />
            <p className="text-xs font-black uppercase tracking-tight">{recoveryMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden mt-10 transition-all hover:border-amber-500/20">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Terminal className="w-20 h-20" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black">LOGIN</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                <span className="text-amber-500/50 text-sm font-bold">&gt;{` `}</span>
                <Terminal className="w-4 h-4 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
              </div>
              <input 
                type="text" 
                value="SUPERADMIN"
                readOnly
                className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-sm outline-none text-[#FFB700] font-mono font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 uppercase tracking-widest font-black">SENHA</label>
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500/50 group-hover:text-amber-500 transition-colors" />
              <input 
                type={showPass ? 'text' : 'password'}
                value={password}
                readOnly
                className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 pl-12 pr-14 text-sm outline-none text-amber-500 font-mono font-bold tracking-widest"
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-amber-500 transition-colors"
              >
                {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col space-y-3">
            <button 
              type="submit"
              disabled={loading || isRecovering}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-6 rounded-2xl shadow-xl shadow-amber-900/20 transition-all flex items-center justify-center space-x-3 active:scale-95 group uppercase italic tracking-tight text-xl"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>FAZER LOGIN</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {!recoveryMessage && (
              <button 
                type="button"
                onClick={handleRecover}
                disabled={isRecovering}
                className="w-full bg-transparent border border-white/10 text-gray-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:text-amber-500 hover:border-amber-500/30 transition-all flex items-center justify-center space-x-2"
              >
                {isRecovering ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3" />
                    <span>RECUPERAR MINHA SENHA</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-600 font-bold animate-pulse uppercase tracking-tight">
          ATENÇÃO: JAMAIS compartilhe seu LOGIN e SENHA com ninguém.
        </p>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] text-white/5 uppercase tracking-[1em] whitespace-nowrap">
        JOAQUIM_OPERATIONAL_SYSTEM_v2.026
      </div>
    </div>
  );
};

export default Act5SecretLogin;
