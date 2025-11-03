import { GomokuGame, Player } from './GomokuGame'

/**
 * 游戏渲染器类，负责绘制棋盘和棋子
 */
export class GameRenderer {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private game: GomokuGame
  private cellSize: number
  private padding: number

  constructor(canvas: HTMLCanvasElement, game: GomokuGame) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('无法获取canvas上下文')
    }
    this.ctx = ctx
    this.game = game

    // 计算格子大小和边距
    this.padding = 30
    this.cellSize = (this.canvas.width - 2 * this.padding) / (this.game.getBoardSize() - 1)
  }

  /**
   * 绘制整个游戏界面
   */
  public render(): void {
    this.clearCanvas()
    this.drawBoard()
    this.drawPieces()
  }

  /**
   * 清空画布
   */
  private clearCanvas(): void {
    this.ctx.fillStyle = '#daa520'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  /**
   * 绘制棋盘网格
   */
  private drawBoard(): void {
    const boardSize = this.game.getBoardSize()

    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 1

    // 绘制横线
    for (let i = 0; i < boardSize; i++) {
      this.ctx.beginPath()
      const y = this.padding + i * this.cellSize
      this.ctx.moveTo(this.padding, y)
      this.ctx.lineTo(this.padding + (boardSize - 1) * this.cellSize, y)
      this.ctx.stroke()
    }

    // 绘制竖线
    for (let i = 0; i < boardSize; i++) {
      this.ctx.beginPath()
      const x = this.padding + i * this.cellSize
      this.ctx.moveTo(x, this.padding)
      this.ctx.lineTo(x, this.padding + (boardSize - 1) * this.cellSize)
      this.ctx.stroke()
    }

    // 绘制星位（天元和四个角的标记点）
    this.drawStarPoints(boardSize)
  }

  /**
   * 绘制星位标记点
   */
  private drawStarPoints(boardSize: number): void {
    const starPositions: number[][] = []

    // 标准15x15棋盘的星位
    if (boardSize === 15) {
      starPositions.push(
        [3, 3], [3, 7], [3, 11],
        [7, 3], [7, 7], [7, 11],
        [11, 3], [11, 7], [11, 11]
      )
    }

    this.ctx.fillStyle = '#000'
    for (const [row, col] of starPositions) {
      const x = this.padding + col * this.cellSize
      const y = this.padding + row * this.cellSize
      this.ctx.beginPath()
      this.ctx.arc(x, y, 4, 0, 2 * Math.PI)
      this.ctx.fill()
    }
  }

  /**
   * 绘制所有棋子
   */
  private drawPieces(): void {
    const boardSize = this.game.getBoardSize()

    for (let row = 0; row < boardSize; row++) {
      for (let col = 0; col < boardSize; col++) {
        const piece = this.game.getPiece(row, col)
        if (piece !== null) {
          this.drawPiece(row, col, piece)
        }
      }
    }
  }

  /**
   * 绘制单个棋子
   */
  private drawPiece(row: number, col: number, player: Player): void {
    const x = this.padding + col * this.cellSize
    const y = this.padding + row * this.cellSize
    const radius = this.cellSize * 0.4

    // 绘制棋子阴影
    this.ctx.beginPath()
    this.ctx.arc(x + 2, y + 2, radius, 0, 2 * Math.PI)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    this.ctx.fill()

    // 绘制棋子
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI)

    if (player === 'black') {
      // 黑子：黑色带渐变
      const gradient = this.ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        radius * 0.1,
        x,
        y,
        radius
      )
      gradient.addColorStop(0, '#666')
      gradient.addColorStop(1, '#000')
      this.ctx.fillStyle = gradient
    } else {
      // 白子：白色带渐变
      const gradient = this.ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        radius * 0.1,
        x,
        y,
        radius
      )
      gradient.addColorStop(0, '#fff')
      gradient.addColorStop(1, '#ddd')
      this.ctx.fillStyle = gradient
    }

    this.ctx.fill()

    // 棋子边框
    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 1
    this.ctx.stroke()
  }

  /**
   * 将画布坐标转换为棋盘坐标
   */
  public getBoardPosition(canvasX: number, canvasY: number): { row: number; col: number } | null {
    const col = Math.round((canvasX - this.padding) / this.cellSize)
    const row = Math.round((canvasY - this.padding) / this.cellSize)

    // 检查点击位置是否在有效范围内
    const boardSize = this.game.getBoardSize()
    if (row >= 0 && row < boardSize && col >= 0 && col < boardSize) {
      // 检查点击是否足够接近交叉点
      const actualX = this.padding + col * this.cellSize
      const actualY = this.padding + row * this.cellSize
      const distance = Math.sqrt(
        Math.pow(canvasX - actualX, 2) + Math.pow(canvasY - actualY, 2)
      )

      // 如果距离小于格子大小的一半，认为是有效点击
      if (distance < this.cellSize * 0.5) {
        return { row, col }
      }
    }

    return null
  }
}
