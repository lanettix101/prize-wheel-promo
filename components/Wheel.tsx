import React, { useMemo } from 'react';
import { WheelItem } from '../types';

interface WheelProps {
  items: WheelItem[];
  rotation: number;
  centerImage: string | null;
  onSpinEnd: () => void;
}

const Wheel: React.FC<WheelProps> = ({ items, rotation, centerImage, onSpinEnd }) => {
  const totalWeight = useMemo(() => items.reduce((sum, item) => sum + item.weight, 0), [items]);

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  let cumulativePercent = 0;

  const slices = items.map((item) => {
    const startPercent = cumulativePercent;
    const slicePercent = item.weight / totalWeight;
    const endPercent = cumulativePercent + slicePercent;
    cumulativePercent = endPercent;

    const [startX, startY] = getCoordinatesForPercent(startPercent);
    const [endX, endY] = getCoordinatesForPercent(endPercent);

    const largeArcFlag = slicePercent > 0.5 ? 1 : 0;

    const pathData = [
      `M 0 0`,
      `L ${startX} ${startY}`,
      `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
      `Z`,
    ].join(' ');

    const midAngle = (startPercent + slicePercent / 2) * 360; 
    
    return {
      pathData,
      color: item.color,
      label: item.label,
      midAngle,
      id: item.id
    };
  });

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] mx-auto">
      
      {/* Flecha (Pointer) - Z-INDEX 60 para estar sobre el borde y la ruleta */}
      <div className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 z-[60]">
         <div className="w-0 h-0 border-t-[12px] md:border-t-[18px] border-t-transparent border-b-[12px] md:border-b-[18px] border-b-transparent border-r-[25px] md:border-r-[35px] border-r-custom-accent filter drop-shadow-lg"></div>
      </div>

      {/* Marco estático (Borde y Sombra) - Z-INDEX 50 */}
      <div className="absolute inset-0 rounded-full border-8 border-custom-accent shadow-2xl z-[50] pointer-events-none"></div>

      {/* Disco Giratorio - Z-INDEX 10 */}
      <div
        className="w-full h-full rounded-full overflow-hidden z-10"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: rotation !== 0 ? 'transform 30s cubic-bezier(0.1, 0.9, 0.1, 1)' : 'none',
        }}
        onTransitionEnd={onSpinEnd}
      >
        <svg viewBox="-1 -1 2 2" className="w-full h-full">
          {slices.map((slice) => (
            <g key={slice.id}>
              <path d={slice.pathData} fill={slice.color} stroke="#D81B60" strokeWidth="0.015" />
              <g transform={`rotate(${slice.midAngle}) translate(0.5, 0)`}>
                 <text
                    x="0"
                    y="0"
                    fill="#2D3436" 
                    fontSize="0.07"
                    fontWeight="800"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}
                 >
                   {slice.label.length > 14 ? slice.label.substring(0, 12) + '...' : slice.label}
                 </text>
              </g>
            </g>
          ))}
        </svg>
      </div>

      {/* Logo/Imagen Central - Z-INDEX 60 para estar sobre la ruleta */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 bg-white rounded-full border-4 border-custom-accent z-[60] flex items-center justify-center overflow-hidden shadow-lg">
        {centerImage ? (
          <img src={centerImage} alt="Logo" className="w-full h-full object-cover" />
        ) : (
           <span className="text-custom-accent font-bold text-[10px] md:text-xs text-center px-2">TU LOGO</span>
        )}
      </div>
    </div>
  );
};

export default Wheel;