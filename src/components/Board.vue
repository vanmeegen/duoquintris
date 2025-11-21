<template>
  <div class="board">
    <template v-for="(row, rowIndex) in board" :key="rowIndex">
      <div class="row" v-for="(cell, colIndex) in row" :key="colIndex">
        <Block v-if="cell"
               :x="colIndex"
               :y="rowIndex"
               :shape="shapes[cell - 1]"
               :id="cell"
               :theme="theme" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import Block from './Block.vue';

defineProps<{
  board: number[][]; // Using number[][] instead of Board type for simplicity or import it if available
  theme?: string; // Theme prop to pass to blocks
}>();

const shapes = [
  [[1]], // Line shape representation
  [[2, 2], [2, 2]], // Square shape
  [[0, 3, 3], [3, 3, 0]], // L-shape
];
</script>

<style scoped>
.board {
  border: 2px solid black;
  width: 200px;
  height: 400px;
  position: relative;
}

.row {
  display: flex;
}
</style>
