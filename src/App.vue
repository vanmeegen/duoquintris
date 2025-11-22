<template>
  <div class="game-container" :class="`theme-${selectedTheme}`" :style="getBackgroundStyle()">
    
    <!-- Showcase Overlay -->
    <div v-if="showcaseMode" class="showcase-overlay glass-panel">
      <h1>Quintris Shape Selection</h1>
      <p>Please review the shapes below and tell me which ones to include.</p>
      <div class="showcase-grid">
        <div v-for="(shape, index) in PENTOMINOES" :key="index" class="showcase-item">
          <h3>{{ PENTOMINO_NAMES[index] }}</h3>
          <div class="mini-board">
            <Board :board="createMiniBoard(shape, (index % 7) + 1)" />
          </div>
        </div>
      </div>
      <button @click="showcaseMode = false" class="glass-btn">Close Showcase (Dev)</button>
    </div>

    <div class="controls" v-else>
      <div v-if="!gameStarted && !gameOver" class="mode-selector">
        <div class="selector-group">
          <div class="selector-item">
            <h3>Mode:</h3>
            <div class="mode-buttons">
              <button @click="twoPlayerMode = false" :class="['glass-btn', { 'active': !twoPlayerMode }]">1 Player</button>
              <button @click="twoPlayerMode = true" :class="['glass-btn', { 'active': twoPlayerMode }]">2 Players</button>
            </div>
          </div>
          <div class="selector-item">
            <h3>Theme:</h3>
            <select v-model="selectedTheme" class="theme-select glass-btn">
              <option value="modern">Modern</option>
              <option value="vintage">Vintage</option>
              <option value="cyberpunk">Cyberpunk</option>
              <option value="psychedelic">Psychedelic</option>
            </select>
          </div>
        </div>
      </div>
      <button v-if="!gameStarted && !gameOver" @click="startGame" class="glass-btn">Start Game</button>
      <button v-if="gameOver" @click="startGame" class="glass-btn">New Game</button>
      <button v-if="gameStarted && !gameOver" @click="resetGame" class="glass-btn">Reset Game</button>
    </div>
    
    <div class="boards" v-if="!showcaseMode">
      <div class="player-section glass-panel">
        <h2>Player 1 (Keyboard)</h2>
        <div class="stats">
          <div>Score: {{ player1.score }}</div>
          <div>Level: {{ player1.level }}</div>
        </div>
        <Board :board="getDisplayBoard(player1)" :theme="selectedTheme" />
      </div>
      <div v-if="twoPlayerMode" class="player-section glass-panel">
        <h2>Player 2 (Mouse)</h2>
        <div class="stats">
          <div>Score: {{ player2.score }}</div>
          <div>Level: {{ player2.level }}</div>
        </div>
        <div class="mouse-board-area" ref="player2BoardRef" @mousemove="handleMouseMove" @click="handleMouseClick" @contextmenu.prevent="handleRightClick">
          <Board :board="getDisplayBoard(player2)" :theme="selectedTheme" />
        </div>
      </div>
    </div>
    <div v-if="gameOver && !showcaseMode" class="game-over-overlay">
      <h1>Game Over</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import Board from './components/Board.vue';
import { ref, onUnmounted } from 'vue';
import { useKeyEvent } from './utils/useKeyEvent';

// Types
type GameBoard = number[][];
type Shape = number[][];
interface Block {
  x: number;
  y: number;
  shape: Shape;
}

interface PlayerState {
  board: GameBoard;
  currentPiece: Block | null;
  score: number;
  level: number;
  linesCleared: number;
  lastDropTime: number;
  dropInterval: number;
}

// Constants
const ROWS = 20;
const COLS = 10;

