import { describe, it, expect, beforeEach } from 'vitest'
import { GomokuGame } from '../GomokuGame'

describe('GomokuGame', () => {
  let game: GomokuGame

  beforeEach(() => {
    game = new GomokuGame(15)
  })

  describe('初始化', () => {
    it('应该创建15x15的棋盘', () => {
      expect(game.getBoardSize()).toBe(15)
    })

    it('黑子应该先行', () => {
      expect(game.getCurrentPlayer()).toBe('black')
    })

    it('游戏开始时不应该结束', () => {
      const state = game.getGameState()
      expect(state.isGameOver).toBe(false)
      expect(state.winner).toBe(null)
    })
  })

  describe('落子功能', () => {
    it('应该能够在空位置落子', () => {
      const success = game.placePiece(7, 7)
      expect(success).toBe(true)
      expect(game.getPiece(7, 7)).toBe('black')
    })

    it('不应该能在已占用位置落子', () => {
      game.placePiece(7, 7)
      const success = game.placePiece(7, 7)
      expect(success).toBe(false)
    })

    it('不应该能在无效位置落子', () => {
      const success = game.placePiece(-1, 7)
      expect(success).toBe(false)
    })

    it('不应该能在棋盘外落子', () => {
      const success = game.placePiece(15, 15)
      expect(success).toBe(false)
    })

    it('落子后应该切换玩家', () => {
      game.placePiece(7, 7)
      expect(game.getCurrentPlayer()).toBe('white')
      game.placePiece(7, 8)
      expect(game.getCurrentPlayer()).toBe('black')
    })

    it('游戏结束后不应该能继续落子', () => {
      // 手动创建获胜条件（横向五子）
      for (let i = 0; i < 5; i++) {
        game.placePiece(0, i) // 黑子
        if (i < 4) {
          game.placePiece(1, i) // 白子
        }
      }

      const state = game.getGameState()
      expect(state.isGameOver).toBe(true)

      const success = game.placePiece(2, 2)
      expect(success).toBe(false)
    })
  })

  describe('获胜检测 - 横向', () => {
    it('应该检测到横向五子连珠', () => {
      // 黑子横向五子
      for (let i = 0; i < 5; i++) {
        game.placePiece(7, i) // 黑子
        if (i < 4) {
          game.placePiece(8, i) // 白子
        }
      }

      const state = game.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe('black')
    })

    it('应该检测到棋盘边缘的横向获胜', () => {
      // 在第一行放置五子
      for (let i = 0; i < 5; i++) {
        game.placePiece(0, i) // 黑子
        if (i < 4) {
          game.placePiece(1, i) // 白子
        }
      }

      const state = game.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe('black')
    })
  })

  describe('获胜检测 - 纵向', () => {
    it('应该检测到纵向五子连珠', () => {
      // 黑子纵向五子
      for (let i = 0; i < 5; i++) {
        game.placePiece(i, 7) // 黑子
        if (i < 4) {
          game.placePiece(i, 8) // 白子
        }
      }

      const state = game.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe('black')
    })
  })

  describe('获胜检测 - 左斜向', () => {
    it('应该检测到左斜向五子连珠', () => {
      // 黑子左斜向五子 (从左上到右下)
      for (let i = 0; i < 5; i++) {
        game.placePiece(i, i) // 黑子
        if (i < 4) {
          game.placePiece(i, i + 1) // 白子
        }
      }

      const state = game.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe('black')
    })
  })

  describe('获胜检测 - 右斜向', () => {
    it('应该检测到右斜向五子连珠', () => {
      // 黑子右斜向五子 (从右上到左下)
      for (let i = 0; i < 5; i++) {
        game.placePiece(i, 4 - i) // 黑子在 (0,4), (1,3), (2,2), (3,1), (4,0)
        if (i < 4) {
          game.placePiece(i, 5) // 白子
        }
      }

      const state = game.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe('black')
    })
  })

  describe('平局检测', () => {
    it('应该检测到棋盘填满时的平局', () => {
      // 创建一个小棋盘更容易测试
      const smallGame = new GomokuGame(3)

      // 填满棋盘但没有获胜者
      // X O X
      // O X O
      // O X X
      smallGame.placePiece(0, 0) // 黑
      smallGame.placePiece(0, 1) // 白
      smallGame.placePiece(0, 2) // 黑
      smallGame.placePiece(1, 0) // 白
      smallGame.placePiece(1, 1) // 黑
      smallGame.placePiece(1, 2) // 白
      smallGame.placePiece(2, 0) // 黑
      smallGame.placePiece(2, 2) // 白
      smallGame.placePiece(2, 1) // 黑

      const state = smallGame.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe(null) // 平局时 winner 为 null
    })

    it('有获胜者时不应该判定为平局', () => {
      const smallGame = new GomokuGame(5)

      // 创建横向五子
      for (let i = 0; i < 5; i++) {
        smallGame.placePiece(0, i) // 黑子
        if (i < 4) {
          smallGame.placePiece(1, i) // 白子
        }
      }

      const state = smallGame.getGameState()
      expect(state.isGameOver).toBe(true)
      expect(state.winner).toBe('black') // 应该是黑子获胜，不是平局
    })
  })

  describe('游戏重置', () => {
    it('应该重置游戏状态', () => {
      // 进行一些落子
      game.placePiece(7, 7)
      game.placePiece(7, 8)
      game.placePiece(8, 8)

      // 重置游戏
      game.reset()

      // 验证状态
      const state = game.getGameState()
      expect(state.currentPlayer).toBe('black')
      expect(state.winner).toBe(null)
      expect(state.isGameOver).toBe(false)
      expect(game.getPiece(7, 7)).toBe(null)
      expect(game.getPiece(7, 8)).toBe(null)
    })
  })

  describe('边界测试', () => {
    it('应该处理棋盘四个角落的获胜', () => {
      // 左上角横向
      for (let i = 0; i < 5; i++) {
        game.placePiece(0, i) // 黑子
        if (i < 4) {
          game.placePiece(1, i) // 白子
        }
      }

      expect(game.getGameState().winner).toBe('black')
    })

    it('应该处理超过五子的连珠', () => {
      // 六子连珠也应该算获胜
      for (let i = 0; i < 6; i++) {
        game.placePiece(7, i) // 黑子
        if (i < 5) {
          game.placePiece(8, i) // 白子
        }
      }

      expect(game.getGameState().winner).toBe('black')
    })
  })
})
