export interface GameState {
    board: (string | null)[];
    currentPlayer: 'X' | 'O';
    winner: string | null;
    gameOver: boolean;
    playerSymbol: 'X' | 'O' | null;
    gameId: string | null;
    isHost: boolean;
    opponentConnected: boolean;
  }
  
  export type GameView = 'lobby' | 'symbol-select' | 'game';