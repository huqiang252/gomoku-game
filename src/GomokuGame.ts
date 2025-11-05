// 定义玩家类型
export type Player = 'black' | 'white' | null

// 定义游戏状态接口
export interface GameState {
  currentPlayer: Player
  winner: Player
  isGameOver: boolean
}

// 定义坐标接口
export interface Position {
  row: number
  col: number
}

/**
 * 五子棋游戏核心逻辑类
 */
export class GomokuGame {
  private readonly boardSize: number
  private board: Player[][]
  private currentPlayer: Player
  private winner: Player
  private isGameOver: boolean

  constructor(boardSize: number = 15) {
    this.boardSize = boardSize
    this.board = []
    this.currentPlayer = 'black' // 黑子先行
    this.winner = null
    this.isGameOver = false
    this.initBoard()
  }

  /**
   * 初始化棋盘
   */
  private initBoard(): void {
    this.board = Array(this.boardSize)
      .fill(null)
      .map(() => Array(this.boardSize).fill(null))
  }

  /**
   * 获取棋盘大小
   */
  public getBoardSize(): number {
    return this.boardSize
  }

  /**
   * 获取指定位置的棋子
   */
  public getPiece(row: number, col: number): Player {
    if (this.isValidPosition(row, col)) {
      return this.board[row][col]
    }
    return null
  }

  /**
   * 获取当前玩家
   */
  public getCurrentPlayer(): Player {
    return this.currentPlayer
  }

  /**
   * 获取游戏状态
   */
  public getGameState(): GameState {
    return {
      currentPlayer: this.currentPlayer,
      winner: this.winner,
      isGameOver: this.isGameOver
    }
  }

  /**
   * 检查位置是否有效
   */
  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < this.boardSize && col >= 0 && col < this.boardSize
  }

  /**
   * 放置棋子
   */
  public placePiece(row: number, col: number): boolean {
    // 游戏结束后不能继续下棋
    if (this.isGameOver) {
      return false
    }

    // 检查位置是否有效
    if (!this.isValidPosition(row, col)) {
      return false
    }

    // 检查位置是否已被占用
    if (this.board[row][col] !== null) {
      return false
    }

    // 放置棋子
    this.board[row][col] = this.currentPlayer

    // 检查是否获胜
    if (this.checkWin(row, col)) {
      this.winner = this.currentPlayer
      this.isGameOver = true
    } else if (this.isBoardFull()) {
      // 棋盘已满，平局
      this.isGameOver = true
      // winner 保持为 null 表示平局
    } else {
      // 切换玩家
      this.currentPlayer = this.currentPlayer === 'black' ? 'white' : 'black'
    }

    return true
  }

  /**
   * 检查棋盘是否已满（平局）
   */
  private isBoardFull(): boolean {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col] === null) {
          return false
        }
      }
    }
    return true
  }

  /**
   * 检查是否获胜
   */
  private checkWin(row: number, col: number): boolean {
    const player = this.board[row][col]
    if (player === null) {
      return false
    }

    // 四个方向：横向、纵向、左斜、右斜
    const directions = [
      { dx: 0, dy: 1 },   // 横向
      { dx: 1, dy: 0 },   // 纵向
      { dx: 1, dy: 1 },   // 左斜
      { dx: 1, dy: -1 }   // 右斜
    ]

    // 检查每个方向
    for (const { dx, dy } of directions) {
      let count = 1 // 当前位置算一个

      // 正方向计数
      count += this.countInDirection(row, col, dx, dy, player)

      // 反方向计数
      count += this.countInDirection(row, col, -dx, -dy, player)

      // 如果连续五个或以上，获胜
      if (count >= 5) {
        return true
      }
    }

    return false
  }

  /**
   * 在指定方向计数相同颜色的棋子
   */
  private countInDirection(
    row: number,
    col: number,
    dx: number,
    dy: number,
    player: Player
  ): number {
    let count = 0
    let currentRow = row + dx
    let currentCol = col + dy

    while (
      this.isValidPosition(currentRow, currentCol) &&
      this.board[currentRow][currentCol] === player
    ) {
      count++
      currentRow += dx
      currentCol += dy
    }

    return count
  }

  /**
   * 重置游戏
   */
  public reset(): void {
    this.initBoard()
    this.currentPlayer = 'black'
    this.winner = null
    this.isGameOver = false
  }

  /**
   * 获取整个棋盘
   */
  public getBoard(): Player[][] {
    return this.board.map(row => [...row])
  }
}
