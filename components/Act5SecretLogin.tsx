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
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 50);
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
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
      setRecoveryMessage('Acesso restaurado!');
      setIsRecovering(false);
      setTimeout(() => handleLogin(), 2000);
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#0a0a0a] text-white font-mono min-h-screen relative overflow-y-auto">
      <DataRainBackground />
      <div className="max-w-xl w-full relative z-10 animate-in fade-in zoom-in duration-700 p-2 landscape:py-12">
        <div className="text-center mb-8 landscape:mb-6">
          <div className="relative inline-block mb-6 landscape:mb-3">
            <div className="w-20 h-20 md:w-32 md:h-32 bg-zinc-900 border-2 border-amber-500/40 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,183,0,0.1)]">
              <Shield className="w-10 h-10 md:w-16 md:h-16 text-amber-500" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs md:text-sm text-gray-400 mb-2 uppercase tracking-widest font-bold">Super Deep Dark Web Security</span>
            <h1 className="text-2xl md:text-5xl font-black text-[#FFB700] uppercase italic tracking-tighter">SECRET_ACCESS</h1>
          </div>
        </div>

        {recoveryMessage && (
          <div className="bg-green-500/10 border border-green-500/50 text-green-500 p-4 md:p-6 rounded-2xl flex items-center space-x-4 mb-6">
            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
            <p className="text-xs md:text-lg font-black uppercase tracking-wide">{recoveryMessage}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 md:space-y-10 bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-2xl shadow-2xl landscape:p-6">
          <div className="space-y-2">
            <label className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.3em] font-black ml-1">LOGIN_ID</label>
            <input type="text" value="SUPERADMIN" readOnly className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-sm md:text-xl text-[#FFB700] font-black tracking-widest outline-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] md:text-xs text-gray-500 uppercase tracking-[0.3em] font-black ml-1">PASSWORD</label>
            <div className="relative cursor-pointer" onClick={() => setShowPass(!showPass)}>
              <input type={showPass ? 'text' : 'password'} value={password} readOnly className="w-full bg-black/60 border border-white/10 rounded-2xl py-5 px-6 text-sm md:text-xl text-amber-500 font-black tracking-[0.4em] outline-none" />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-500 transition-colors">
                {showPass ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col space-y-4">
            <button disabled={loading} className="w-full bg-amber-600 hover:bg-amber-500 text-white font-black py-6 md:py-8 rounded-2xl shadow-[0_20px_40px_rgba(217,119,6,0.2)] flex items-center justify-center space-x-4 uppercase italic text-lg md:text-2xl active:scale-95 transition-all">
              {loading ? <div className="w-7 h-7 border-4 border-white/20 border-t-white rounded-full animate-spin"></div> : <span>FAZER LOGIN</span>}
            </button>
            <button type="button" onClick={handleRecover} className="text-xs md:text-sm text-gray-600 uppercase hover:text-amber-500 font-black tracking-widest text-center py-2">Esqueci a senha</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Act5SecretLogin;