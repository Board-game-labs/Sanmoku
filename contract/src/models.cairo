use starknet::{ContractAddress};

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Moves {
    #[key]
    pub player: ContractAddress,
    pub opponent: ContractAddress,
    pub game_id: felt252,
    pub avatar_choice: felt252,
    pub move_one: u32,
    pub move_two: u32,
    pub move_three: u32,
    pub move_four: u32,
    pub move_five: u32,
    pub counter: u32,
    pub turn : bool,
    pub opp_move_one: u32,
    pub opp_move_two: u32,
    pub opp_move_three: u32,
    pub opp_move_four: u32,
    pub opp_move_five: u32,
}

#[derive(Drop, Serde, Debug)]
#[dojo::model]
pub struct Board {
    #[key]
    pub game_id: felt252,
    pub a_1: felt252,
    pub a_2: felt252,
    pub a_3: felt252,
    pub b_1: felt252,
    pub b_2: felt252,
    pub b_3: felt252,
    pub c_1: felt252,
    pub c_2: felt252,
    pub c_3: felt252,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Game {
    #[key]
    pub game_id: felt252,
    pub winner: ContractAddress,
    pub player_one_: ContractAddress,
    pub player_two_: ContractAddress
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Fixed {
    #[key]
    pub fixed_key : ContractAddress,
    pub gameid : felt252
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Response {
    #[key]
    pub game_id: felt252,
    pub gameresponse : felt252,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Gate {
    #[key]
    pub constantkey: ContractAddress,
    pub owner: ContractAddress,
    pub token_address: ContractAddress
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Players {
    #[key]
    pub player_address: ContractAddress,
    pub name_ : felt252
}


#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Square {
    Top_Left,
    Tops,
    Top_Right,
    Left,
    Centre,
    Right,
    Bottom_Left,
    Bottom,
    Bottom_Right,
}

#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Players_tuple {
    details : (felt252, ContractAddress, u256),
}

#[derive(Serde, Copy, Drop, Introspect, PartialEq, Debug)]
pub enum Winning_tuple {
    winning_moves : (u32, u32, u32),
}



impl DirectionIntoFelt252 of Into<Square, felt252> {
    fn into(self: Square) -> felt252 {
        match self {
            Square::Top_Left => 0,
            Square::Tops => 1,
            Square::Top_Right => 2,
            Square::Left => 3,
            Square::Centre => 4,
            Square::Right => 5,
            Square::Bottom_Left => 6,
            Square::Bottom => 7,
            Square::Bottom_Right => 8,
        }
    }
}