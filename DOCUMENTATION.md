# 🧟 Zombilicious Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Application Flow](#application-flow)
4. [Socket Communication System](#socket-communication-system)
5. [State Management](#state-management)
6. [UI Components](#ui-components)
7. [Game Board System](#game-board-system)
8. [Game Features](#game-features)
9. [Development Features](#development-features)
10. [Technical Details](#technical-details)
11. [Future Plans](#future-plans)

---

## 🎯 <a id="project-overview"></a> Project Overview

**Zombilicious** is a web-based multiplayer zombie survival game featuring:

- Tile-based draggable/pannable board with CSS Grid
- Real-time turn-based gameplay with Socket.IO synchronization
- Comprehensive lobby system with player management
- Advanced disconnection handling and reconnection features
- Fixed UI elements with responsive design
- Modern React frontend with TypeScript

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Zustand
- **Backend**: Node.js + Express + Socket.IO + TypeScript
- **State Management**: Zustand (4 stores)
- **Real-time Communication**: Socket.IO with separate lobby/game channels
- **UI Libraries**: React Hot Toast, React Icons
- **Build Tool**: Vite with hot reload
- **Deployment**: Railway (planned)

### Current Status

✅ **Completed Features:**

- Full lobby system with real-time updates
- Game creation and management
- Player disconnection/reconnection handling
- Vote kick system for disconnected players
- Tile-based game board with zones
- Pan/zoom/rotate board controls
- Action button system (UI mockup)
- Development mode with debugging tools

🚧 **In Progress:**

- Game mechanics implementation
- Token system for survivors and zombies
- Inventory and combat systems

---

## 🏗️ <a id="architecture"></a> Architecture

### Project Structure

```
zombilicious/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components organized by feature
│   │   │   ├── Home/       # Lobby system components
│   │   │   ├── GameBoard/  # Game board and tiles
│   │   │   ├── Overlay/    # UI overlay components
│   │   │   ├── DevMode/    # Development tools
│   │   │   └── UI/         # Reusable UI components
│   │   ├── store/         # Zustand state management (4 stores)
│   │   ├── hooks/         # Custom React hooks
│   │   └── assets/        # Static assets (images, tiles)
├── server/                # Node.js backend
│   ├── index.ts          # Server entry point
│   ├── config.ts         # Server configuration
│   ├── lobby/            # Lobby management
│   │   ├── lobbyManager.ts
│   │   └── lobbySocketHandlers.ts
│   ├── game/             # Game management
│   │   ├── gameManager.ts
│   │   └── gameSocketHandlers.ts
│   ├── maps.ts           # Game map configurations
│   └── utils.ts          # Server utilities
├── shared/               # Shared TypeScript types
└── tsconfig.json        # Root TypeScript config
```

### Key Design Patterns

- **Modular architecture** with separate lobby and game systems
- **Four-store state management** using Zustand
- **Real-time synchronization** via Socket.IO with room-based events
- **Type safety** with comprehensive shared TypeScript interfaces
- **Separation of concerns** between UI, game logic, and networking

---

## <a id="application-flow"></a> 📱 Application Flow

### 1. Entry Point

- User lands on `Home` component
- Must enter player name (1-24 characters)
- Options: "Create Game" or "Join Game"
- Automatic reconnection prompt if player has disconnected game

### 2. Lobby System

**Creating a Lobby:**

- `HomeButtons` → `LobbyScreen`
- Creates random 4-character lobby ID
- Host gets `isHost: true` and `isReady: true`
- Real-time lobby updates via Socket.IO

**Joining a Lobby:**

- `HomeButtons` → `JoinLobbiesScreen` → `LobbyScreen`
- Browse available lobbies with player counts
- Join validation (max 4 players)
- Real-time lobby synchronization

**Lobby Management:**

- **Host powers**: Change game name, delete lobby, start game
- **Player powers**: Toggle ready status, leave lobby
- **Real-time updates**: All changes broadcast instantly

### 3. Game Transition

- Host starts game when all players ready
- Lobby converts to game with same ID
- Players automatically join game room
- `GameWrapper` component loads with full game interface

### 4. Game Flow

- **Active Game**: Full game board with interaction
- **Disconnection Handling**: Automatic pause with timer
- **Vote Kick System**: Remaining players can vote to remove
- **Reconnection**: Automatic popup for returning players

### 5. Exit Flows

- **Leave Game**: Return to lobby system
- **Disconnection**: Automatic cleanup and reconnection options
- **Host Transfer**: Automatic in lobbies if host leaves

---

## <a id="socket-communication-system"></a> 🔌 Socket Communication System

### Connection Architecture

- **Client**: Singleton socket via `getSocket()` in `socket.ts`
- **Server**: Modular socket handlers for lobby and game events
- **Rooms**: Automatic room management for lobbies and games
- **Reconnection**: Exponential backoff (1s-5s, max 5 attempts)

### Event Categories

#### Lobby Events

| Event                          | Direction        | Purpose             | Data                            |
| ------------------------------ | ---------------- | ------------------- | ------------------------------- |
| `create-game-lobby`            | Client → Server  | Create new lobby    | `{playerName: string}`          |
| `delete-game-lobby`            | Client → Server  | Delete lobby (host) | `lobbyId: string`               |
| `join-lobby`                   | Client → Server  | Join existing lobby | `{lobbyId, playerName}`         |
| `leave-lobby`                  | Client → Server  | Leave lobby         | `lobbyId: string`               |
| `fetch-lobbies`                | Client → Server  | Get all lobbies     | None                            |
| `toggle-is-ready-lobby-player` | Client → Server  | Toggle ready status | `playerId: string`              |
| `change-game-name-lobby`       | Client → Server  | Update game name    | `{lobbyId, gameName, playerId}` |
| `lobby-updated`                | Server → Clients | Lobby state changed | `{lobbyId, gameName, players}`  |
| `lobby-deleted`                | Server → Clients | Lobby removed       | `{lobbyId}`                     |

#### Game Events

| Event                             | Direction        | Purpose                    | Data                                              |
| --------------------------------- | ---------------- | -------------------------- | ------------------------------------------------- |
| `create-game`                     | Client → Server  | Start game from lobby      | `Lobby` object                                    |
| `game-created`                    | Server → Players | Game started               | `Game` object                                     |
| `game-updated`                    | Server → Players | Game state changed         | `Game` object                                     |
| `vote-kick-player-from-game`      | Client → Server  | Vote to remove player      | `{gameId, targetPlayerId, votingPlayerId}`        |
| `rejoin-game`                     | Client → Server  | Reconnect to game          | `{gameId, playerIdFromLocalStorage, newPlayerId}` |
| `leave-disconnected-game`         | Client → Server  | Leave as disconnected      | `{gameId, playerId}`                              |
| `games-with-disconnected-players` | Server → All     | Update reconnectable games | `Game[]`                                          |
| `updated-disconnect-timer`        | Server → All     | Timer updates              | `{time, playerId}`                                |
| `player-removed-from-game`        | Server → All     | Player removed             | `playerId`                                        |

### Advanced Features

- **Room Management**: Automatic Socket.IO room joining/leaving
- **Disconnection Handling**: 10-minute countdown timers
- **Vote System**: Democratic player removal
- **Reconnection**: Persistent player IDs in localStorage
- **Error Handling**: Comprehensive callback-based error responses

---

## <a id="state-management"></a> 🗄️ State Management

### Four-Store Architecture

#### 1. Lobby Store (`useLobbyStore`)

**Purpose**: Manages lobby-related state

```typescript
{
  myLobbyId: string,           // Current lobby ID
  setMyLobbyId: (id) => void,
  lobbies: Lobby[],            // All available lobbies
  setLobbies: (lobbies) => void,
  reconnectableGames: Game[],  // Games with disconnected players
  setReconnectableGames: (games) => void
}
```

#### 2. Player Store (`usePlayerStore`)

**Purpose**: Player-specific UI and game state

```typescript
{
  // Board Controls
  zoom: number,                // Board zoom (0.5-2.0)
  offset: {x, y},             // Board pan offset
  rotation: number,           // Board rotation (0-360)
  resetBoardPosition: () => void,

  // Interaction States
  isDragging: boolean,        // Currently dragging
  panMode: boolean,           // Space key held
  selectedZone: Zone,         // Selected board zone

  // Player Identity
  playerName: string,         // Display name
  playerId: string,           // Socket ID

  // Game Actions
  totalActions: number,       // Total actions per turn
  actionsRemaining: number,   // Actions left this turn
  resetGame: () => void
}
```

#### 3. Game Store (`useGameStore`)

**Purpose**: Shared game state synchronized across players

```typescript
{
  gameId: string,             // Current game ID
  setGameId: (id) => void,
  players: Player[],          // All players in game
  setPlayers: (players) => void,
  status: "active" | "paused", // Game status
  setStatus: (status) => void,
  disconnectedPlayers: {...}, // Disconnected player tracking
  setDisconnectedPlayers: (players) => void,
  disconnectTimers: {...},    // Countdown timers
  setDisconnectTimers: (timers) => void
}
```

#### 4. Dev Store (`useDevStore`)

**Purpose**: Development and debugging features

```typescript
{
  devMode: boolean,           // Development panel visibility
  setDevMode: (mode) => void,
  hideOverlay: boolean,       // Hide UI overlay
  setHideOverlay: (hide) => void
}
```

### State Synchronization

- **Lobby State**: Real-time sync via Socket.IO broadcasts
- **Game State**: Server-authoritative with client updates
- **Player State**: Client-local with some server sync
- **Dev State**: Client-local only
- **Persistence**: Player ID in localStorage for reconnection

---

## <a id="ui-components"></a> 🎨 UI Components

### Component Hierarchy

```
App
├── Toaster (react-hot-toast)
├── DevMode (development tools)
└── Conditional Rendering:
    ├── Home (lobby system)
    │   ├── HomeButtons
    │   ├── JoinLobbiesScreen
    │   ├── LobbyScreen
    │   └── ReconnectToGamePopup
    └── GameWrapper (game interface)
        ├── GameBoard
        ├── Overlay
        ├── KeyboardListener
        └── PlayerDisconnectedPopup
```

### Key Component Systems

#### Home System (Lobby Management)

- **`Home.tsx`**: Main routing and state management
- **`HomeButtons.tsx`**: Player name input and game creation
- **`JoinLobbiesScreen.tsx`**: Lobby browser with real-time updates
- **`LobbyScreen.tsx`**: Full lobby management interface
- **`ReconnectToGamePopup.tsx`**: Automatic reconnection handling

#### GameWrapper System

- **`GameWrapper.tsx`**: Game container component
- **`GameBoard/`**: Tile-based board system
- **`Overlay/`**: UI overlay components
- **`KeyboardListener.tsx`**: Keyboard event handling
- **`PlayerDisconnectedPopup.tsx`**: Vote kick interface

#### Game Board System

- **`GameBoard.tsx`**: Main board container with pan/zoom
- **`Tiles.tsx`**: Tile rendering system
- **`Tile.tsx`**: Individual tile components with images
- **`Cell.tsx`**: Interactive cell components

#### Overlay System

- **`Overlay.tsx`**: Main overlay container
- **`Header.tsx`**: Top bar with reset/rotate controls
- **`Footer.tsx`**: Bottom panel with action buttons
- **`RightSidebar.tsx`**: Side panel for game info
- **`ActionButtons.tsx`**: Game action interface
- **`PlayerCards.tsx`**: Player status display
- **`ActionsRemaining.tsx`**: Action counter
- **`XPTracker.tsx`**: Experience tracking
- **`ZoneInfoPanel.tsx`**: Zone information display

#### Development System

- **`DevMode.tsx`**: Development tools container
- **`DevModeSwitch.tsx`**: Dev mode toggle
- **`DevPanel.tsx`**: Debug information panel

#### UI Primitives

- **`Button.tsx`**: Flexible button component with variants
- **`Card.tsx`**: Card component with header/content/actions
- **`Switch.tsx`**: Toggle switch component

### Styling System

- **Tailwind CSS**: Utility-first styling with custom configuration
- **CSS Modules**: Component-specific styles (GameBoard.css, etc.)
- **CSS Variables**: Dark theme with red/yellow accents
- **Responsive Design**: Mobile-friendly layouts
- **Accessibility**: Focus states and proper contrast

---

## <a id="game-board-system"></a> 🎲 Game Board System

### Tile-Based Architecture

#### Data Models

```typescript
Tile {
  id: string,                 // Tile identifier (e.g., "1B", "2B")
  position: {x, y},           // Grid position
  rotation: 0|90|180|270,     // Tile rotation
  cells: Cell[]               // 3x3 grid of cells
}

Cell {
  id: string,                 // Cell identifier
  tileId: string,             // Parent tile
  row: number,                // Row (0-2)
  col: number                 // Column (0-2)
}

Zone {
  id: string,                 // Zone identifier
  cellIds: string[],          // Cells in zone
  tileIds: string[],          // Tiles spanning zone
  room: boolean               // Indoor/outdoor flag
}
```

#### Current Implementation

- **Tutorial Map**: 2-tile setup with tiles "1B" and "2B"
- **Tile Images**: Loaded dynamically from assets
- **3x3 Cell Grid**: Each tile has 9 interactive cells
- **Zone System**: 14 predefined zones spanning multiple tiles
- **Cross-Tile Zones**: Zones can span multiple tiles seamlessly

#### Board Interaction System

- **Pan Mode**: Hold spacebar + drag to pan
- **Zoom**: Mouse wheel (0.5x to 2.0x)
- **Rotation**: Board rotation controls
- **Zone Selection**: Click cells to select zones
- **Visual Feedback**: Cursor changes, hover effects

#### Technical Implementation

- **CSS Grid**: 1.5x1.5 grid layout for tiles
- **Transform-Based**: Hardware-accelerated pan/zoom/rotate
- **Image Loading**: Dynamic tile image imports
- **Event Handling**: Mouse/keyboard event management
- **State Management**: Board state in PlayerStore

---

## <a id="game-features"></a> 🎮 Game Features

### Player Management

#### Lobby Features

- **Real-time Player List**: Live updates of joined players
- **Ready System**: Players must ready up before game start
- **Host Powers**: Change game name, delete lobby, start game
- **Player Limits**: Maximum 4 players per lobby

#### Game Features

- **Action System**: Players have 3 actions per turn (UI implemented)
- **Action Types**: Search, Move, Door, Inventory, Melee, Ranged, Take, Noise
- **Player Cards**: Display player status and information
- **Experience Tracking**: XP system UI components

### Disconnection Handling

#### Automatic Detection

- **Connection Monitoring**: Server detects player disconnections
- **Game Pausing**: Game automatically pauses when player disconnects
- **Timer System**: 10-minute countdown for disconnected players

#### Vote Kick System

- **Democratic Removal**: Remaining players vote to remove disconnected player
- **Majority Required**: All remaining players must vote to remove
- **Visual Interface**: Clear voting UI with player status

#### Reconnection System

- **Persistent IDs**: Player IDs stored in localStorage
- **Automatic Detection**: Server tracks games with disconnected players
- **Reconnection Popup**: Automatic popup for returning players
- **Seamless Rejoining**: Players rejoin their original game

### Board Interaction

#### Zone System

- **Interactive Cells**: Click cells to select zones
- **Zone Information**: Display zone details in sidebar
- **Room Detection**: Indoor/outdoor zone classification
- **Multi-Tile Zones**: Zones span multiple tiles seamlessly

#### Board Controls

- **Pan/Zoom/Rotate**: Full board manipulation
- **Reset Controls**: One-click board reset
- **Keyboard Controls**: Spacebar for pan mode
- **Visual Feedback**: Cursor changes and hover effects

---

## <a id="development-features"></a> 🛠️ Development Features

### Development Mode System

#### DevMode Components

- **DevModeSwitch**: Toggle development panel on/off
- **DevPanel**: Debug information and controls
- **Overlay Controls**: Hide/show UI overlay
- **State Inspection**: Access to all store states

#### Development Tools

- **Zone Debugging**: Display zone IDs and tile relationships
- **State Monitoring**: Real-time state inspection
- **Board Information**: Tile and cell debugging info
- **Socket Debugging**: Connection and event monitoring

### Development Environment

#### Hot Reload System

- **Vite**: Lightning-fast development server
- **TypeScript**: Live type checking and compilation
- **Socket Server**: Development server on port 8000
- **Asset Loading**: Dynamic tile image loading

#### Code Quality

- **ESLint**: Comprehensive linting with React hooks rules
- **TypeScript**: Full type safety across client/server
- **Shared Types**: Type definitions in `/shared/types.ts`
- **Component Organization**: Feature-based component structure

---

## <a id="technical-details"></a> 🔧 Technical Details

### Build System

#### Client Build

- **Vite**: Modern build tool with TypeScript support
- **Development**: `npm run dev` for hot reload
- **Production**: Static build to `/client/dist`

#### Server Build

- **ts-node**: Development runtime
- **Production**: Compiled TypeScript
- **Socket.IO**: WebSocket server on port 8000

### Deployment Architecture

#### Current Setup

- **Development**: Local development with hot reload
- **Production**: Planned Railway deployment
- **Static Assets**: Tile images and other assets
- **Environment**: PORT variable configuration

### Performance Optimizations

#### Client-Side

- **Singleton Socket**: Single connection per client
- **State Batching**: Zustand automatic batching
- **Hardware Acceleration**: CSS transforms for board movement
- **Dynamic Loading**: Lazy loading of tile images

#### Server-Side

- **Room Management**: Efficient Socket.IO room handling
- **Memory Management**: Proper cleanup of disconnected players
- **Event Batching**: Efficient broadcast patterns

### Security & Validation

#### Input Validation

- **Server-Side**: All inputs validated before processing
- **Type Safety**: TypeScript interfaces for all data
- **Error Handling**: Comprehensive error responses

#### Network Security

- **CORS**: Currently permissive for development
- **Rate Limiting**: Planned for production
- **Authentication**: Basic socket-based authentication

---

## <a id="future-plans"></a> 🚀 Future Plans

### Immediate Development (Next Phase)

#### Core Game Mechanics

- [ ] **Survivor Tokens**: Implement survivor pieces with stats
- [ ] **Zombie Tokens**: Implement zombie pieces with AI
- [ ] **Turn System**: Implement turn-based gameplay loop
- [ ] **Action Implementation**: Connect action buttons to game logic
- [ ] **Movement System**: Implement token movement on board

#### Game Features

- [ ] **Inventory System**: Item management for survivors
- [ ] **Combat System**: Attack and defense mechanics
- [ ] **Search System**: Item discovery and collection
- [ ] **Noise System**: Sound mechanics for zombie attraction
- [ ] **Win Conditions**: Objective-based gameplay

### Enhanced Networking

- [ ] **Game State Sync**: Real-time game state synchronization
- [ ] **Action Validation**: Server-side action validation

### Polish & Production

### Deployment & Scaling

- [ ] **Railway Deployment**: Production deployment setup

- [ ] **Monitoring**: Performance and error tracking

---

## 🔍 Key Files Reference

### Server Architecture

- `server/index.ts` - Main server entry point
- `server/config.ts` - Express and Socket.IO configuration
- `server/lobby/lobbyManager.ts` - Lobby business logic
- `server/lobby/lobbySocketHandlers.ts` - Lobby socket events
- `server/game/gameManager.ts` - Game business logic
- `server/game/gameSocketHandlers.ts` - Game socket events
- `server/maps.ts` - Game map definitions
- `server/utils.ts` - Utility functions

### Client Architecture

- `client/src/App.tsx` - Application root with routing
- `client/src/components/Home/` - Lobby system components
- `client/src/components/GameWrapper.tsx` - Game interface container
- `client/src/components/GameBoard/` - Board and tile system
- `client/src/components/Overlay/` - UI overlay components
- `client/src/store/` - Zustand state management (4 stores)
- `client/src/hooks/` - Custom React hooks for sockets
- `client/src/socket.ts` - Socket.IO client configuration

### Shared Resources

- `shared/types.ts` - TypeScript type definitions
- `client/src/assets/` - Game tile images and assets

---

Documentation created on 02/07/2025
V1.1 04/07/2025
