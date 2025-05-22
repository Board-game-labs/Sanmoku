import { GameView } from '../types';

interface LobbyProps {
  setView: (view: GameView) => void;
  gameIdInput: string;
  setGameIdInput: (id: string) => void;
  createGame: () => void;
  joinGame: () => void;
}

export const Lobby = ({ setView, gameIdInput, setGameIdInput, createGame, joinGame }: LobbyProps) => {
    return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
      <h2 className="text-xl font-semibold mb-6 text-center">Game Lobby</h2>
      
      <div className="space-y-4">
        <button 
          onClick={() => {setView('symbol-select'); createGame()}}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition"
        >
          Create New Game
        </button>
        
        <div className="flex items-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="px-4 text-gray-500">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        
        <div className="space-y-2">
          <input
            value={gameIdInput}
            onChange={(e) => setGameIdInput(e.target.value)}
            placeholder="Enter Game ID"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button 
            onClick={() => {setView('symbol-select'); joinGame()}}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            Join Game
          </button>
        </div>
      </div>
    </div>
  );
};