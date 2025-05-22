import { GameState } from '../types';

interface GameBoardProps {
  gameState: GameState;
  makeMove: (index: number) => void;
  isMyTurn: boolean;
}

export const GameBoard = ({ gameState, makeMove, isMyTurn }: GameBoardProps) => {
  return (
    <div className="grid grid-cols-3 gap-3 mx-auto w-64 h-64">
      {gameState.board.map((cell, index) => (
        <button
          key={index}
          onClick={() => makeMove(index)}
          disabled={!isMyTurn || !!cell}
          className={`flex items-center justify-center text-4xl font-bold h-full w-full border-2 rounded-lg transition
            ${cell === 'X' ? 'border-blue-300 text-blue-500' : ''}
            ${cell === 'O' ? 'border-red-300 text-red-500' : ''}
            ${!cell && isMyTurn ? 'border-gray-200 hover:bg-gray-50' : ''}
            ${!cell && !isMyTurn ? 'border-gray-100 bg-gray-50' : ''}
            ${cell || !isMyTurn ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {cell}
        </button>
      ))}
    </div>
  );
};