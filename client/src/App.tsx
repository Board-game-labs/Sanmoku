/* eslint-disable @typescript-eslint/ban-ts-comment */
import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";

import { ModelsMapping } from "./typescript/models.gen.ts";
import { useSystemCalls } from "./useSystemCalls.ts";
import { useAccount } from "@starknet-react/core";
import { WalletAccount } from "./wallet-account.tsx";
import { HistoricalEvents } from "./historical-events.tsx";
import {
    useDojoSDK,
    useEntityId,
    useEntityQuery,
    useModel,
    useEventQuery
} from "@dojoengine/sdk/react";
import { addAddressPadding, CairoCustomEnum } from "starknet";
import { Events } from "./events.tsx";
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { GameState, GameView } from './types';
import { Lobby } from './components/Lobby';
import { SymbolSelect } from './components/SymbolSelect';
import { GameBoard } from './components/GameBoard';
import { GameStatus } from './components/GameStatus';

/**
 * Main application component that provides game functionality and UI.
 * Handles entity subscriptions, state management, and user interactions.
 *
 * @param props.sdk - The Dojo SDK instance configured with the game schema
 */

const initialGameState: GameState = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
    gameOver: false,
    playerSymbol: null,
    gameId: null,
    isHost: false,
    opponentConnected: false
  };

