import React, { useState } from 'react';
import { WheelItem } from '../types';
import { SLICE_COLORS } from '../constants';
import { Trash2, Plus, Upload } from 'lucide-react';

interface InputPanelProps {
  items: WheelItem[];
  setItems: React.Dispatch<React.SetStateAction<WheelItem[]>>;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  centerImage: string | null;
  disabled: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ items, setItems, onImageUpload, centerImage, disabled }) => {
  const [newItemLabel, setNewItemLabel] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(1);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel.trim()) return;

    const colorIndex = items.length % SLICE_COLORS.length;
    const newItem: WheelItem = {
      id: Date.now().toString(),
      label: newItemLabel,
      weight: newItemWeight > 0 ? newItemWeight : 1,
      color: SLICE_COLORS[colorIndex],
    };

    setItems([...items, newItem]);
    setNewItemLabel('');
    setNewItemWeight(1);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) return; // Prevent removing last item
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border-2 border-custom-accent w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-custom-accent">Configuración</h2>
      
      {/* Image Upload */}
      <div className="mb-6">
        <label className="block text-sm font-semibold mb-2">Imagen Central</label>
        <div className="flex items-center gap-4">
          <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-custom-accent text-white rounded-lg hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            <Upload size={18} />
            <span>Subir Imagen</span>
            <input 
              type="file" 
              accept="image/*" 
              onChange={onImageUpload} 
              className="hidden" 
              disabled={disabled}
            />
          </label>
          {centerImage && <span className="text-xs text-green-600 font-bold">¡Imagen cargada!</span>}
        </div>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="mb-6 space-y-3">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Nombre Opción</label>
          <input
            type="text"
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            placeholder="Ej: Ganar 100€"
            className="w-full p-2 bg-white text-custom-text border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-accent placeholder-gray-400"
            disabled={disabled}
          />
        </div>
        <div>
           <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Probabilidad (Peso Entero)</label>
           <div className="flex gap-2">
            <input
              type="number"
              min="1"
              step="1"
              value={newItemWeight}
              onChange={(e) => setNewItemWeight(parseInt(e.target.value) || 0)}
              className="w-1/3 p-2 bg-white text-custom-text border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-custom-accent"
              disabled={disabled}
            />
            <button
              type="submit"
              disabled={!newItemLabel.trim() || disabled}
              className="flex-1 bg-custom-accent text-white font-bold rounded-lg hover:bg-pink-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Agregar
            </button>
           </div>
           <p className="text-xs text-gray-500 mt-1">A mayor valor, más posibilidades de ganar.</p>
        </div>
      </form>

      {/* Items List */}
      <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-pink-50 p-2 rounded-lg border border-pink-100">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }}></div>
              <span className="font-semibold truncate text-sm text-custom-text">{item.label}</span>
              <span className="text-xs text-gray-500 bg-white px-2 py-0.5 rounded-full border">Peso: {item.weight}</span>
            </div>
            <button
              onClick={() => handleRemoveItem(item.id)}
              disabled={items.length <= 1 || disabled}
              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputPanel;