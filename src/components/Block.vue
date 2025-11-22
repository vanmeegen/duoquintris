<template>
  <div class="block" :style="blockStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  x: number;
  y: number;
  shape: number[][]; 
  color?: string; 
  id?: number; 
  theme?: string; 
}>()

// Modern Tetris Colors (vibrant)
const modernColors = [
  'transparent', 
  '#00FFFF', '#FFFF00', '#800080', '#00FF00', 
  '#FF0000', '#0000FF', '#FFA500', '#FF00FF', 
  '#00FF7F', '#DC143C'
];

// Vintage Tetris Colors (muted, retro)
const vintageColors = [
  'transparent', 
  '#8B7355', '#D2B48C', '#A0826D', '#C19A6B', 
  '#8B4513', '#CD853F', '#DEB887', '#F4A460', 
  '#D2691E', '#8B0000'
];

// Cyberpunk Colors (Neon/Industrial)
const cyberpunkColors = [
  'transparent',
  '#fcee0a', // Toxic Yellow
  '#b7410e', // Rust
  '#00f3ff', // Cyan
  '#ff00ff', // Magenta
  '#39ff14', // Neon Green
  '#ff3131', // Neon Red
  '#1b03a3', // Deep Blue
  '#fe019a', // Hot Pink
  '#bc13fe', // Neon Purple
  '#ffffff'  // White
];

// Psychedelic Colors (Vibrant, Trippy)
const psychedelicColors = [
  'transparent',
  '#FF00FF', '#FFFF00', '#00FFFF', '#FF4500',
  '#32CD32', '#9400D3', '#FF1493', '#00BFFF',
  '#7FFF00', '#FF69B4'
];

const colors = computed(() => {
  if (props.theme === 'vintage') return vintageColors;
  if (props.theme === 'cyberpunk') return cyberpunkColors;
  if (props.theme === 'psychedelic') return psychedelicColors;
  return modernColors;
});

const blockStyle = computed(() => {
  const baseColor = props.id ? colors.value[props.id % colors.value.length] : 'blue';
  
  const style: any = {
    top: `${props.y * 20}px`,
    left: `${props.x * 20}px`,
  };

  if (props.theme === 'psychedelic') {
    // Psychedelic effect: Gradient mixing multiple colors
    // We use the ID to offset the gradient so different pieces look different
    const offset = (props.id || 0) * 45; 
    style.background = `linear-gradient(${offset}deg, ${baseColor}, #FF00FF, #FFFF00)`;
    style.backgroundSize = '200% 200%';
    style.border = 'none'; // Remove standard borders for smoother look
    style.borderRadius = '4px';
    style.boxShadow = '0 0 5px rgba(255, 0, 255, 0.5)';
  } else if (props.theme === 'cyberpunk') {
     style.backgroundColor = baseColor;
     style.boxShadow = `0 0 5px ${baseColor}, inset 0 0 5px rgba(0,0,0,0.5)`;
     style.border = '1px solid rgba(255,255,255,0.2)';
  } else {
    style.backgroundColor = baseColor;
  }

  return style;
});
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
  transition: background-color 0.3s;
}
</style>
