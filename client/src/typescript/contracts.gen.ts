import type { DojoProvider, DojoCall } from "@dojoengine/core";
import type { Account, AccountInterface, CairoCustomEnum } from "starknet";

export function setupWorld(provider: DojoProvider) {
    const build_actions_initiate_game_calldata = (
        avatar: number
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "initiate_game",
            calldata: [avatar],
        };
    };  

    const actions_initiate_game = async (
        snAccount: Account | AccountInterface,
        avatar: number
    ) => {
        try {
            return await provider.execute(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                snAccount as any, // Type cast to avoid version mismatch
                build_actions_initiate_game_calldata(avatar),
                "sanmoku"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };
    
    const build_actions_join_game_calldata = (
        gameid: number
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "join_game",
            calldata: [gameid],
        };
    };  

    const actions_join_game = async (
        snAccount: Account | AccountInterface,
        gameid: number
    ) => {
        try {
            return await provider.execute(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                snAccount as any, // Type cast to avoid version mismatch
                build_actions_join_game_calldata(gameid),
                "sanmoku"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const build_actions_play_game_calldata = (
        gameid: number,
        square: CairoCustomEnum
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "play_game",
            calldata: [gameid, square],
        };
    };  

    const actions_play_game = async (
        snAccount: Account | AccountInterface,
        gameid: number,
        square: CairoCustomEnum
    ) => {
        try {
            return await provider.execute(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                snAccount as any, // Type cast to avoid version mismatch
                build_actions_play_game_calldata(gameid, square),
                "sanmoku"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const build_actions_restart_game_calldata = (
        gameid: number,
    ): DojoCall => {
        return {
            contractName: "actions",
            entrypoint: "play_game",
            calldata: [gameid],
        };
    };  

    const actions_restart_game = async (
        snAccount: Account | AccountInterface,
        gameid: number,
    ) => {
        try {
            return await provider.execute(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                snAccount as any, // Type cast to avoid version mismatch
                build_actions_restart_game_calldata(gameid),
                "sanmoku"
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    
    
    
    
    
    
    
    // const build_actions_move_calldata = (
    //     direction: CairoCustomEnum
    // ): DojoCall => {
    //     return {
    //         contractName: "actions",
    //         entrypoint: "move",
    //         calldata: [direction],
    //     };
    // };

    // const actions_move = async (
    //     snAccount: Account | AccountInterface,
    //     direction: CairoCustomEnum
    // ) => {
    //     try {
    //         return await provider.execute(
    //             snAccount as any, // Type cast to avoid version mismatch
    //             build_actions_move_calldata(direction),
    //             "dojo_starter"
    //         );
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // };

    // const build_actions_spawn_calldata = (): DojoCall => {
    //     return {
    //         contractName: "actions",
    //         entrypoint: "spawn",
    //         calldata: [],
    //     };
    // };

    // const actions_spawn = async (snAccount: Account | AccountInterface) => {
    //     try {
    //         return await provider.execute(
    //             snAccount as any,
    //             build_actions_spawn_calldata(),
    //             "dojo_starter"
    //         );
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // };

    return {
        actions: {
            initiate_game: actions_initiate_game,
            buildInitiateCalldata: build_actions_initiate_game_calldata,
            
            join_game: actions_join_game,
            buildJoinCalldata: build_actions_join_game_calldata,

            play_game: actions_play_game,
            buildPlayCalldata: build_actions_play_game_calldata,
            
            restart_game: actions_restart_game,
            buildRestartCalldata: build_actions_restart_game_calldata,
        },
    };
}
