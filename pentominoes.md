# Pentominoes

This document describes the 12 pentomino shapes used in Quintris. Each pentomino is composed of 5 connected blocks.

## Selected Shapes

10 pentominoes have been selected for use in the game (X and T removed for difficulty balance):

### F - F Pentomino
```
 ██
██ 
 █ 
```

### I - I Pentomino (Straight Line)
```
█
█
█
█
█
```

### L - L Pentomino
```
█ 
█ 
█ 
██
```

### N - N Pentomino
```
 █
 █
██
█ 
```

### P - P Pentomino
```
██
██
█ 
```

### U - U Pentomino
```
█ █
███
```

### V - V Pentomino
```
█  
█  
███
```

### W - W Pentomino
```
█  
██ 
 ██
```

### Y - Y Pentomino
```
 █
██
 █
 █
```

### Z - Z Pentomino
```
██ 
 █ 
 ██
```

## Implementation Details

Each pentomino is represented as a 2D array in the code:
- `1` represents a filled block
- `0` represents an empty space

The shapes can be rotated during gameplay using the standard rotation controls.

## Game Mechanics

- **Player 1 (Keyboard)**: Arrow keys to move, Up to rotate, Space to hard drop
- **Player 2 (Mouse)**: Mouse movement to position, Click to rotate, Right-click to hard drop
- Pieces are randomly selected from 10 pentominoes (F, I, L, N, P, U, V, W, Y, Z)
- Clearing 5 lines simultaneously awards maximum points
- Game speed increases with each level (every 10 lines cleared)