// Pentominoes (5-block pieces)
// Removed T and X pentominoes as they make the game too difficult
const PENTOMINO_NAMES = ['F', 'I', 'L', 'N', 'P', 'U', 'V', 'W', 'Y', 'Z'];
const PENTOMINOES = [
  [[0, 1, 1], [1, 1, 0], [0, 1, 0]], // F
  [[1], [1], [1], [1], [1]], // I
  [[1, 0], [1, 0], [1, 0], [1, 1]], // L
  [[0, 1], [0, 1], [1, 1], [1, 0]], // N
  [[1, 1], [1, 1], [1, 0]], // P
  [[1, 0, 1], [1, 1, 1]], // U
  [[1, 0, 0], [1, 0, 0], [1, 1, 1]], // V
  [[1, 0, 0], [1, 1, 0], [0, 1, 1]], // W
  [[0, 1], [1, 1], [0, 1], [0, 1]], // Y
  [[1, 1, 0], [0, 1, 0], [0, 1, 1]], // Z
];

// Active shapes for the game
const SHAPES = PENTOMINOES; 

// State
const selectedTheme = ref('modern'); // Theme selection
const twoPlayerMode = ref(true); // Default to two player mode
const showcaseMode = ref(false); // Showcase disabled, using pentominoes now
const gameStarted = ref(false);
const gameOver = ref(false);
const animationFrameId = ref<number | null>(null);
const player2BoardRef = ref<HTMLElement | null>(null);

const createPlayerState = (): PlayerState => ({
  board: createEmptyBoard(),
  currentPiece: null,
  score: 0,
  level: 1,
  linesCleared: 0,
  lastDropTime: 0,
  dropInterval: 1000,
});

const player1 = ref<PlayerState>(createPlayerState());
const player2 = ref<PlayerState>(createPlayerState());

// Showcase Helper
function createMiniBoard(shape: Shape, colorId: number): GameBoard {
  const rows = 5;
  const cols = 5;
  const board = Array(rows).fill(null).map(() => Array(cols).fill(0));
  
  // Center the shape
  const shapeH = shape.length;
  const shapeW = shape[0].length;
  const startY = Math.floor((rows - shapeH) / 2);
  const startX = Math.floor((cols - shapeW) / 2);
  
  shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        board[startY + r][startX + c] = colorId;
      }
    });
  });
  
  return board;
}

// Theme background helper
function getBackgroundStyle() {
  if (selectedTheme.value === 'vintage') {
    return { backgroundImage: 'url(/vintage-bg.png)' };
  }
  if (selectedTheme.value === 'cyberpunk') {
    return { backgroundImage: 'url(/cyberpunk-bg.png)' };
  }
  if (selectedTheme.value === 'psychedelic') {
    return { backgroundImage: 'url(/psychedelic-bg.png)' };
  }
  return { backgroundImage: 'url(/bg.png)' };
}

// Game Loop
function startGame() {
  resetGame();
  gameStarted.value = true;
  gameOver.value = false;
  
  player1.value.currentPiece = generatePiece();
  if (twoPlayerMode.value) {
    player2.value.currentPiece = generatePiece();
  }
  
  player1.value.lastDropTime = performance.now();
  if (twoPlayerMode.value) {
    player2.value.lastDropTime = performance.now();
  }

  gameLoop();
}

function gameLoop() {
  if (!gameStarted.value) return;

  const now = performance.now();
  updatePlayer(player1.value, now);
  if (twoPlayerMode.value) {
    updatePlayer(player2.value, now);
  }

  animationFrameId.value = requestAnimationFrame(gameLoop);
}

function updatePlayer(player: PlayerState, now: number) {
  if (!player.currentPiece) return;

  if (now - player.lastDropTime > player.dropInterval) {
    movePiece(player, 0, 1);
    player.lastDropTime = now;
  }
}

function resetGame() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
  gameStarted.value = false;
  gameOver.value = false;
  player1.value = createPlayerState();
  player2.value = createPlayerState();
}

function endGame() {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value);
    animationFrameId.value = null;
  }
  gameStarted.value = false;
  gameOver.value = true;
}

