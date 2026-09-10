export interface WheelItem {
  id: string;
  label: string;
  weight: number;
  color: string;
}

export interface WheelState {
  rotation: number;
  isSpinning: boolean;
  winner: WheelItem | null;
}
