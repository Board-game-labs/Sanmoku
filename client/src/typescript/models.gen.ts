import type { SchemaType as ISchemaType } from "@dojoengine/sdk";
import {
    CairoCustomEnum,
    CairoOption,
    CairoOptionVariant,
    BigNumberish,
} from "starknet";

type WithFieldOrder<T> = T & { fieldOrder: string[] };

// Type definition for `Moves` struct
export interface Moves {
    player: string;
    opponent: string;
    game_id: BigNumberish;
    avatar_choice: BigNumberish;
    move_one: BigNumberish;
    move_two: BigNumberish;
    move_three: BigNumberish;
    move_four: BigNumberish;
    move_five: BigNumberish;
    counter: BigNumberish;
    turn: boolean;
    opp_move_one: BigNumberish;
    opp_move_two: BigNumberish;
    opp_move_three: BigNumberish;
    opp_move_four: BigNumberish;
    opp_move_five: BigNumberish;
}

// Type definition for `MovesValue` struct
export interface MovesValue {
    opponent: string;
    game_id: BigNumberish;
    avatar_choice: BigNumberish;
    move_one: BigNumberish;
    move_two: BigNumberish;
    move_three: BigNumberish;
    move_four: BigNumberish;
    move_five: BigNumberish;
    counter: BigNumberish;
    turn: boolean;
    opp_move_one: BigNumberish;
    opp_move_two: BigNumberish;
    opp_move_three: BigNumberish;
    opp_move_four: BigNumberish;
    opp_move_five: BigNumberish;
}

// Type definition for `Board` struct
export interface Board {
    game_id: BigNumberish;
    a_1: BigNumberish;
    a_2: BigNumberish;
    a_3: BigNumberish;
    b_1: BigNumberish;
    b_2: BigNumberish;
    b_3: BigNumberish;
    c_1: BigNumberish;
    c_2: BigNumberish;
    c_3: BigNumberish;
}
export interface BoardValue {
    a_1: BigNumberish;
    a_2: BigNumberish;
    a_3: BigNumberish;
    b_1: BigNumberish;
    b_2: BigNumberish;
    b_3: BigNumberish;
    c_1: BigNumberish;
    c_2: BigNumberish;
    c_3: BigNumberish;
}

// Type definition for `Game` struct
export interface Game {
    game_id: BigNumberish;
    winner: string;
    player_one_: string;
    player_two_: string;
}

// Type definition for `GameValue` struct
export interface GameValue {
    winner: string;
    player_one_: string;
    player_two_: string;
}

// Type definition for `Fixed` struct
export interface Fixed {
    fixed_key: string;
    gameid: BigNumberish;
}

// Type definition for `FixedValue` struct
export interface FixedValue {
    gameid: BigNumberish;
}

// Type definition for `Response` struct
export interface Response {
    game_id: BigNumberish;
    gameresponse: BigNumberish;
}

// Type definition for `ResponseValue` struct
export interface ResponseValue {
    gameresponse: BigNumberish;
}

// Type definition for `Gate` struct
export interface Gate {
    constantkey: string;
    owner: string;
    token_address: string;
}

// Type definition for `GateValue` struct
export interface GateValue {
    owner: string;
    token_address: string;
}

// Type definition for `Players` struct
export interface Players {
    player_address: string;
    name_: BigNumberish;
}

// Type definition for `PlayersValue` struct
export interface PlayersValue {
    name_: BigNumberish;
}

// Type definition for `Square` enum
export type Square = {
    Top_Left: string;
    Tops: string;
    Top_Right: string;
    Left: string;
    Centre: string;
    Right: string;
    Bottom_Left: string;
    Bottom: string;
    Bottom_Right: string;
};
export type SquareEnum = CairoCustomEnum;

// Type definition for `Players_tuple` enum
export type Players_tuple = {
    details: [BigNumberish, string, BigNumberish];
};
export type Players_tupleEnum = CairoCustomEnum;

// Type definition for `Winning_tuple` enum
export type Winning_tuple = {
    winning_moves: [BigNumberish, BigNumberish, BigNumberish];
};
export type Winning_tupleEnum = CairoCustomEnum;

