from dataclasses import dataclass, field
from typing import List, Dict, Optional, Union
from enum import Enum
import random

@dataclass
class Game:
    board: "Board"
    dice: "Dice"
    players: List["Player"]
    trun: int = 0
    consecutive_six: int = 0
    finished_players: List["Player"] = field(default_factory=list)

    def start_game(self):
        print("Starting Snakes and Ladders Game!\n")
        while len(self.finished_players) < len(self.players) - 1:
            cur_player = self.players[self.trun % len(self.players)]

            if cur_player in self.finished_players:
                self.trun += 1
                continue
            
            print(f"\nPlayer {cur_player.id}'s turn:")
            self.play_trun(cur_player)
            self.trun += 1
        
        for p in self.players:
            if p not in self.finished_players:
                p.set_rank(len(self.players))
                print(f"Player {p.id} gets Rank {p.get_rank()} (last)")
                break
        
        print("\nGame Over!")
        self.print_ranks()

    def play_trun(self, player):
        self.consecutive_six = 0
        total_move = 0
        while True:
            roll = self.dice.roll()
            print(f"Player {player.id} rolled a {roll}")
            if roll == 6:
                self.consecutive_six += 1
                if self.consecutive_six == 3:
                    print("Three 6s in a row! Turn forfeited.")
                    return
                total_move += 6
                print("Rolled a 6! Roll again.")
                continue
            else:
                total_move += roll
                break
        self.move_player(player, total_move)
    
    def move_player(self, player, total_move):
        initial_pos = player.get_pos()
        new_pos = initial_pos + total_move

        if new_pos > self.board.size:
            print(f"Move exceeds board size. Player {player.id} stays at {initial_pos}")
            return
        
        print(f"Player {player.id} moves from {initial_pos} to {new_pos}")

        while new_pos in self.board.entityMap:
            entity = self.board.entityMap[new_pos]
            print(f"{entity.desc}! Moving to {entity.get_end_pos()}")
            new_pos = entity.get_end_pos()
        
        player.set_pos(new_pos)

        if new_pos == self.board.size:
            player.set_rank(len(self.finished_players) + 1)
            self.finished_players.append(player)
            print(f"Player {player.id} has finished and is ranked {player.get_rank()}")


    def print_ranks(self):
        print("\nFinal Rankings:")
        for p in sorted(self.players, key=lambda x:x.get_rank()):
            print(f"Player {p.id}: Rank {p.get_rank()}")

@dataclass
class Board:
    size: int
    entityMap: Dict[int, "MovingEntity"]

@dataclass
class Dice:
    sides: int = 6

    def roll(self):
        return random.randint(1, self.sides)

@dataclass
class MovingEntity:
    end_pos: int
    desc: Optional[str] = None 

    def set_description(self, desc):
        self.desc = desc
    
    def get_end_pos(self):
        return self.end_pos

@dataclass
class Snake(MovingEntity):
    def __post_init__(self):
        self.desc = "Bit by Snake"

@dataclass
class Ladder(MovingEntity):
    def __post_init__(self):
        self.desc = "Climbed Ladder"

@dataclass
class Player:
    id: int
    rank = -1
    position: 1

    def set_pos(self, pos):
        self.position = pos
    
    def get_pos(self):
        return self.position
    
    def set_rank(self, rank):
        self.rank = rank
    
    def get_rank(self):
        return self.rank

Snakes = {
    14: Snake(end_pos=7),
    31: Snake(end_pos=19),
    38: Snake(end_pos=5),
    99: Snake(end_pos=1)
}

Ladders = {
    3: Ladder(end_pos=22),
    8: Ladder(end_pos=26),
    28: Ladder(end_pos=84),
    58: Ladder(end_pos=77)
}

entities = {**Snakes, **Ladders}

board = Board(100, entities)
dice = Dice()

player1 = Player(66, 1)
player2 = Player(77, 1)

game = Game(board, dice, [])
game.players.append(player1)
game.players.append(player2)

game.start_game()