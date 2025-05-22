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
} from "@dojoengine/sdk/react";
import { addAddressPadding, CairoCustomEnum } from "starknet";
import { Events } from "./events.tsx";
import { useState, useCallback, useMemo, useEffect } from 'react';
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


    const { useDojoStore, client } = useDojoSDK();
    const { account, address } = useAccount();
    const entities = useDojoStore((state) => state.entities);

    const { spawn } = useSystemCalls();

    const entityId = useEntityId(account?.address ?? "0");

    useEntityQuery(
        new ToriiQueryBuilder()
            .withClause(
                // Querying Moves and Position models that has at least [account.address] as key
                KeysClause(
                    [ModelsMapping.Moves],
                    [
                        account?.address
                            ? addAddressPadding(account.address)
                            : undefined,
                    ],
                    "FixedLen"
                ).build()
            )
            .includeHashedKeys()
    );

    const moves = useModel(entityId, ModelsMapping.Moves);
    console.log("moves", moves);
    // const position = useModel(entityId as string, ModelsMapping.Position);

useEffect(() => {
    // console.log("Entity ID:", account?.address);
    // console.log("player Moves:", moves);
   
}, [moves, account,entities]);

    const createGame = useCallback(async () => {
        const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
        setGameState(prev => ({
          ...prev,
          gameId,
          isHost: true
        }));
        setView('symbol-select');
      }, []);
    
      const joinGame = useCallback(() => {
        if (!gameIdInput) return;
        setGameState(prev => ({
          ...prev,
          gameId: gameIdInput,
          isHost: false
        }));
        setView('symbol-select');
      }, [gameIdInput]);
    
      const selectSymbol = async (symbol: 'X' | 'O') => {
        if (symbol === 'X') {
          const spawnres =  await client.actions.initiate_game(account!, 1);
          console.log(account)
          console.log("Spawned entity for X:", spawnres);
          // {Object.entries(entities).map(
          //   ([entityId, entity]) => {
          //     const player_moves =
          //       entity.models.sanmoku.Moves;
          //       console.log("player_moves", player_moves);
          //       console.log("entity_id", entityId);
          //   }
          // )}
          console.log("entities", entities);
        }else {
          const spawnres =  await client.actions.initiate_game(account!, 2);
          console.log("Spawned entity for O:", spawnres);
        }
        // setGameState(prev => ({
        //   ...prev,
        //   playerSymbol: symbol,
        //   opponentConnected: true
        // }));
        // setView('game');
      };
    
      const makeMove = useCallback((index: number) => {
        if (
          gameState.gameOver ||
          gameState.board[index] ||
          gameState.currentPlayer !== gameState.playerSymbol
        ) return;
    
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
          [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
          [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
          [0, 4, 8], [2, 4, 6]             // diagonals
        ];
    
        for (const pattern of winPatterns) {
          const [a, b, c] = pattern;
          if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
          }
        }
        return null;
      }, []);
    
      const restartGame = useCallback(() => {
        setGameState(prev => ({
          ...prev,
          board: Array(9).fill(null),
          currentPlayer: 'X',
          winner: null,
          gameOver: false
        }));
      }, []);
    
      const returnToLobby = useCallback(() => {
        setView('lobby');
        setGameState(initialGameState);
        setGameIdInput('');
      }, []);
    
      const isMyTurn = useMemo(() => {
        return gameState.currentPlayer === gameState.playerSymbol && !gameState.gameOver;
      }, [gameState.currentPlayer, gameState.playerSymbol, gameState.gameOver]);
    
    useEffect(() => {
      console.log("address", address)
      console.log("account", account)
    },[address, account])
    return (
        <div className=" min-h-screen w-full p-4 sm:p-8">
            <div className="max-w-7xl mx-auto">
                <WalletAccount />
                <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Multiplayer Tic-Tac-Toe</h1>
      <Events />
      
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
      {view === 'symbol-select' && gameState.gameId && (
        <SymbolSelect 
          gameId={gameState.gameId} 
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

                {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            <div className="col-start-2">
                                <button
                                    className="h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200"
                                    onClick={async () => await spawn()}
                                >
                                    +
                                </button>
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                Moves Left:{" "}
                                {moves ? `${moves.remaining}` : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {position
                                    ? `x: ${position?.vec?.x}, y: ${position?.vec?.y}`
                                    : "Need to Spawn"}
                            </div>
                            <div className="col-span-3 text-center text-base text-white">
                                {moves && moves.last_direction.isSome()
                                    ? moves.last_direction.unwrap()
                                    : ""}
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-700 p-4 rounded-lg shadow-inner">
                        <div className="grid grid-cols-3 gap-2 w-full h-48">
                            {[
                                {
                                    direction: new CairoCustomEnum({
                                        Up: "()",
                                    }),
                                    label: "↑",
                                    col: "col-start-2",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Left: "()",
                                    }),
                                    label: "←",
                                    col: "col-start-1",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Right: "()",
                                    }),
                                    label: "→",
                                    col: "col-start-3",
                                },
                                {
                                    direction: new CairoCustomEnum({
                                        Down: "()",
                                    }),
                                    label: "↓",
                                    col: "col-start-2",
                                },
                            ].map(({ direction, label, col }, idx) => (
                                <button
                                    className={`${col} h-12 w-12 bg-gray-600 rounded-full shadow-md active:shadow-inner active:bg-gray-500 focus:outline-none text-2xl font-bold text-gray-200`}
                                    key={idx}
                                    onClick={async () => {
                                        await client.actions.move(
                                            account!,
                                            direction
                                        );
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-700">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="border border-gray-700 p-2">
                                    Entity ID
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Player
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position X
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Position Y
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Can Move
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Last Direction
                                </th>
                                <th className="border border-gray-700 p-2">
                                    Remaining Moves
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(entities).map(
                                ([entityId, entity]) => {
                                    const position =
                                        entity.models.dojo_starter.Position;
                                    const moves =
                                        entity.models.dojo_starter.Moves;
                                    const lastDirection =
                                        moves?.last_direction?.isSome()
                                            ? moves.last_direction?.unwrap()
                                            : "N/A";

                                    return (
                                        <tr
                                            key={entityId}
                                            className="text-gray-300"
                                        >
                                            <td className="border border-gray-700 p-2">
                                                {addAddressPadding(entityId)}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.player ?? "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.x.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {position?.vec?.y.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.can_move?.toString() ??
                                                    "N/A"}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {lastDirection}
                                            </td>
                                            <td className="border border-gray-700 p-2">
                                                {moves?.remaining?.toString() ??
                                                    "N/A"}
                                            </td>
                                        </tr>
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                <Events />
                
                <HistoricalEvents /> */}
            </div>
        </div>
    );
}

export default App;
