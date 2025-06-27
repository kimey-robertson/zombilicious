# 🧟 Zombilicious Web Game Plan

This is subject to change.

## 🎯 Goal

Create a web-based multiplayer version of Zombicide with a tile-based draggable/pannable board, fixed UI elements and real-time turn-based gameplay.

---

## 📁 Project Structure

```bash
├── client/ # React front-end
│ ├── components/ # Board, tokens, UI, etc.
│ ├── store/ # State management (Jotai)
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
| State management | Jotai               |
| Multiplayer sync | Socket.IO           |
| Backend runtime  | Node.js             |
| Game logic       | Custom JS game loop |
| Hosting          | Railway             |
| Deployment       | Git + Railway CI/CD |

## 🧠 Core Concepts

### 1. Tile-Based Board

- Rendered with CSS Grid
- Each tile: 3x3 zones + rooms (Zombicide standard)
- Supports panning and zooming

### 2. Survivors and Zombies

- Each token has a unique ID, name, and stats
- Survivors have 3 actions per turn
- Actions can be used to move, attack, or search for items
- Zombies move automatically during their turn

### 3. Game State

- Game state is stored in Jotai
- Game state is synced between server and clients using Socket.IO