function App() {
    const [view, setView] = useState<GameView>('lobby');
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    const [gameIdInput, setGameIdInput] = useState('');
    const [opponent, setOpponentData] = useState('');


    const { useDojoStore, client } = useDojoSDK();
    const { account, address } = useAccount();
    const entities = useDojoStore((state) => state.entities);

    const { spawn } = useSystemCalls();

    const testID = (gameState.gameId ? Number(gameState.gameId) : 0);
    const entityId = useEntityId(account?.address ?? "0");
    const entityIdboard = useEntityId(testID);
    const gameIdRef = useRef<string | null>(null);

    useEntityQuery(
        new ToriiQueryBuilder()
            .withClause(
                // Querying Moves and Position models that has at least [account.address] as key
                KeysClause(
                    [ModelsMapping.Moves],
                    [
                        account?.address
                            ?? "0",
                    ],
                    "VariableLen"
                ).build()
            )
            .includeHashedKeys()
    );
    useEventQuery(
      new ToriiQueryBuilder()
      .withClause(
          KeysClause(
              [ModelsMapping.Moves],
              [addAddressPadding(account?.address ?? "0")],
              // [],
              "VariableLen"
          ).build()
      )
      .includeHashedKeys()
  );

  useEventQuery(
    new ToriiQueryBuilder()
    .withClause(
        KeysClause(
            [ModelsMapping.Board],           
            [testID.toString()],
            // [],
            "VariableLen"
        ).build()
    )
    .includeHashedKeys()
);


  const initiated = useModel(entityId, ModelsMapping.Gameinitiated);
  const board_stat = useModel(entityIdboard, ModelsMapping.Board);

    const moves = useModel(entityId, ModelsMapping.Moves);

    useEffect(() => {
      gameIdRef.current = gameState.gameId;
    }, [gameState.gameId]);

    useEffect(() => {
      if (moves) {
        console.log("moves done", moves);
        // console.log("current board state", board_stat);
    
        const avatar = hexToAscii(moves.avatar_choice);
        
        // Initialize a fresh board
        const newBoard = Array(9).fill(null);
        
        // Process player's moves (move_one to move_five)
        const playerMoves = [
          moves.move_one,
          moves.move_two,
          moves.move_three,
          moves.move_four,
          moves.move_five
        ];
        
        // Process opponent's moves (opp_move_one to opp_move_five)
        const opponentMoves = [
          moves.opp_move_one,
          moves.opp_move_two,
          moves.opp_move_three,
          moves.opp_move_four,
          moves.opp_move_five
        ];
        
        // Determine player and opponent symbols
        const playerSymbol = avatar === 'X' || avatar === 'O' ? avatar : null;
        const opponentSymbol = playerSymbol === 'X' ? 'O' : 'X';
        
        // Apply player moves to the board
        playerMoves.forEach(move => {
          if (move !== 404 && move >= 0 && move < 9) {
            newBoard[move] = playerSymbol;
          }
        });
        
        // Apply opponent moves to the board
        opponentMoves.forEach(move => {
          if (move !== 404 && move >= 0 && move < 9) {
            newBoard[move] = opponentSymbol;
          }
        });
        
        // Check for winner
        const winner = checkWinner(newBoard);
        const gameOver = !!winner || !newBoard.includes(null);
        
        // Update game state
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          playerSymbol,
          currentPlayer: moves.turn ? playerSymbol : opponentSymbol,
          winner: winner || prev.winner,
          gameOver,
          gameId: moves.game_id ? String(hexToDecimal(moves.game_id)) : "",
        }));  
        
        setOpponentData(moves.opponent);
      }
    }, [moves]);

    useEffect(()=>{
      if(board_stat){
        console.log("current board state", board_stat);
      }
    },[board_stat]);

    // console.log("checking", moves);
  
    function hexToDecimal(hexStr: string): number {
      // Remove the '0x' prefix if present
      if (hexStr.startsWith('0x')) {
          hexStr = hexStr.substring(2);
      }    
      // Convert to decimal (BigInt handles very large numbers)
      return parseInt(hexStr, 16);
  }

  function hexToAscii(hex : string) {
    // Remove the leading 0x if present
    const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  
    // Convert to integer
    const decimal = parseInt(cleanHex, 16);
  
    // Convert to ASCII character
    return String.fromCharCode(decimal);
  }
    const createGame = useCallback(async () => {
        // const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();

        setView('symbol-select');
      }, []);
    
      const joinGame = useCallback(async () => {
        if (!gameIdInput) return;
       try {
        const joinres = await client.actions.join_game(account!, gameIdInput);
        console.log("join game res", joinres)
        setGameState(prev => ({
          ...prev,
          gameId: gameIdInput,
          isHost: false
        }));
        setView('game');

       } catch (error) {
        console.log("Error joining game", error)
       }
      }, [gameIdInput]);

      const selectSymbol = useCallback(async (symbol: 'X' | 'O') => {
        try {
          const playerNumber = symbol === 'X' ? 1 : 2;
          
          const spawnres = await client.actions.initiate_game(account!, playerNumber);
          console.log(`Spawned entity for ${symbol}:`, spawnres);
      
          // console.log("Game initiated:", initiated);
            setGameState(prev => ({
              ...prev,
              playerSymbol: symbol,
              isHost: true,
            }));      
            setView('game');
          
        } catch (error) {
          console.error("Failed to initiate game:", error);
        }
      }, [account, client.actions, initiated, moves]);




      const makeMove = useCallback(async (index: number) => {
        if (
          gameState.gameOver ||
          gameState.board[index] ||
          gameState.currentPlayer !== gameState.playerSymbol
        ) return;

        const calldata = [index.toString()]; 

        const squareVariants = [
          {
            square: new CairoCustomEnum({
              Top_Left: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Tops: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Top_Right: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Left: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Centre: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Right: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Bottom_Left: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Bottom: "()",
            }),
          },
          {
            square: new CairoCustomEnum({
              Bottom_Right: "()",
            }),
          },
        ];
        
        const selectedIndex = parseInt(calldata[0]);
        if (selectedIndex >= 0 && selectedIndex < squareVariants.length) {
          const selectedSquare = squareVariants[selectedIndex];
          console.log("Selected square:", selectedSquare);
          
          // Use the selected square in your gameplay
          const gameplayres = await client.actions.play_game(account!, gameState.gameId, selectedSquare.square);
          console.log(`Spawned entity:`, gameplayres);
        } else {
          console.error("Invalid calldata index:", calldata[0]);
        }

        const newBoard = [...gameState.board];
        newBoard[index] = gameState.currentPlayer;
        
        const winner = checkWinner(newBoard);
        const gameOver = !!winner || !newBoard.includes(null);
        
        setGameState(prev => ({
          ...prev,
          board: newBoard,
          winner: winner || prev.winner,
          gameOver,
          currentPlayer: prev.currentPlayer === 'X' ? 'O' : 'X'
        }));
      }, [gameState]);
    
      const checkWinner = useCallback((board: (string | null)[]): string | null => {
        const winPatterns = [
          [0, 1, 2], [3, 4, 5], [6, 7, 8],
          [0, 3, 6], [1, 4, 7], [2, 5, 8], 
          [0, 4, 8], [2, 4, 6]            
        ];
    
        for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
          }
        }
        return null;
      }, []);
    
      const restartGame = useCallback(async () => {
        const isDraw = gameState.board.every(cell => cell !== null);
      const canRestart = gameState.winner !== null || isDraw;
    
        if (!canRestart) {
          alert("Cannot restart - game is still in progress")
            console.log("Cannot restart - game is still in progress");
            return;
        }

        if (!gameState.gameId) {
            console.error("Game ID is not set yet");
            return;
        }
        if (!gameState.gameId) {
          console.error("Game ID is not set yet");
          return;
        }
        console.log(gameState.gameId)
        try {
          const restartres = await client.actions.restart_game(account!, gameState.gameId);
          console.log(restartres)
          if(restartres){
            setGameState(prev => ({
              ...prev,
              board: Array(9).fill(null),
              currentPlayer: 'X',
              winner: null,
              gameOver: false
            }));
          }
          
        } catch (error) {
          console.log(error)
        }
      }, [gameState.gameId, account, client.actions]);
    
      const returnToLobby = useCallback(() => {
        setView('lobby');
        setGameState(initialGameState);
        setGameIdInput('');
      }, []);
    
      const isMyTurn = useMemo(() => {
        return gameState.currentPlayer === gameState.playerSymbol && !gameState.gameOver;
      }, [gameState.currentPlayer, gameState.playerSymbol, gameState.gameOver]);
    
    return (
        <div className=" min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <WalletAccount />
                <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      {/* <h1 className="text-3xl font-bold text-gray-800 mb-8">Multiplayer Tic-Tac-Toe</h1> */}
      {/* <Events /> */}
      
      {/* Lobby View */}
      {view === 'lobby' && (
        <Lobby 
          setView={setView} 
          gameIdInput={gameIdInput} 
          setGameIdInput={setGameIdInput} 
          createGame={createGame}
          joinGame={joinGame}
        />
      )}
      
      {/* Symbol Selection View */}
      {view === 'symbol-select' && (
        <SymbolSelect 
          gameId={gameState.gameId ?? 'no game id'} 
          setView={setView} 
          selectSymbol={selectSymbol} 
        />
      )}
      
      {/* Game View */}
      {view === 'game' && (
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6 mb-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="font-medium">Game ID:</span>
                <span className="ml-2 font-mono">{gameState.gameId}</span>
              </div>
              <div>
                <span className="font-medium">You are:</span>
                <span 
                  className={`ml-2 text-2xl font-bold ${
                    gameState.playerSymbol === 'X' ? 'text-blue-500' : 'text-red-500'
                  }`}
                >
                  {gameState.playerSymbol}
                </span>
              </div>
            </div>
            
            <GameStatus gameState={gameState} isMyTurn={isMyTurn} />
            
            <GameBoard 
              gameState={gameState} 
              makeMove={makeMove} 
              isMyTurn={isMyTurn} 
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={restartGame}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition"
            >
              Restart Game
            </button>
            <button
              onClick={returnToLobby}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Leave Game
            </button>
          </div>
        </div>
      )}
    </div>
            </div>
        </div>
    );
}

export default App;
