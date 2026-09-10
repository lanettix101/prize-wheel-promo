import React, { useEffect, useState } from 'react';
import { WheelItem } from '../types';
import Confetti from 'react-confetti';
import { X, RefreshCw } from 'lucide-react';

interface WinnerModalProps {
  winner: WheelItem | null;
  onClose: () => void;
  width: number;
  height: number;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, onClose, width, height }) => {
  const [isBouncing, setIsBouncing] = useState(true);

  useEffect(() => {
    if (winner) {
      setIsBouncing(true);
      const timer = setTimeout(() => {
        setIsBouncing(false);
      }, 7000); // Rebote para a los 7 segundos
      return () => clearTimeout(timer);
    }
  }, [winner]);

  if (!winner) return null;

  const participationMessage = winner.weight === 1 
    ? "¡Es escogido ganador con una sola participación en el sorteo!"
    : `Es escogido ganador con ${winner.weight} participaciones`;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose}></div>
      
      <Confetti width={width} height={height} recycle={false} numberOfPieces={600} gravity={0.1} />

      <div className={`relative bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 max-w-sm w-full text-center border-8 border-custom-accent ${isBouncing ? 'animate-bounce' : ''}`}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-2"
        >
          <X size={28} />
        </button>

        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">¡Tenemos un ganador!</h3>
        <div 
          className="text-4xl md:text-5xl font-black text-custom-accent mb-6 break-words leading-tight"
          style={{ textShadow: '3px 3px 0px rgba(0,0,0,0.05)' }}
        >
          {winner.label}
        </div>

        <div className="bg-[#FFF5F8] text-custom-accent px-6 py-4 rounded-2xl mb-8 border-2 border-pink-100 text-base font-bold italic shadow-inner">
          {participationMessage}
        </div>
        
        <div className="flex justify-center">
            <button
            onClick={onClose}
            className="flex items-center gap-3 bg-custom-accent hover:bg-pink-700 text-white font-extrabold py-4 px-10 rounded-full shadow-xl transform transition hover:scale-105 active:scale-95"
            >
            <RefreshCw size={24} />
            REINTENTAR
            </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerModal;