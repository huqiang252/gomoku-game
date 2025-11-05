import { GomokuGame } from './GomokuGame'
import { GameRenderer } from './GameRenderer'
import './style.css'

/**
 * 游戏控制器类，负责协调游戏逻辑和UI更新
 */
class GameController {
  private game: GomokuGame
  private renderer: GameRenderer
  private statusElement: HTMLElement
  private restartButton: HTMLButtonElement
  private canvas: HTMLCanvasElement

  constructor() {
    // 初始化DOM元素
    this.canvas = document.getElementById('board') as HTMLCanvasElement
    this.statusElement = document.getElementById('status') as HTMLElement
    this.restartButton = document.getElementById('restartBtn') as HTMLButtonElement

    if (!this.canvas || !this.statusElement || !this.restartButton) {
      throw new Error('无法找到必需的DOM元素')
    }

    // 初始化游戏和渲染器
    this.game = new GomokuGame(15)
    this.renderer = new GameRenderer(this.canvas, this.game)

    // 绑定事件
    this.bindEvents()

    // 首次渲染
    this.updateUI()
  }

  /**
   * 绑定事件处理器
   */
  private bindEvents(): void {
    // 棋盘点击事件
    this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e))

    // 重新开始按钮
    this.restartButton.addEventListener('click', () => this.handleRestart())
  }

  /**
   * 处理棋盘点击事件
   */
  private handleCanvasClick(event: MouseEvent): void {
    const rect = this.canvas.getBoundingClientRect()
    const scaleX = this.canvas.width / rect.width
    const scaleY = this.canvas.height / rect.height

    const canvasX = (event.clientX - rect.left) * scaleX
    const canvasY = (event.clientY - rect.top) * scaleY

    // 获取棋盘坐标
    const position = this.renderer.getBoardPosition(canvasX, canvasY)

    if (position) {
      const { row, col } = position

      // 尝试放置棋子
      const success = this.game.placePiece(row, col)

      if (success) {
        this.updateUI()
      }
    }
  }

  /**
   * 处理重新开始
   */
  private handleRestart(): void {
    this.game.reset()
    this.updateUI()
  }

  /**
   * 更新UI显示
   */
  private updateUI(): void {
    // 重新渲染棋盘
    this.renderer.render()

    // 更新状态文本
    const gameState = this.game.getGameState()

    if (gameState.isGameOver) {
      if (gameState.winner) {
        // 有获胜者
        const winnerText = gameState.winner === 'black' ? '黑子' : '白子'
        this.statusElement.textContent = `${winnerText}获胜！`
        this.statusElement.style.color = '#e74c3c'
      } else {
        // 平局
        this.statusElement.textContent = '平局！'
        this.statusElement.style.color = '#f39c12'
      }
    } else {
      const currentText = gameState.currentPlayer === 'black' ? '黑子' : '白子'
      this.statusElement.textContent = `${currentText}回合`
      this.statusElement.style.color = '#667eea'
    }
  }
}

// 页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', () => {
  new GameController()
})
