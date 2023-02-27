const game = document.getElementById('game')
const result = document.getElementById('result')
const resetBtn = document.getElementById('reset')
const aiGamer = 'x', humanGamer = 'o'

class Game {
  constructor(size = 3) {
    this.size = size
    this.turn = Math.floor(Math.random() * 2)
    this.turnCount = 0


    resetBtn.addEventListener('click', () => { 
      this.resetGame()
    })

    this.cellList = []
    this.resetGame() 
  }

  get limit() {
    return this.size * this.size
  }

  init() {
    for (let i = 0; i < this.limit; i++) {
      const cell = document.createElement('div')
      cell.setAttribute('data-id', i)
      cell.addEventListener('click', this.humanPlay())
      game.appendChild(cell)
      this.cellList.push(cell)
    }
  }

  resetGame() {
    this.board = [...Array(this.limit).keys()]
    result.innerHTML = ''
    game.innerHTML = ''
    this.turnCount = 0
    this.cellList = []
    this.init()
  }

  humanPlay() {
    return e => {
      this.turnCount += 1
      const id = e.target.getAttribute('data-id')
      this.board[+id] = humanGamer
      this.cellList[+id].innerHTML = `<span>${humanGamer}</span>`
      if (this.turnCount >= this.limit) { 
        result.innerHTML = '<h3>Ничья</h3>'
        return
      }
      if (this.checkWinner(this.board, humanGamer)) {
        result.innerHTML = '<h3>Победа</h3>'
        return
      }
      this.makeAiTurn()
    }
  }

  makeAiTurn() {
    this.turnCount += 1
    const bestMove = this.minimax(this.board, aiGamer)
    this.board[bestMove.idx] = aiGamer
    this.cellList[bestMove.idx].innerHTML = `<span>${aiGamer}</span>`
    if (this.turnCount >= this.limit) {
      result.innerHTML = '<h3>Ничья</h3>'
      return
    }
    if (this.checkWinner(this.board, aiGamer)) {
      result.innerHTML = '<h3>Проигрыш</h3>'
      return
    }
  }

  checkWinner(board, player) {
    if (board[0] === player && board[1] === player && board[2] === player ||
      board[3] === player && board[4] === player && board[5] === player ||
      board[6] === player && board[7] === player && board[8] === player ||
      board[0] === player && board[3] === player && board[6] === player ||
      board[1] === player && board[4] === player && board[7] === player ||
      board[2] === player && board[5] === player && board[8] === player ||
      board[0] === player && board[4] === player && board[8] === player ||
      board[2] === player && board[4] === player && board[6] === player) {
      return true
    }
    return false
  }


  minimax(board, player) {
    const emptyCells = this.findEmptyCells(board)
    if (this.checkWinner(board, humanGamer)) {
      return { score: -1 }
    } else if(this.checkWinner(board, aiGamer)) {
      return { score: 1 }
    } else if (emptyCells.length === 0) {
      return { score: 0 }
    }

    let moves = []

    for (let i = 0; i < emptyCells.length; i++) {
      let move = []
      board[emptyCells[i]] = player
      move.idx = emptyCells[i]
      if (player === humanGamer) {
        const payload  = this.minimax(board, aiGamer) 
        move.score = payload.score 
      } 
      if (player === aiGamer) {
        const payload  = this.minimax(board, humanGamer) 
        move.score = payload.score 
      } 
      board[emptyCells[i]] = move.idx 
      moves.push(move)
    }

    let bestMove = null

    if (player === aiGamer) {
      let bestScore = -Infinity
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score
          bestMove = i 
        }
      }
    } else {
      let bestScore = Infinity
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score
          bestMove = i 
        }
      }
    }

    return moves[bestMove]
  }

  findEmptyCells(board) {
    return board.filter(c => c !== humanGamer && c !== aiGamer)
  }
}

new Game()