import { init, KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useEntityId, useEventQuery, useModel } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { ModelsMapping } from "./typescript/models.gen";
import { useEffect, useState } from "react";
import { hexToDecimal } from "./helper";
import { GameState } from "./types";

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

export function Events() {
    const { account } = useAccount();
    const [gameState, setGameState] = useState<GameState>(initialGameState);
    
    const entityId = useEntityId("0x00000000000000000000000000000000000000000000000000000000000001e0"
    );
    
    // useEffect(() => { 
    //     if (initiated) {
    //         console.log("gameintiatedevent", initiated);
    //     }
    // }, [initiated]);
    
    useEventQuery(
        new ToriiQueryBuilder()
        .withClause(
            KeysClause(
                [],
                ["480"
                ],
                // [],
                "VariableLen"
            ).build()
        )
        .includeHashedKeys()
    );

    const initiated = useModel(entityId, ModelsMapping.Board);
    console.log("int", initiated)
 
    if (!account) {
        return (
            <div className="mt-6">
                <h2 className="text-white">Please connect your wallet</h2>
            </div>
        );
    }

    // console.log("game initiated", initiated);
    
    
    function hexToDecimal(hexStr: string): number {
        // Remove the '0x' prefix if present
        if (hexStr.startsWith('0x')) {
            hexStr = hexStr.substring(2);
        }
        const gameId = parseInt(hexStr, 16);
        setGameState(prev => ({
            ...prev,
            gameId: gameId.toString(),
            isHost: true
          }));
        // Convert to decimal (BigInt handles very large numbers)
        return parseInt(hexStr, 16);
    }


    return (
        <div className="mt-6">
            {/* <h2 className="text-black">
                game id :{initiated &&  hexToDecimal(initiated.gameid)}{" "}
            </h2> */}

            {/* {events.map((e: ParsedEntity<SchemaType>, key) => {
                return <Event event={e} key={key} />;
            })} */}
        </div>
    );
}
