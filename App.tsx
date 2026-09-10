import React, { useState, useEffect, useRef } from 'react';
import Wheel from './components/Wheel';
import InputPanel from './components/InputPanel';
import WinnerModal from './components/WinnerModal';
import { WheelItem, WheelState } from './types';
import { DEFAULT_ITEMS } from './constants';
import { Play, Settings, X, Clock } from 'lucide-react';

const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
};

const App: React.FC = () => {
  const [items, setItems] = useState<WheelItem[]>(DEFAULT_ITEMS);
  const [wheelState, setWheelState] = useState<WheelState>({
    rotation: 0,
    isSpinning: false,
    winner: null,
  });
  const [centerImage, setCenterImage] = useState<string | null>(null);
  const [width, height] = useWindowSize();
  const [isConfigOpen, setIsConfigOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  
  const pendingWinnerRef = useRef<WheelItem | null>(null);

  useEffect(() => {
    const updateClock = () => {
      const optionsDate: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Caracas',
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      };

      const optionsTime: Intl.DateTimeFormatOptions = {
        timeZone: 'America/Caracas',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };

      const now = new Date();
      const datePart = new Intl.DateTimeFormat('es-VE', optionsDate).format(now);
      const timePart = new Intl.DateTimeFormat('es-VE', optionsTime).format(now).toLowerCase();

      // Ajuste para el formato exacto solicitado: <nombre del día> <día> de <nombre del mes> del <año>. hh:mm:ss <a.m./p.m.>
      // Intl suele devolver "domingo, 2 de marzo de 2025", quitamos la coma.
      const dateClean = datePart.replace(',', '');
      setCurrentTime(`${dateClean}. ${timePart}`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSpin = () => {
    if (wheelState.isSpinning || items.length === 0) return;
    setIsConfigOpen(false);

    const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    let winnerIndex = -1;
    let currentWeight = 0;

    for (let i = 0; i < items.length; i++) {
      currentWeight += items[i].weight;
      if (randomWeight < currentWeight) {
        winnerIndex = i;
        break;
      }
    }

    if (winnerIndex === -1) winnerIndex = items.length - 1;
    const winnerItem = items[winnerIndex];

    let accumulatedWeight = 0;
    for(let i=0; i < winnerIndex; i++) {
        accumulatedWeight += items[i].weight;
    }
    const startPercent = accumulatedWeight / totalWeight;
    const endPercent = (accumulatedWeight + winnerItem.weight) / totalWeight;
    const centerPercent = (startPercent + endPercent) / 2;
    const centerAngle = centerPercent * 360;

    const extraSpins = 20; 
    const targetRotation = wheelState.rotation + (extraSpins * 360) + (360 - centerAngle) - (wheelState.rotation % 360);

    setWheelState((prev) => ({
      ...prev,
      isSpinning: true,
      winner: null, 
      rotation: targetRotation,
    }));

    pendingWinnerRef.current = winnerItem;
  };

  const handleSpinEnd = () => {
    const winner = pendingWinnerRef.current;
    if (winner) {
      setWheelState((prev) => ({
        ...prev,
        isSpinning: false,
        winner: winner,
      }));
    }
  };

  const handleReset = () => {
    setWheelState((prev) => ({ ...prev, winner: null }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setCenterImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col relative overflow-hidden">
      
      <div className="absolute top-4 left-4 z-[100]">
        <button
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="bg-white text-custom-accent p-3 rounded-full shadow-lg border-2 border-custom-accent hover:bg-pink-50 transition"
          disabled={wheelState.isSpinning}
        >
          {isConfigOpen ? <X size={24} /> : <Settings size={24} />}
        </button>
      </div>

      <div className="flex-grow flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
        
        <div 
          className={`
            fixed md:relative inset-0 z-[80] md:z-auto bg-black/50 md:bg-transparent flex items-center justify-center md:items-start md:justify-center transition-opacity duration-300
            ${isConfigOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none md:hidden'}
            md:w-1/3 order-2 md:order-1
          `}
          onClick={(e) => {
            if (window.innerWidth < 768 && e.target === e.currentTarget) setIsConfigOpen(false);
          }}
        >
          <div className="w-full max-w-md md:mt-16 p-4">
            <InputPanel 
              items={items} 
              setItems={setItems} 
              onImageUpload={handleImageUpload}
              centerImage={centerImage}
              disabled={wheelState.isSpinning}
            />
          </div>
        </div>

        <div className={`w-full ${isConfigOpen ? 'md:w-2/3' : 'md:w-full'} transition-all duration-500 flex flex-col items-center justify-center order-1 md:order-2 space-y-6`}>
          
          <div className="flex flex-col items-center space-y-4 w-full">
            <div className="bg-[#FFF5F8] px-6 py-4 md:px-10 md:py-6 rounded-3xl shadow-xl border-4 border-white border-opacity-60 backdrop-blur-sm max-w-4xl text-center transform hover:scale-[1.01] transition-transform duration-300">
               <h1 className="text-xl md:text-3xl lg:text-4xl font-extrabold text-custom-text leading-tight">
                ¡Gana un ramo para este 14 de Febrero con <span className="text-custom-accent">@manoscreativas.arr</span>!
              </h1>
            </div>

            <div className="flex items-center gap-2 bg-white/40 px-6 py-2 rounded-full border border-white/60 shadow-md backdrop-blur-md">
              <Clock size={18} className="text-custom-accent animate-pulse" />
              <span className="text-sm md:text-lg font-bold text-custom-text capitalize tracking-tight">
                {currentTime}
              </span>
            </div>
          </div>
          
          <Wheel 
            items={items} 
            rotation={wheelState.rotation} 
            centerImage={centerImage}
            onSpinEnd={handleSpinEnd}
          />

          <button
            onClick={handleSpin}
            disabled={wheelState.isSpinning || items.length === 0}
            className={`
              relative group px-12 py-4 rounded-full font-extrabold text-2xl tracking-wider text-white shadow-xl transition-all transform
              ${wheelState.isSpinning || items.length === 0 
                ? 'bg-gray-400 cursor-not-allowed scale-95' 
                : 'bg-custom-accent hover:bg-pink-700 hover:scale-105 active:scale-95 animate-pulse-slow'}
            `}
          >
            <span className="flex items-center gap-3">
              {wheelState.isSpinning ? 'Girando...' : '¡GIRAR!'}
              {!wheelState.isSpinning && <Play fill="currentColor" size={24} />}
            </span>
          </button>
        </div>
      </div>

      <WinnerModal 
        winner={wheelState.winner} 
        onClose={handleReset} 
        width={width}
        height={height}
      />

      <footer className="mt-8 text-center pb-4 z-10">
        <p className="text-custom-accent font-bold text-base md:text-lg tracking-wide opacity-80 hover:opacity-100 transition-opacity">
          By @Lanetting_ Creative Solutions
        </p>
      </footer>
    </div>
  );
};

export default App;