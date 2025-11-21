<template>
  <div class="block" :style="{ 
    top: `${y * 20}px`, 
    left: `${x * 20}px`,
    backgroundColor: id ? colors[id] : 'blue'
  }"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  x: number;
  y: number;
  shape: number[][]; // Not used directly for rendering single block, but kept for interface
  color?: string; // Optional override
  id?: number; // Shape ID to determine color
  theme?: string; // Theme for color palette
}>()

// Modern Tetris Colors (vibrant)
const modernColors = [
  'transparent', // 0
  '#00FFFF', // 1: I - Cyan
  '#FFFF00', // 2: O - Yellow
  '#800080', // 3: T - Purple
  '#00FF00', // 4: S - Green
  '#FF0000', // 5: Z - Red
  '#0000FF', // 6: J - Blue
  '#FFA500', // 7: L - Orange
];

// Vintage Tetris Colors (muted, retro)
const vintageColors = [
  'transparent', // 0
  '#8B7355', // 1: Brown
  '#D2B48C', // 2: Tan
  '#A0826D', // 3: Mocha
  '#C19A6B', // 4: Camel
  '#8B4513', // 5: Saddle Brown
  '#CD853F', // 6: Peru
  '#DEB887', // 7: Burlywood
];

const colors = props.theme === 'vintage' ? vintageColors : modernColors;
</script>

<style scoped>
.block {
  width: 20px;
  height: 20px;
  position: absolute;
  box-sizing: border-box;
  border-top: 2px solid rgba(255, 255, 255, 0.5);
  border-left: 2px solid rgba(255, 255, 255, 0.5);
  border-bottom: 2px solid rgba(0, 0, 0, 0.5);
  border-right: 2px solid rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.2);
}
</style>
