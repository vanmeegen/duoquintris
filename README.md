# Duoquintris

A modern two-player Quintris game built with Vue 3 and TypeScript. Play solo or compete with a friend using unique control schemes in this enhanced version of the classic block-stacking puzzle game.

## About the Game

Duoquintris is a Quintris variant that uses **pentominoes** (5-block pieces) instead of the traditional tetrominoes (4-block pieces). This makes the game more challenging and strategic, as the larger pieces require more careful planning and positioning.

The game supports both **single-player** and **two-player** modes, with Player 1 using keyboard controls and Player 2 using an innovative mouse-based control scheme.

### Features

🎮 **Dual Control Schemes**
- **Player 1 (Keyboard)**: Arrow keys to move, Up to rotate, Space to hard drop
- **Player 2 (Mouse)**: Mouse movement to position horizontally, Click to rotate, Right-click to hard drop

🎨 **Theme Selection**
- **Modern Theme**: Sleek glassmorphism design with vibrant colors and cosmic background
- **Vintage Theme**: Retro aesthetic with sepia tones, muted colors, and vintage paper background

🎯 **Game Modes**
- **Single Player**: Focus on your own high score
- **Two Player**: Compete side-by-side with a friend

🧩 **10 Pentomino Shapes**
- F, I, L, N, P, U, V, W, Y, Z pentominoes
- Each piece consists of 5 connected blocks
- More challenging than traditional Tetris pieces

📊 **Scoring & Progression**
- Score points by clearing lines
- Level up every 10 lines cleared
- Game speed increases with each level
- Bonus points for clearing multiple lines simultaneously

🎭 **Visual Polish**
- 3D block effects with beveled edges
- Smooth animations
- Glassmorphism UI elements
- Theme-specific color palettes
- Game over overlay with state freeze

## Technical Overview

### Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Scoped CSS with theme system

### Project Structure

```
duotetris/
├── src/
│   ├── components/
│   │   ├── Block.vue      # Individual block rendering with theme support
│   │   └── Board.vue      # Game board grid component
│   ├── utils/
│   │   └── useKeyEvent.ts # Keyboard event handling composable
│   ├── App.vue            # Main game logic and state management
│   ├── main.ts            # Application entry point
│   └── style.css          # Global styles
├── public/
│   ├── bg.png             # Modern theme background
│   └── vintage-bg.png     # Vintage theme background
├── pentominoes.md         # Pentomino shapes documentation
└── package.json
```

### Key Components

**App.vue**
- Game state management (two independent player states)
- Game loop using `requestAnimationFrame`
- Collision detection and piece placement
- Line clearing and scoring logic
- Theme and mode selection

**Block.vue**
- Renders individual blocks with theme-aware colors
- 3D visual effects using CSS box-shadow
- Supports both modern (vibrant) and vintage (muted) color palettes

**Board.vue**
- Pure presentational component
- Renders the game grid by composing Block components
- Receives board state as props

### Game Mechanics

- **Board Size**: 10 columns × 20 rows
- **Piece Generation**: Random selection from 10 pentominoes
- **Rotation**: 90-degree clockwise rotation with collision detection
- **Gravity**: Pieces drop automatically at intervals that decrease with level
- **Line Clearing**: Full rows are removed and board shifts down
- **Game Over**: Triggered when a new piece cannot be placed

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Controls Reference

| Action | Player 1 (Keyboard) | Player 2 (Mouse) |
|--------|---------------------|------------------|
| Move Left/Right | ← → Arrow Keys | Mouse Movement |
| Rotate | ↑ Up Arrow | Left Click |
| Soft Drop | ↓ Down Arrow | - |
| Hard Drop | Space | Right Click |

## License

This project is open source and available under the MIT License.
