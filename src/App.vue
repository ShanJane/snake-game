<template>
  <div class="game-container">
    <div class="game-info">
      <div class="score">得分: {{ score }}</div>
      <div v-if="score >= 30" class="congratulation">
        周浩杰你真棒
      </div>
      <div v-if="isGameOver" class="game-over">
        游戏结束!
        <button @click="resetGame">重新开始</button>
      </div>
      <div v-if="isPaused" class="paused">已暂停</div>
    </div>

    <div 
      class="game-board"
      :style="{ 
        gridTemplateColumns: `repeat(${GAME_SIZE}, 20px)`,
        gridTemplateRows: `repeat(${GAME_SIZE}, 20px)`
      }"
    >
      <template v-for="y in GAME_SIZE" :key="y">
        <div
          v-for="x in GAME_SIZE"
          :key="`${x}-${y}`"
          class="cell"
          :class="{
            'snake': isSnake(x-1, y-1),
            'food': isFood(x-1, y-1)
          }"
        ></div>
      </template>
    </div>

    <div class="controls">
      <p>控制说明:</p>
      <ul>
        <li>方向键控制移动</li>
        <li>空格键暂停/继续</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSnake } from './composables/useSnake'

const {
  snake,
  food,
  score,
  isGameOver,
  isPaused,
  GAME_SIZE,
  resetGame
} = useSnake()

// 检查某个位置是否是蛇身
const isSnake = (x: number, y: number) => {
  return snake.value.some(segment => segment.x === x && segment.y === y)
}

// 检查某个位置是否是食物
const isFood = (x: number, y: number) => {
  return food.value.x === x && food.value.y === y
}
</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.game-info {
  margin-bottom: 20px;
  text-align: center;
}

.score {
  font-size: 24px;
  margin-bottom: 10px;
}

.congratulation {
  font-size: 24px;
  color: red;
  font-weight: bold;
  margin: 10px 0;
  animation: blink 1s infinite;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.game-over, .paused {
  font-size: 20px;
  color: red;
  margin-bottom: 10px;
}

.game-board {
  display: grid;
  gap: 1px;
  background-color: #ccc;
  border: 1px solid #999;
  padding: 1px;
}

.cell {
  width: 20px;
  height: 20px;
  background-color: white;
}

.snake {
  background-color: #4CAF50;
}

.food {
  background-color: #f44336;
  border-radius: 50%;
}

.controls {
  margin-top: 20px;
  text-align: center;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  cursor: pointer;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  margin-top: 10px;
}

button:hover {
  background-color: #45a049;
}
</style>