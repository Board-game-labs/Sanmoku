import { GameState } from '../types';

interface GameStatusProps {
  gameState: GameState;
  isMyTurn: boolean;
}

export const GameStatus = ({ gameState, isMyTurn }: GameStatusProps) => {
  const getStatusMessage = () => {
    if (gameState.winner) return `Winner: ${gameState.winner}`;
    if (gameState.gameOver) return "It's a draw!";
    return `Current player: ${gameState.currentPlayer}`;
  };

  const statusColor = () => {
    if (gameState.winner) return 'text-green-600';
    if (gameState.gameOver) return 'text-gray-600';
    return gameState.currentPlayer === 'X' ? 'text-blue-500' : 'text-red-500';
  };

  return (
    <div className="text-center mb-4">
      <p className={`text-lg font-medium ${statusColor()}`}>
        {getStatusMessage()}
      </p>
      {!gameState.gameOver && (
        <p className="text-sm text-gray-500 mt-1">
          {isMyTurn ? 'Your turn!' : 'Waiting for opponent...'}
        </p>
      )}
    </div>
  );
};