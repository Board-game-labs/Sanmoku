use sanmoku::models::{Moves, Board, Game, Square, Players};
use starknet::{ContractAddress};

// // define the interface
#[starknet::interface]
trait IActions<TState> {
    fn initiate_game(ref self: TState, avatar: felt252) -> felt252;
    fn join_game(ref self: TState, game_id: felt252);
    fn play_game(ref self: TState, game_id: felt252, square: Square) -> felt252;
    fn restart_game(ref self: TState, game_id: felt252);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use sanmoku::models::{Moves, Board, Game, Square, Winning_tuple, Gate,Players,Players_tuple,Fixed,Response};
    use starknet::{ContractAddress, get_caller_address};
    use core::starknet::contract_address_const;
    use super::IActions;
    // use sanmoku::erc20_dojo::erc20::{IERC20Dispatcher, IERC20DispatcherTrait};
    use dojo::model::{ModelStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Spawn {
        #[key]
        game_id: felt252,
        player_1: ContractAddress,
        player_2: ContractAddress,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Result {
        #[key]
        game_id: felt252,
        result: felt252,
        winneraddress: ContractAddress,

    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Gameinitiated {
        #[key]
        playeraddress: ContractAddress,
        gameid: felt252,
    }

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Restarted {
        #[key]
        game_id: felt252,
        player_1: ContractAddress,
        player_2: ContractAddress,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn initiate_game(
            ref self: ContractState, avatar: felt252) -> felt252{
            // Get the default world.
            let mut world = self.world_default();
            let player_one = get_caller_address();
            assert(avatar != 0, 'avatar cannot be zero');
            assert(avatar == 1 || avatar == 2, 'invalid avatar');
            let counter_key = starknet::contract_address_const::<0x0123>();
            let current_world_count : Fixed = world.read_model(counter_key);
            let current_game_id = current_world_count.gameid;
            let mut board_stat : Board = world.read_model(current_game_id);
            let mut moves : Moves = world.read_model(player_one);

            if avatar == 1 {
                moves.player = player_one;
                moves.opponent = contract_address_const::<0>();
                moves.game_id = current_game_id;
                moves.avatar_choice = 'X';
                moves.move_one = 404;
                moves.move_two = 404;
                moves.move_three = 404;
                moves.move_four = 404;
                moves.move_five = 404;
                moves.turn = true;
                board_stat.game_id = current_game_id;
            }else {
                moves.player = player_one;
                moves.opponent = contract_address_const::<0>();
                moves.game_id = current_game_id;
                moves.avatar_choice = 'O';
                moves.move_one = 404;
                moves.move_two = 404;
                moves.move_three = 404;
                moves.move_four = 404;
                moves.move_five = 404;
                moves.turn = true;
                board_stat.game_id = current_game_id;
            }
            world.write_model(@moves);
            world.write_model(@board_stat);
            let new_game_id = Fixed {
                fixed_key: counter_key, 
                gameid: current_game_id + 1,
            };
            let game = Game {
                game_id: current_game_id,
                winner: contract_address_const::<0>(),
                player_one_: player_one,
                player_two_: contract_address_const::<0>(),
            };
            world.write_model(@game);
            world.write_model(@new_game_id);
            world.emit_event(@Gameinitiated { playeraddress: player_one, gameid: current_game_id });
            current_game_id
        }
        fn join_game(ref self: ContractState, game_id: felt252) {
            let mut world = self.world_default();
            let player_two = get_caller_address();
            let mut board_stat : Board = world.read_model(game_id);
            let mut game_stat : Game = world.read_model(game_id);
            let mut player_two_moves_stat : Moves = world.read_model(player_two);
            let player_one = game_stat.player_one_;
            game_stat.player_two_ = player_two;
            let mut player_one_moves_stat : Moves = world.read_model(player_one);
            if(player_one_moves_stat.avatar_choice == 'X'){
                player_two_moves_stat.player = player_two;
                player_two_moves_stat.opponent = player_one;
                player_two_moves_stat.game_id = game_stat.game_id;
                player_two_moves_stat.avatar_choice = 'O';
                player_two_moves_stat.move_one = 404;
                player_two_moves_stat.move_two = 404;
                player_two_moves_stat.move_three = 404;
                player_two_moves_stat.move_four = 404;
                player_two_moves_stat.move_five = 404;
                player_two_moves_stat.turn = false;
                board_stat.game_id = game_stat.game_id;
                player_one_moves_stat.opponent = player_two;
            }else if (player_one_moves_stat.avatar_choice == 'O'){
                player_two_moves_stat.player = player_two;
                player_two_moves_stat.opponent = player_one;
                player_two_moves_stat.game_id = game_stat.game_id;
                player_two_moves_stat.avatar_choice = 'X';
                player_two_moves_stat.move_one = 404;
                player_two_moves_stat.move_two = 404;
                player_two_moves_stat.move_three = 404;
                player_two_moves_stat.move_four = 404;
                player_two_moves_stat.move_five = 404;
                player_two_moves_stat.turn = false;
                board_stat.game_id = game_stat.game_id;
                player_one_moves_stat.opponent = player_two;
            }
            world.write_model(@player_two_moves_stat);
            world.write_model(@player_one_moves_stat);
            world.write_model(@board_stat);
            world.write_model(@game_stat);
            world.emit_event(@Spawn { game_id: game_stat.game_id, player_1: player_one, player_2: player_two });
        }
        
        fn play_game(ref self: ContractState, game_id: felt252, square: Square) -> felt252{
            let player = get_caller_address();
            let mut world = self.world_default();
            let mut game_stat : Game = world.read_model(game_id);
            assert(player == game_stat.player_one_ || player == game_stat.player_two_, 'only players can play');
            assert(game_stat.player_one_ != contract_address_const::<0>(), 'game not started');
            assert(game_stat.player_two_ != contract_address_const::<0>(), 'game not started');
            let mut board_state : Board = world.read_model(game_id);
            let mut player_moves : Moves = world.read_model(player);
            assert(player_moves.turn == false, 'not your turn');
            player_moves.turn = true;
            let opponent = player_moves.opponent;
            let mut opponent_moves : Moves = world.read_model(opponent);
            opponent_moves.turn = false;

            let (played_move_board_state, current_move_state) = compute_board_state(
                board_state, player_moves, square
            );

            let result = check_victory(current_move_state);
            let mut response : felt252 = ''.into();
            if result == 1 && player_moves.avatar_choice == 'X' {
                response = 'PLAYER X WINS';
                game_stat.winner = player;
            } else if result == 1 && player_moves.avatar_choice == 'O' {
                response = 'PLAYER O WINS';
                game_stat.winner = player;
            } else if result == 2 {
                response = 'DRAW';
            }
            
            world.write_model(@current_move_state);
            world.write_model(@opponent_moves);
            world.write_model(@game_stat);
            world.write_model(@played_move_board_state);
            world.emit_event(@Result { game_id: game_stat.game_id, result: response, winneraddress: game_stat.winner });
            response
        }
        
        fn restart_game(ref self: ContractState, game_id: felt252){
            let player_one = get_caller_address();
            let mut world = self.world_default();
            let mut game_stat : Game = world.read_model(game_id);
            let mut player_one_moves_stat : Moves = world.read_model(game_stat.player_one_);
            let mut player_two_moves_stat : Moves = world.read_model(game_stat.player_two_);
            let mut board_state : Board = world.read_model(game_id);
            assert(player_one == game_stat.player_one_ || player_one == game_stat.player_two_, 'only players can restart');
            assert(board_state.a_1 != '', 'game still active');
            assert(board_state.a_2 != '', 'game still active');
            assert(board_state.a_3 != '', 'game still active');
            assert(board_state.b_1 != '', 'game still active');
            assert(board_state.b_2 != '', 'game still active');
            assert(board_state.b_3 != '', 'game still active');
            assert(board_state.c_1 != '', 'game still active');
            assert(board_state.c_2 != '', 'game still active');
            assert(board_state.c_3 != '', 'game still active');
            
            //reset for player two
            player_two_moves_stat.move_one = 404;
            player_two_moves_stat.move_two = 404;
            player_two_moves_stat.move_three = 404;
            player_two_moves_stat.move_four = 404;
            player_two_moves_stat.move_five = 404;
                
            //reset for player one
            player_one_moves_stat.move_one = 404;
            player_one_moves_stat.move_two = 404;
            player_one_moves_stat.move_three = 404;
            player_one_moves_stat.move_four = 404;
            player_one_moves_stat.move_five = 404;
             
             //reset board 
             board_state.a_1 = '';
             board_state.a_2 = '';
             board_state.a_3 = '';
             board_state.b_1 = '';
             board_state.b_2 = '';
             board_state.b_3 = '';
             board_state.c_1 = '';
             board_state.c_2 = '';
             board_state.c_3 = '';
             world.write_model(@player_two_moves_stat);
             world.write_model(@player_one_moves_stat);
             world.write_model(@board_state);
             world.write_model(@game_stat);
            world.emit_event(@Restarted { game_id: game_stat.game_id, player_1: game_stat.player_one_ , player_2: game_stat.player_one_  });

        }



    }
    // Function to compute the board state and player moves
    fn compute_board_state(mut board_state: Board, mut player_moves_state: Moves, square: Square) -> (Board, Moves) {
        //handle square selected here
        match square {
            Square::Top_Left(()) => {
                assert(board_state.a_1 == '', 'non_empty');
                board_state.a_1 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 0;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 0;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 0;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 0;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 0;
                }
            },
            Square::Tops(()) => {
                assert(board_state.a_2 == '', 'non_empty');
                board_state.a_2 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 1;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 1;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 1;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 1;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 1;
                }
            },
            Square::Top_Right(()) => {
                assert(board_state.a_3 == '', 'non_empty');
                board_state.a_3 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 2;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 2;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 2;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 2;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 2;
                }
            },
            Square::Left(()) => {
                assert(board_state.b_1 == '', 'non_empty');
                board_state.b_1 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 3;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 3;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 3;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 3;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 3;
                }
            },
            Square::Centre(()) => {
                assert(board_state.b_2 == '', 'non_empty');
                board_state.b_2 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 4;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 4;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 4;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 4;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 4;
                }
            },
            Square::Right(()) => {
                assert(board_state.b_3 == '', 'non_empty');
                board_state.b_3 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 5;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 5;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 5;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 5;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 5;
                }
            },
            Square::Bottom_Left(()) => {
                assert(board_state.c_1 == '', 'non_empty');
                board_state.c_1 = player_moves_state.avatar_choice;
                //check current move count to set the moved piece accordingly here
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 6;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 6;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 6;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 6;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 6;
                }
            },
            Square::Bottom(()) => {
                assert(board_state.c_2 == '', 'non_empty');
                board_state.c_2 = player_moves_state.avatar_choice;
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 7;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 7;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 7;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 7;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 7;
                }
            },
            Square::Bottom_Right(()) => {
                assert(board_state.c_3 == '', 'non_empty');
                board_state.c_3 = player_moves_state.avatar_choice;
                if player_moves_state.counter == 0 {
                    player_moves_state.move_one = 8;
                } else if player_moves_state.counter == 1 {
                    player_moves_state.move_two = 8;
                } else if player_moves_state.counter == 2 {
                    player_moves_state.move_three = 8;
                } else if player_moves_state.counter == 3 {
                    player_moves_state.move_four = 8;
                } else if player_moves_state.counter == 4 {
                    player_moves_state.move_five = 8;
                }
            },
        };
        //set move count after playing here
        player_moves_state.counter += 1;
        //return computed board and moves
        (board_state, player_moves_state)
    }

    fn check_victory(mut current_moves_state: Moves) -> felt252 {
        let mut winning_array: Array<Winning_tuple> = ArrayTrait::new();
        winning_array.append(Winning_tuple::winning_moves((0, 1, 2)));
        winning_array.append(Winning_tuple::winning_moves((3, 4, 5)));
        winning_array.append(Winning_tuple::winning_moves((6, 7, 8)));
        winning_array.append(Winning_tuple::winning_moves((0, 3, 6)));
        winning_array.append(Winning_tuple::winning_moves((1, 4, 7)));
        winning_array.append(Winning_tuple::winning_moves((2, 5, 8)));
        winning_array.append(Winning_tuple::winning_moves((0, 4, 8)));
        winning_array.append(Winning_tuple::winning_moves((2, 4, 6)));

        //check if combination matches any of the tuple
        let mut moves_array: Array<u32> = ArrayTrait::new();
        moves_array.append(current_moves_state.move_one);
        moves_array.append(current_moves_state.move_two);
        moves_array.append(current_moves_state.move_three);
        moves_array.append(current_moves_state.move_four);
        moves_array.append(current_moves_state.move_five);

        //return a winning array_tupple
        let mut loop_count = 0;
        let mut loop_two_count = 0;
        let hol = moves_array.span();
        let true_rep: felt252 = 1.into();
        let false_rep: felt252 = 2.into();
        let res = loop {
            if loop_two_count > 7 {
                break false_rep;
            };
            let tuple_returned = *winning_array.at(loop_two_count);
            let (res1, res2, res3) = tuple_returned.process();
            let mut won: Array<u32> = ArrayTrait::new();
            let inner_check = loop {
                if loop_count > 4 {
                    loop_count = 0;
                    break;
                };
                let item = *hol.at(loop_count);
                if item == res1 {
                    won.append(item);
                } else if item == res2 {
                    won.append(item);
                } else if item == res3 {
                    won.append(item);
                }

                loop_count += 1;
            };
            if won.len() == 3 {
                break true_rep;
            }
            loop_two_count += 1;
        };
        res
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"sanmoku")
        }
    }
   
    #[generate_trait]
    impl ProcessingImpl of Processing {
        fn process(self: Winning_tuple) -> (u32, u32, u32) {
            match self {
                Winning_tuple::winning_moves((x, y, z)) => { (x, y, z) },
            }
        }
    }
}

