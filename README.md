# 🧟 Zombilicious Web Game Plan

This is subject to change.

## 🎯 Goal

Create a web-based multiplayer version of Zombicide with a tile-based draggable/pannable board, fixed UI elements and real-time turn-based gameplay.

---

## 📁 Project Structure

```bash
├── client/ # React front-end
│ ├── components/ # Board, tokens, UI, etc.
│ ├── store/ # State management (Zustand)
│ ├── assets/ # Tile images, tokens
│ └── App.tsx
├── server/ # Node.js backend (Socket.IO)
│ ├── gameManager.ts # Turn logic, game state
│ └── index.ts
├── shared/ # Shared types/interfaces
├── railway.json # Deployment config
└── README.md
```

## 📦 Tech Stack

| Feature          | Stack/Tool          | Notes                 |
| ---------------- | ------------------- | --------------------- |
| UI rendering     | React + CSS Grid    | Might use Konva later |
| State management | Zustand             |
| Multiplayer sync | Socket.IO           |
| Backend runtime  | Node.js             |
| Game logic       | Custom JS game loop |
| Hosting          | Railway             |
| Deployment       | Git + Railway CI/CD |

## 🧠 Core Concepts

### 1. Tile-Based Board

- Rendered with CSS Grid
- Each tile: 3x3 cells + rooms (Zombicide standard). Zones are formed by the cells and rooms, and may span multiple tiles.
- Supports panning and zooming. Hold space to pan, and scroll to zoom.

### 2. Survivors and Zombies

- Each token has a unique ID, name, and stats
- Survivors have 3 actions per turn
- Actions can be used to move, attack, or search for items
- Zombies move automatically during their turn

### 3. Game State

- Game state is stored in Zustand.
- There are 2 state stores, one for the game state, which is shared between all players and synced to the server, and one for the player state, which is unique to each player.
- Game state is synced between server and clients using Socket.IO
