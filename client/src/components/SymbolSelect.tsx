import { GameView } from '../types';

interface SymbolSelectProps {
  gameId: string;
  setView: (view: GameView) => void;
  selectSymbol: (symbol: 'X' | 'O') => void;
}

export const SymbolSelect = ({ gameId, setView, selectSymbol }: SymbolSelectProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-2 text-center">Game ID: {gameId}</h2>
      <p className="text-center text-gray-600 mb-6">Share this ID with your friend</p>
      
      <h3 className="text-lg font-medium mb-4 text-center">Choose your symbol</h3>
      
      <div className="flex justify-center space-x-6">
        <button
          onClick={() => selectSymbol('X')}
          className="w-20 h-20 flex items-center justify-center text-4xl font-bold bg-blue-100 hover:bg-blue-200 rounded-lg transition"
        >
          X
        </button>
        <button
          onClick={() => selectSymbol('O')}
          className="w-20 h-20 flex items-center justify-center text-4xl font-bold bg-red-100 hover:bg-red-200 rounded-lg transition"
        >
          O
        </button>
      </div>
    </div>
  );
};