// Core Logic
function createEmptyBoard(): GameBoard {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function generatePiece(): Block {
  const randomIndex = Math.floor(Math.random() * SHAPES.length);
  return {
    x: Math.floor(COLS / 2) - 1,
    y: 0,
    shape: SHAPES[randomIndex]
  };
}

function movePiece(player: PlayerState, dx: number, dy: number): boolean {
  if (!player.currentPiece) return false;

  const newX = player.currentPiece.x + dx;
  const newY = player.currentPiece.y + dy;

  if (hasCollision(player.board, player.currentPiece.shape, newX, newY)) {
    if (dy > 0) { // Landed
      placePiece(player);
    }
    return false;
  }

  player.currentPiece.x = newX;
  player.currentPiece.y = newY;
  return true;
}

function rotatePiece(player: PlayerState) {
  if (!player.currentPiece) return;

  const currentShape = player.currentPiece.shape;
  const newShape = currentShape[0].map((_, index) =>
    currentShape.map(row => row[index]).reverse()
  );

  if (!hasCollision(player.board, newShape, player.currentPiece.x, player.currentPiece.y)) {
    player.currentPiece.shape = newShape;
  }
}

function hasCollision(board: GameBoard, shape: Shape, x: number, y: number): boolean {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (!shape[row][col]) continue;

      const newX = x + col;
      const newY = y + row;

      if (newX < 0 || newX >= COLS || newY >= ROWS) return true;
      if (newY >= 0 && board[newY][newX] !== 0 && board[newY][newX] < 10) return true;
    }
  }
  return false;
}

function placePiece(player: PlayerState) {
  if (!player.currentPiece) return;

  player.currentPiece.shape.forEach((row, y) => {
    row.forEach((val, x) => {
      if (val) {
        const boardY = player.currentPiece!.y + y;
        const boardX = player.currentPiece!.x + x;
        if (boardY >= 0 && boardY < ROWS && boardX >= 0 && boardX < COLS) {
           player.board[boardY][boardX] = val; 
        }
      }
    });
  });

  checkAndClearRows(player);
  player.currentPiece = generatePiece();
  
  if (hasCollision(player.board, player.currentPiece.shape, player.currentPiece.x, player.currentPiece.y)) {
    endGame();
  }
}

function checkAndClearRows(player: PlayerState) {
  let rowsCleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    if (player.board[y].every(cell => cell !== 0)) {
      player.board.splice(y, 1);
      player.board.unshift(Array(COLS).fill(0));
      rowsCleared++;
      y++;
    }
  }
  
  if (rowsCleared > 0) {
    updateScore(player, rowsCleared);
  }
}

function updateScore(player: PlayerState, lines: number) {
  player.linesCleared += lines;
  
  const basePoints = [0, 40, 100, 300, 1200];
  player.score += basePoints[lines] * player.level;
  
  // Level up every 10 lines
  const newLevel = Math.floor(player.linesCleared / 10) + 1;
  if (newLevel > player.level) {
    player.level = newLevel;
    // Speed up: decrease interval by 10% per level, min 100ms
    player.dropInterval = Math.max(100, 1000 * Math.pow(0.9, player.level - 1));
  }
}

function getDisplayBoard(player: PlayerState): GameBoard {
  const display = player.board.map(row => [...row]);
  
  if (player.currentPiece) {
    const { x, y, shape } = player.currentPiece;
    shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val) {
          const newY = y + r;
          const newX = x + c;
          if (newY >= 0 && newY < ROWS && newX >= 0 && newX < COLS) {
            display[newY][newX] = val;
          }
        }
      });
    });
  }
  return display;
}

function dropPiece(player: PlayerState) {
  if (!player.currentPiece) return;
  while (movePiece(player, 0, 1)) {}
}

