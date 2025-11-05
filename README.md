# 五子棋游戏 (Gomoku Game)

一个使用 TypeScript + Vite 开发的前端五子棋游戏。

## 功能特性

- ✨ 经典五子棋规则
- 🎨 精美的UI设计
- 📱 响应式布局，支持移动端
- 🔄 重新开始游戏功能
- 🎯 自动检测获胜条件
- 🤝 平局判断支持
- ✅ 完整的单元测试覆盖

## 技术栈

- TypeScript
- Vite
- Canvas API
- ES6+ 模块化
- Vitest (单元测试)

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```

### 类型检查

```bash
npm run typecheck
```

### 预览构建结果

```bash
npm run preview
```

### 运行测试

```bash
# 运行测试（一次性）
npm run test:run

# 监听模式运行测试
npm test

# 运行测试并查看UI界面
npm run test:ui
```

### 停止开发服务器

开发服务器在后台运行时，可以使用以下方法停止：

```bash
# 方法 1: 在运行 npm run dev 的终端窗口按 Ctrl+C

# 方法 2: Windows 系统 - 查找并终止占用端口的进程
# 查找占用 5173 端口的进程
netstat -ano | findstr :5173

# 强制终止进程（替换 <PID> 为实际进程 ID）
taskkill /F /PID <PID>

# 方法 3: Linux/Mac 系统 - 查找并终止占用端口的进程
# 查找占用 5173 端口的进程
lsof -i :5173

# 终止进程（替换 <PID> 为实际进程 ID）
kill -9 <PID>
```

**提示**: 如果端口被占用无法启动服务器，请使用上述命令清理端口后再次尝试。

## 游戏规则

1. 黑子先行，双方轮流落子
2. 横、竖、斜任意方向连成五子即获胜
3. 棋盘填满且无获胜者时判定为平局
4. 点击棋盘交叉点落子

## 项目结构

```
gomoku-game/
├── src/
│   ├── __tests__/
│   │   └── GomokuGame.test.ts  # 单元测试
│   ├── GomokuGame.ts      # 游戏核心逻辑
│   ├── GameRenderer.ts    # 渲染引擎
│   ├── main.ts            # 主入口文件
│   └── style.css          # 样式文件
├── index.html             # HTML入口
├── package.json           # 项目配置
├── tsconfig.json          # TypeScript配置
├── vite.config.ts         # Vite配置
└── vitest.config.ts       # Vitest配置
```

## 开发说明

- 使用 ES 模块语法 (import/export)
- 严格的 TypeScript 类型检查
- 代码包含详细的中文注释
- 遵循现代前端开发最佳实践

## License

MIT
