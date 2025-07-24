# 🧟 Zombilicious

A web-based multiplayer zombie survival game featuring real-time turn-based gameplay, tile-based board mechanics, and comprehensive lobby system.

## 🎮 What is Zombilicious?

Zombilicious is a tactical zombie survival game where players cooperate to survive waves of undead. Features include:

- **Real-time multiplayer** with up to 4 players
- **Turn-based tactical gameplay** with 8 different action types
- **Tile-based board** with pan/zoom controls and interactive zones
- **Advanced zombie AI** with pathfinding and line-of-sight mechanics
- **Inventory management** with drag-and-drop card system
- **Lobby system** with reconnection and vote-kick features

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kimey-robertson/zombilicious.git
   cd zombilicious
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start development servers**

   ```bash
   # Terminal 1: Start the server (runs on port 8000)
   npm start

   # Terminal 2: Start the client (runs on port 5173)
   cd client
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Create or join a game lobby
   - Start playing!

## 📦 Tech Stack

| Component               | Technology                               |
| ----------------------- | ---------------------------------------- |
| Frontend                | React 19, TypeScript, Vite, Tailwind CSS |
| Backend                 | Node.js, Express, Socket.IO              |
| State Management        | Zustand                                  |
| Real-time Communication | Socket.IO                                |
| Deployment              | Railway                                  |

## 🏗️ Project Structure

```
zombilicious/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── store/         # State management
│   │   ├── hooks/         # Custom React hooks
│   │   └── assets/        # Game assets
├── server/                # Node.js backend
│   ├── game/             # Game logic & mechanics
│   ├── lobby/            # Lobby management
│   ├── maps/             # Game maps & AI
│   └── utils/            # Utilities & helpers
├── shared/               # Shared TypeScript types
└── DOCUMENTATION.md      # Comprehensive documentation
```

## 🎯 Game Features

### Core Gameplay

- **8 Action Types**: Search, Move, Door, Inventory, Melee, Ranged, Take Objective, Make Noise
- **Turn-based Combat**: Dice-based damage system with multiple weapon types
- **Health System**: 2-hit survival with item loss on damage
- **Win Conditions**: Collect objective tokens to victory

### Multiplayer Features

- **Lobby System**: Create/join games with real-time updates
- **Disconnection Handling**: 10-minute grace period with reconnection
- **Vote Kick**: Democratic player removal system
- **Real-time Sync**: All game events synchronized across players

### Technical Features

- **Responsive Design**: Works on desktop and mobile
- **Error Handling**: Comprehensive error system with user feedback
- **Development Mode**: Debug tools and testing utilities

## 🎮 How to Play

1. **Enter your player name** and create or join a lobby
2. **Wait for players** (2-4 players) and ready up
3. **Take turns** using your 3 actions per turn:
   - Move between zones
   - Search for items in buildings
   - Fight zombies with melee or ranged weapons
   - Open doors and collect objectives
4. **Survive the zombie hordes** and collect objective tokens to win!

## 📖 Documentation

For comprehensive documentation including:

- Complete API reference
- Game mechanics deep-dive
- Architecture details

See **[DOCUMENTATION.md](./DOCUMENTATION.md)**

## 🚀 Deployment

The game is configured for Railway deployment with automatic build and deployment.

---

**Ready to survive the zombie apocalypse?** 🧟‍♂️

Start a game at [zombilicious-production.up.railway.app](https://zombilicious-production.up.railway.app/) or run locally following the setup instructions above!