export interface SchemaType extends ISchemaType {
    sanmoku: {
        Moves: WithFieldOrder<Moves>;
        MovesValue: WithFieldOrder<MovesValue>;
        Board: WithFieldOrder<Board>;
        BoardValue: WithFieldOrder<BoardValue>;
        Game: WithFieldOrder<Game>;
        GameValue: WithFieldOrder<GameValue>;
        Fixed: WithFieldOrder<Fixed>;
        FixedValue: WithFieldOrder<FixedValue>;
        Response: WithFieldOrder<Response>;
        ResponseValue: WithFieldOrder<ResponseValue>;
        Gate: WithFieldOrder<Gate>;
        GateValue: WithFieldOrder<GateValue>;
        Players: WithFieldOrder<Players>;
        PlayersValue: WithFieldOrder<PlayersValue>;
        Square: WithFieldOrder<Square>;
        Players_tuple: WithFieldOrder<Players_tuple>;
        Winning_tuple: WithFieldOrder<Winning_tuple>;
        Spawn: WithFieldOrder<Spawn>;
        SpawnValue: WithFieldOrder<SpawnValue>;
        Result: WithFieldOrder<Result>;
        ResultValue: WithFieldOrder<ResultValue>;
        Gameinitiated: WithFieldOrder<Gameinitiated>;
        GameinitiatedValue: WithFieldOrder<GameinitiatedValue>;
        Restarted: WithFieldOrder<Restarted>;
        RestartedValue: WithFieldOrder<RestartedValue>;

    };
}
// Type definition for `sanmoku::systems::actions::actions::Spawn` struct
export interface Spawn {
    game_id: BigNumberish;
    player_1: string;
    player_2: string;
}

// Type definition for `sanmoku::systems::actions::actions::SpawnValue` struct
export interface SpawnValue {
    player_1: string;
    player_2: string;
}

// Type definition for `sanmoku::systems::actions::actions::Spawn` struct
export interface Result {
    game_id: BigNumberish;
    result: BigNumberish;
    winneraddress: string;
}

// Type definition for `sanmoku::systems::actions::actions::SpawnValue` struct
export interface ResultValue {
    result: BigNumberish;
    winneraddress: string;
}

export interface Gameinitiated {
    playeraddress: string;
    gameid: BigNumberish;
}

// Type definition for `sanmoku::systems::actions::actions::SpawnValue` struct
export interface GameinitiatedValue {
    gameid: BigNumberish;
}

export interface Restarted {
    gameid: BigNumberish;
    player_1: string;
    player_2: string;
}

// Type definition for `sanmoku::systems::actions::actions::SpawnValue` struct
export interface RestartedValue {
    player_1: string;
    player_2: string;
}


