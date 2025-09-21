class Game {
    constructor(board, dice, players, ){
        this.board = board
        this.dice = dice
        this.players = players
        this.trun = 0
        this.consecutive_six = 0
        this.finished_players = []
    }

    start_game() {
        console.log("Starting Snakes and Ladders Game!\n")

        while (this.finished_players.length < this.players.length - 1) {
            const cur_player = this.players[this.trun % this.players.length]

            if (this.finished_players.includes(cur_player)) {
                this.trun += 1
                continue
            }

            console.log(`Player ${cur_player.name}'s true: \n`)
            this.play_trun(cur_player)
            this.trun += 1
        }
        
        for (const p of this.players) {
            if (!this.finished_players.includes(p)) {
                p.set_rank(this.players.length)
                console.log(`Player ${p.name} gets Rank ${p.get_rank()} (last)`)
                break
            }
        }

        console.log("Game over \n")
        this.print_ranks()
    }

    play_trun(player) {
        this.consecutive_six = 0
        let total_move = 0

        while (true) {
            const roll = this.dice.roll()
            console.log(`Player ${player.name} rolled a ${roll}`)
            if (roll == 6) {
                this.consecutive_six += 1
                if (this.consecutive_six === 3) {
                    console.log('Three 6s in a row! Turn forfeited.')
                    return
                }
                total_move += 6
                console.log("Rolled a 6! Roll again.")
                continue
            } else {
                total_move += roll
                break
            }
        }

        this.move_player(player, total_move)
    }

    move_player(player, move) {
        const initial_pos = player.get_pos()
        let new_pos = initial_pos + move

        if (new_pos > this.board.size) {
            console.log(`Move exceeds board size. Player ${player.name} stays at ${initial_pos}`)
            return
        }

        console.log(`Player ${player.name} moves from ${initial_pos} to ${new_pos}`)

        while (this.board.entityMap.has(new_pos)) {
            const entity = this.board.entityMap.get(new_pos)
            console.log(`${entity.desc}! Moving to ${entity.get_end_pos()}`)
            new_pos = entity.get_end_pos()
        }

        player.set_pos(new_pos)

        if (new_pos === this.board.size) {
            player.set_rank(this.finished_players.length + 1)
            this.finished_players.push(player)
            console.log(`Player ${player.id} has finished and is ranked ${player.get_rank()}`)
        }
    }

    print_ranks() {
        console.log("\nFinal Rankings:")
        const sorted_players = [...this.players].sort((a, b) => a.get_rank() - b.get_rank())
        for (const p of sorted_players) {
            console.log(`Player ${p.name}: Rank ${p.get_rank()}`)
        }
    }
}

class Board {
    constructor(size) {
        this.size = size
        this.entityMap = new Map()
    }

    addEntity(start, entity) {
        this.entityMap.set(start, entity)
    }
}

class Dice {
    constructor() {
        this.sides = 6
    }

    roll() {
        return Math.floor(Math.random() * this.sides) + 1
    }
}

class MovingEntity {
    constructor(end_pos, desc) {
        this.end_pos = end_pos
        this.desc = desc
    }

    get_end_pos() {
        return this.end_pos
    }
}

class Snake extends MovingEntity {
    constructor(end_pos) {
        super(end_pos, "Bit by snake")
    }
}

class Ladder extends MovingEntity {
    constructor(end_pos) {
        super(end_pos, "Climbed Ladder")
    }
}

class Player {
    constructor(id, name) {
        this.id = id 
        this.name = name
        this.rank = -1
        this.position = 1
    }

    get_pos() {
        return this.position
    }

    set_pos(pos) {
        this.position = pos
    }

    get_rank() {
        return this.rank
    }

    set_rank(rank) {
        this.rank = rank
    }
}

const board = new Board(100)

board.addEntity(14, new Snake(7))
board.addEntity(31, new Snake(19))
board.addEntity(38, new Snake(5))
board.addEntity(99, new Snake(1))

board.addEntity(3, new Ladder(22))
board.addEntity(8, new Ladder(26))
board.addEntity(28, new Ladder(84))
board.addEntity(58, new Ladder(77))

const dice = new Dice()

const player1 = new Player(66, 'manu')
const player2 = new Player(77, 'lavi')

const game = new Game(board, dice, [])
game.players.push(player1)
game.players.push(player2)

game.start_game()