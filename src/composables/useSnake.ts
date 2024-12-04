import { ref, onMounted, onUnmounted } from 'vue'

// 定义坐标点的接口
interface Position {
  x: number
  y: number
}

// 定义移动方向的类型
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

export function useSnake() {
  // 游戏配置
  const GAME_SIZE = 20 // 20x20的游戏区域
  const INITIAL_SPEED = 200 // 初始速度(毫秒)
  
  // 游戏状态
  const isGameOver = ref(false)
  const isPaused = ref(false)
  const score = ref(0)
  
  // 蛇的状态
  const snake = ref<Position[]>([
    { x: 2, y: 0 }, // 蛇头
    { x: 1, y: 0 },
    { x: 0, y: 0 }
  ])
  
  // 当前移动方向
  const direction = ref<Direction>('RIGHT')
  // 下一步的方向(防止快速按键导致的自身碰撞)
  const nextDirection = ref<Direction>('RIGHT')
  
  // 食物位置
  const food = ref<Position>({ x: 5, y: 5 })
  
  // 游戏循环定时器
  let gameInterval: number | null = null

  // 检查是否撞墙
  const checkCollision = (position: Position): boolean => {
    // 检查墙壁碰撞
    if (
      position.x < 0 ||
      position.x >= GAME_SIZE ||
      position.y < 0 ||
      position.y >= GAME_SIZE
    ) {
      return true
    }
    
    // 检查自身碰撞
    return snake.value.some((segment, index) => {
      if (index === 0) return false
      return segment.x === position.x && segment.y === position.y
    })
  }

  // 检查是否吃到食物
  const checkFood = (head: Position): boolean => {
    return head.x === food.value.x && head.y === food.value.y
  }

  // 生成新的食物位置
  const generateFood = () => {
    while (true) {
      const newFood = {
        x: Math.floor(Math.random() * GAME_SIZE),
        y: Math.floor(Math.random() * GAME_SIZE)
      }
      
      // 确保食物不会出现在蛇身上
      const onSnake = snake.value.some(
        segment => segment.x === newFood.x && segment.y === newFood.y
      )
      
      if (!onSnake) {
        food.value = newFood
        break
      }
    }
  }

  // 移动函数
  const move = () => {
    if (isGameOver.value || isPaused.value) return

    // 更新方向
    direction.value = nextDirection.value
    
    const head = snake.value[0]
    const newHead = { ...head }

    // 根据方向移动蛇头
    switch (direction.value) {
      case 'UP':
        newHead.y -= 1
        break
      case 'DOWN':
        newHead.y += 1
        break
      case 'LEFT':
        newHead.x -= 1
        break
      case 'RIGHT':
        newHead.x += 1
        break
    }

    // 检查是否撞墙或撞到自己
    if (checkCollision(newHead)) {
      isGameOver.value = true
      return
    }

    // 将新的头部添加到蛇身数组的开头
    snake.value.unshift(newHead)

    // 检查是否吃到食物
    if (checkFood(newHead)) {
      score.value += 10
      generateFood()
    } else {
      // 如果没有吃到食物，移除蛇尾
      snake.value.pop()
    }
  }

  // 处理键盘输入
  const handleKeydown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        if (direction.value !== 'DOWN') nextDirection.value = 'UP'
        break
      case 'ArrowDown':
        if (direction.value !== 'UP') nextDirection.value = 'DOWN'
        break
      case 'ArrowLeft':
        if (direction.value !== 'RIGHT') nextDirection.value = 'LEFT'
        break
      case 'ArrowRight':
        if (direction.value !== 'LEFT') nextDirection.value = 'RIGHT'
        break
      case ' ':  // 空格键暂停/继续
        isPaused.value = !isPaused.value
        break
    }
  }

  // 开始游戏
  const startGame = () => {
    isGameOver.value = false
    isPaused.value = false
    score.value = 0
    snake.value = [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 }
    ]
    direction.value = 'RIGHT'
    nextDirection.value = 'RIGHT'
    generateFood()
    
    if (gameInterval) clearInterval(gameInterval)
    gameInterval = setInterval(move, INITIAL_SPEED)
  }

  // 重置游戏
  const resetGame = () => {
    startGame()
  }

  // 组件挂载时
  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    startGame()
  })

  // 组件卸载时
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    if (gameInterval) clearInterval(gameInterval)
  })

  return {
    snake,
    food,
    score,
    isGameOver,
    isPaused,
    GAME_SIZE,
    startGame,
    resetGame
  }
}