export const schema: SchemaType = {
    sanmoku: {
        Moves: {
            fieldOrder: ["player", "opponent", "game_id", "avatar_choice", "move_one", "move_two", "move_three", "move_four", "move_five", "counter", "turn", "opp_move_one", "opp_move_two", "opp_move_three", "opp_move_four", "opp_move_five"],
            player: "",
            opponent: "",
            game_id: 0,
            avatar_choice: 0,
            move_one: 0,
            move_two: 0,
            move_three: 0,
            move_four: 0,
            move_five: 0,
            counter: 0,
            turn: false,
            opp_move_one: 0,
            opp_move_two: 0,
            opp_move_three: 0,
            opp_move_four: 0,
            opp_move_five: 0,
        },
        MovesValue: {
            fieldOrder: ["opponent", "game_id", "avatar_choice", "move_one", "move_two", "move_three", "move_four", "move_five", "counter", "turn", "opp_move_one", "opp_move_two", "opp_move_three", "opp_move_four", "opp_move_five"],
            opponent: "",
            game_id: 0,
            avatar_choice: 0,
            move_one: 0,
            move_two: 0,
            move_three: 0,
            move_four: 0,
            move_five: 0,
            counter: 0,
            turn: false,
            opp_move_one: 0,
            opp_move_two: 0,
            opp_move_three: 0,
            opp_move_four: 0,
            opp_move_five: 0,
        },
        Board: {
            fieldOrder: ["game_id", "a_1", "a_2", "a_3", "b_1", "b_2", "b_3", "c_1", "c_2", "c_3"],
            game_id: "0",
            a_1: "0",
            a_2: "0",
            a_3: "0",
            b_1: "0",
            b_2: "0",
            b_3: "0",
            c_1: "0",
            c_2: "0",
            c_3: "0",
        },
        BoardValue: {
            fieldOrder: ["a_1", "a_2", "a_3", "b_1", "b_2", "b_3", "c_1", "c_2", "c_3"],
            a_1: "0",
            a_2: "0",
            a_3: "0",
            b_1: "0",
            b_2: "0",
            b_3: "0",
            c_1: "0",
            c_2: "0",
            c_3: "0",
        },
        Game: {
            fieldOrder: ["game_id", "winner", "player_one_", "player_two_"],
            game_id: "0",
            winner: "",
            player_one_: "",
            player_two_: "",
        },
        GameValue: {
            fieldOrder: ["winner", "player_one_", "player_two_"],
            winner: "",
            player_one_: "",
            player_two_: "",
        },
        Fixed: {
            fieldOrder: ["fixed_key", "gameid"],
            fixed_key: "",
            gameid: "0",
        },
        FixedValue: {
            fieldOrder: ["gameid"],
            gameid: "0",
        },
        Response: {
            fieldOrder: ["game_id", "gameresponse"],
            game_id: "0",
            gameresponse: "0",
        },
        ResponseValue: {
            fieldOrder: ["gameresponse"],
            gameresponse: "0",
        },
        Gate: {
            fieldOrder: ["constantkey", "owner", "token_address"],
            constantkey: "",
            owner: "",
            token_address: "",
        },
        GateValue: {
            fieldOrder: ["owner", "token_address"],
            owner: "",
            token_address: "",
        },
        Players: {
            fieldOrder: ["player_address", "name_"],
            player_address: "",
            name_: "0",
        },
        PlayersValue: {
            fieldOrder: ["name_"],
            name_: "0",
        },
        Square: {
            fieldOrder: ["Top_Left", "Tops", "Top_Right", "Left", "Centre", "Right", "Bottom_Left", "Bottom", "Bottom_Right"],
            Top_Left: "",
            Tops: "",
            Top_Right: "",
            Left: "",
            Centre: "",
            Right: "",
            Bottom_Left: "",
            Bottom: "",
            Bottom_Right: "",
        },
        Players_tuple: {
            fieldOrder: ["details"],
            details: ["0", "", "0"],
        },
        Winning_tuple: {
            fieldOrder: ["winning_moves"],
            winning_moves: ["0", "0", "0"],
        },
        Spawn: {
            fieldOrder: ["game_id", "player_1", "player_2"],
            game_id: "0",
            player_1: "",
            player_2: "",
        },
        SpawnValue: {
            fieldOrder: ["player_1", "player_2"],
            player_1: "",
            player_2: "",
        },
        Result: {
            fieldOrder: ["game_id", "result", "winneraddress"],
            game_id: "0",
            result: "0",
            winneraddress: "",
        },
        ResultValue: {
            fieldOrder: ["result", "winneraddress"],
            result: "0",
            winneraddress: "",
        },
        Gameinitiated: {
            fieldOrder: ["playeraddress", "gameid"],
            playeraddress: "",
            gameid: "0",
        },
        GameinitiatedValue: {
            fieldOrder: ["gameid"],
            gameid: "0",
        },
        Restarted: {
            fieldOrder: ["gameid", "player_1", "player_2"],
            gameid: "0",
            player_1: "",
            player_2: "",
        },
        RestartedValue: {
            fieldOrder: ["player_1", "player_2"],
            player_1: "",
            player_2: "",
        },
    },
};

export enum ModelsMapping {
    Moves = "sanmoku-Moves",
    MovesValue = "sanmoku-MovesValue",
    Board = "sanmoku-Board",
    BoardValue = "sanmoku-BoardValue",
    Game = "sanmoku-Game",
    GameValue = "sanmoku-GameValue",
    Fixed = "sanmoku-Fixed",
    FixedValue = "sanmoku-FixedValue",
    Response = "sanmoku-Response",
    ResponseValue = "sanmoku-ResponseValue",
    Gate = "sanmoku-Gate",
    GateValue = "sanmoku-GateValue",
    Players = "sanmoku-Players",
    PlayersValue = "sanmoku-PlayersValue",
    Square = "sanmoku-Square",
    Players_tuple = "sanmoku-Players_tuple",
    Winning_tuple = "sanmoku-Winning_tuple",
    Spawn = "sanmoku-Spawn",
    SpawnValue = "sanmoku-SpawnValue",
    Result = "sanmoku-Result",
    ResultValue = "sanmoku-ResultValue",
    Gameinitiated = "sanmoku-Gameinitiated",
    GameinitiatedValue = "sanmoku-GameinitiatedValue",
    Restarted = "sanmoku-Restarted",
    RestartedValue = "sanmoku-RestartedValue",
}