// Input Handling
useKeyEvent('keydown', 'ArrowLeft', (e) => { 
  if (!gameStarted.value) return;
  e.preventDefault(); 
  movePiece(player1.value, -1, 0); 
});
useKeyEvent('keydown', 'ArrowRight', (e) => { 
  if (!gameStarted.value) return;
  e.preventDefault(); 
  movePiece(player1.value, 1, 0); 
});
useKeyEvent('keydown', 'ArrowDown', (e) => { 
  if (!gameStarted.value) return;
  e.preventDefault(); 
  movePiece(player1.value, 0, 1); 
});
useKeyEvent('keydown', 'ArrowUp', (e) => { 
  if (!gameStarted.value) return;
  e.preventDefault(); 
  rotatePiece(player1.value); 
});
useKeyEvent('keydown', ' ', (e) => { 
  if (!gameStarted.value) return;
  e.preventDefault(); 
  dropPiece(player1.value); 
});

function handleMouseMove(e: MouseEvent) {
  if (!gameStarted.value || !player2.value.currentPiece || !player2BoardRef.value) return;
  
  const rect = player2BoardRef.value.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  const colWidth = rect.width / COLS;
  const targetCol = Math.floor(relativeX / colWidth);
  
  const safeCol = Math.max(0, Math.min(COLS - player2.value.currentPiece.shape[0].length, targetCol));
  
  const dx = safeCol - player2.value.currentPiece.x;
  if (dx !== 0) {
    movePiece(player2.value, dx, 0);
  }
}

function handleMouseClick(e: MouseEvent) {
  if (!gameStarted.value) return;
  rotatePiece(player2.value);
}

function handleRightClick(e: MouseEvent) {
  if (!gameStarted.value) return;
  e.preventDefault();
  dropPiece(player2.value);
}

onUnmounted(() => {
  if (animationFrameId.value) cancelAnimationFrame(animationFrameId.value);
});

</script>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
}

.controls {
  margin-bottom: 20px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.mode-selector {
  text-align: center;
}

.selector-group {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  justify-content: center;
}

.selector-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.mode-selector h3 {
  margin: 0 0 10px 0;
  font-size: 1.1em;
}

.mode-buttons {
  display: flex;
  gap: 10px;
}

.theme-select {
  padding: 8px 15px;
  font-size: 1em;
  cursor: pointer;
  min-width: 120px;
}

.theme-select option {
  color: #333;
  background-color: white;
}

.glass-btn.active {
  background: rgba(100, 200, 255, 0.4);
  border: 2px solid rgba(100, 200, 255, 0.6);
}

.boards {
  display: flex;
  gap: 50px;
}

.player-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 10px;
  font-size: 1.2em;
  font-weight: bold;
}

.mouse-board-area {
  cursor: none;
}

.game-over-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  pointer-events: none;
}

.game-over-overlay h1 {
  font-size: 4em;
  color: #ff0055;
  text-shadow: 0 0 20px #ff0055;
}

/* Showcase Styles */
.showcase-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 20;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

.showcase-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  margin: 20px 0;
  max-width: 90%;
}

.showcase-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 8px;
}

.mini-board {
  /* Scale down the board for showcase */
  transform: scale(0.7);
}

