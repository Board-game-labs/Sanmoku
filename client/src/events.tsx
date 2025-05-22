import { KeysClause, ToriiQueryBuilder } from "@dojoengine/sdk";
import { useEntityId, useEventQuery, useModel } from "@dojoengine/sdk/react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { ModelsMapping } from "./typescript/models.gen";
import { useEffect } from "react";

export function Events() {
    const { account } = useAccount();
    const entityId = useEntityId(account?.address ?? "0");
    const player_moves = useModel(entityId, ModelsMapping.Moves);
    
    useEffect(() => { 
        if (player_moves) {
            console.log("gameintiatedevent", player_moves);
        }
    }, [player_moves]);

    useEventQuery(
        new ToriiQueryBuilder()
            .withClause(
                KeysClause(
                    [],
                    [addAddressPadding(account?.address ?? "0")],
                    "VariableLen"
                ).build()
            )
            .includeHashedKeys()
    );
    if (!account) {
        return (
            <div className="mt-6">
                <h2 className="text-white">Please connect your wallet</h2>
            </div>
        );
    }
    console.log("player moves event", player_moves);

    return (
        <div className="mt-6">
            <h2 className="text-black">
                last game id from player : {player_moves && player_moves.game_id}{" "}
            </h2>

            {/* {events.map((e: ParsedEntity<SchemaType>, key) => {
                return <Event event={e} key={key} />;
            })} */}
        </div>
    );
}