/* Glassmorphism */
.glass-panel {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.glass-btn {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 10px 20px;
  font-size: 1.2em;
  cursor: pointer;
  border-radius: 5px;
  transition: background 0.3s;
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Vintage Theme Overrides */
.theme-vintage {
  color: #3E2723;
}

.theme-vintage .glass-panel {
  background: rgba(139, 115, 85, 0.3);
  border: 2px solid rgba(101, 67, 33, 0.5);
}

.theme-vintage .glass-btn {
  background: rgba(139, 115, 85, 0.4);
  border: 1px solid rgba(101, 67, 33, 0.6);
  color: #3E2723;
}

.theme-vintage .glass-btn:hover {
  background: rgba(139, 115, 85, 0.6);
}

.theme-vintage .glass-btn.active {
  background: rgba(160, 130, 109, 0.6);
  border: 2px solid rgba(101, 67, 33, 0.8);
}

.theme-vintage .game-over-overlay h1 {
  color: #8B4513;
  text-shadow: 0 0 20px #8B4513;
}

.theme-vintage h2,
.theme-vintage h3 {
  color: #3E2723;
}

/* Cyberpunk (Mad Max Style) Theme Overrides */
.theme-cyberpunk {
  color: #fcee0a; /* Toxic Yellow */
  text-shadow: 0 0 5px rgba(252, 238, 10, 0.5);
  font-family: 'Courier New', Courier, monospace; /* More industrial feel */
}

.theme-cyberpunk .glass-panel {
  background: rgba(30, 20, 10, 0.8);
  border: 2px solid #b7410e; /* Rust */
  box-shadow: 0 0 15px rgba(183, 65, 14, 0.3), inset 0 0 30px rgba(0, 0, 0, 0.8);
}

.theme-cyberpunk .glass-btn {
  background: rgba(50, 30, 20, 0.8);
  border: 1px solid #fcee0a;
  color: #fcee0a;
  text-shadow: 0 0 3px rgba(252, 238, 10, 0.5);
  box-shadow: 0 0 5px rgba(183, 65, 14, 0.4);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.theme-cyberpunk .glass-btn:hover {
  background: rgba(183, 65, 14, 0.4); /* Rust hover */
  box-shadow: 0 0 15px rgba(252, 238, 10, 0.4);
  color: #fff;
}

.theme-cyberpunk .glass-btn.active {
  background: rgba(183, 65, 14, 0.6);
  border: 2px solid #fcee0a;
  color: #fff;
  box-shadow: 0 0 20px rgba(183, 65, 14, 0.6);
}

.theme-cyberpunk .theme-select {
  background: rgba(20, 10, 5, 0.9);
  border: 1px solid #b7410e;
  color: #fcee0a;
}

.theme-cyberpunk .game-over-overlay h1 {
  color: #fcee0a;
  text-shadow: 0 0 10px #b7410e, 0 0 20px #b7410e;
}

.theme-cyberpunk h2,
.theme-cyberpunk h3 {
  color: #fcee0a;
  text-transform: uppercase;
  letter-spacing: 3px;
  border-bottom: 1px solid #b7410e;
  padding-bottom: 5px;
}

/* Psychedelic Theme Overrides */
.theme-psychedelic {
  color: #FFD700; /* Gold/Yellow */
  text-shadow: 2px 2px 0px #FF00FF; /* Magenta shadow */
  font-family: 'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', sans-serif; /* Playful font */
}

.theme-psychedelic .glass-panel {
  background: rgba(75, 0, 130, 0.6); /* Indigo */
  border: 3px solid #FF00FF; /* Magenta */
  border-radius: 20px; /* Extra rounded */
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
}

.theme-psychedelic .glass-btn {
  background: rgba(255, 20, 147, 0.6); /* Deep Pink */
  border: 2px solid #FFFF00; /* Yellow */
  color: #FFFF00;
  border-radius: 25px;
  font-weight: bold;
  text-shadow: 1px 1px 0 #000;
}

.theme-psychedelic .glass-btn:hover {
  background: rgba(255, 255, 0, 0.6); /* Yellow */
  color: #FF00FF; /* Magenta */
  border-color: #FF00FF;
  transform: scale(1.05);
}

.theme-psychedelic .glass-btn.active {
  background: #FF00FF;
  color: #FFFF00;
  box-shadow: 0 0 20px #FFFF00;
}

.theme-psychedelic .theme-select {
  background: rgba(75, 0, 130, 0.8);
  border: 2px solid #FF00FF;
  color: #FFFF00;
  border-radius: 15px;
}

.theme-psychedelic .game-over-overlay h1 {
  color: #FFFF00;
  text-shadow: 3px 3px 0 #FF00FF, 6px 6px 0 #00FFFF;
  font-style: italic;
}

.theme-psychedelic h2,
.theme-psychedelic h3 {
  color: #00FFFF; /* Cyan */
  text-shadow: 2px 2px 0 #FF00FF;
}
</style>
