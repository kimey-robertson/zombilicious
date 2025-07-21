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
9. [Game Mechanics](#game-mechanics)
10. [Development Features](#development-features)
11. [Technical Details](#technical-details)
12. [Future Plans](#future-plans)

---

## 🎯 <a id="project-overview"></a> Project Overview

**Zombilicious** is a web-based multiplayer zombie survival game featuring:

- Tile-based draggable/pannable board with CSS Grid
- Real-time turn-based gameplay with Socket.IO synchronization
- Comprehensive lobby system with player management
- Advanced disconnection handling and reconnection features
- Fixed UI elements with responsive design
- Modern React frontend with TypeScript
- **Full game mechanics including combat, movement, inventory, and zombie AI**

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
- **Complete action system with 8 action types**
- **Turn-based gameplay with zombie AI**
- **Combat system (melee and ranged)**
- **Inventory management with drag & drop**
- **Player health and death mechanics**
- **Experience point system**
- **Win/loss conditions with objective collection**
- **Comprehensive token system**
- **Real-time game event logging**
- Development mode with debugging tools

🚧 **In Progress:**

- Additional map content
- More cards/items
- Characters to choose from
- More maps

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
│   │   │   │   ├── Cell.tsx           # Interactive board cells
│   │   │   │   ├── PlayerToken.tsx    # Player game pieces
│   │   │   │   ├── ZombieToken.tsx    # Zombie game pieces
│   │   │   │   ├── NoiseToken.tsx     # Sound indicators
│   │   │   │   ├── ObjectiveToken.tsx # Collectible objectives
│   │   │   │   └── ZombieSpawnToken.tsx # Spawn points
│   │   │   ├── Overlay/    # UI overlay components
│   │   │   │   ├── ActionButtons.tsx  # 8 game action types
│   │   │   │   ├── PlayerCards.tsx    # Inventory management
│   │   │   │   ├── EventLog.tsx       # Real-time game events
│   │   │   │   ├── GameOverPopup.tsx  # Loss condition UI
│   │   │   │   └── GameWonPopup.tsx   # Victory condition UI
│   │   │   ├── DevMode/    # Development tools
│   │   │   └── UI/         # Reusable UI components
│   │   ├── store/         # Zustand state management (4 stores)
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useActionButtons.ts    # Game action logic
│   │   │   ├── useCardDragAndDrop.ts  # Inventory system
│   │   │   ├── useCurrentPlayer.ts    # Player state logic
│   │   │   └── useZoneDetails.ts      # Board interaction
│   │   └── assets/        # Static assets (images, tiles)
├── server/                # Node.js backend
│   ├── index.ts          # Server entry point
│   ├── config.ts         # Server configuration
│   ├── lobby/            # Lobby management
│   │   ├── lobbyManager.ts
│   │   └── lobbySocketHandlers.ts
│   ├── game/             # Game management
│   │   ├── gameManager.ts     # Core game logic
│   │   ├── gameSocketHandlers.ts # 15+ game events
│   │   └── gameUtils.ts       # Game utilities
│   ├── maps/             # Game map configurations
│   │   ├── maps.ts           # Map definitions
│   │   └── mapUtils.ts       # Zone calculations & zombie AI
│   ├── connection/       # Connection management
│   ├── utils/            # Server utilities
│   │   ├── socketWrapper.ts  # Error handling system
│   │   └── socketErrors.ts   # Typed error classes
│   └── cards.ts          # Item/weapon definitions
├── shared/               # Shared TypeScript types
└── tsconfig.json        # Root TypeScript config
```

### Key Design Patterns

- **Modular architecture** with separate lobby and game systems
- **Four-store state management** using Zustand
- **Real-time synchronization** via Socket.IO with room-based events
- **Type safety** with comprehensive shared TypeScript interfaces
- **Separation of concerns** between UI, game logic, and networking
- **Component-based token system** for game pieces
- **Hook-based game mechanics** for reusable logic

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
- **Players start with 2 health, 3 actions per turn, and starting equipment**

### 4. Game Flow

- **Active Game**: Full game board with interaction
- **Turn-Based Gameplay**: Players take turns, followed by zombie turn
- **Action System**: 8 different action types (Search, Move, Door, Inventory, Melee, Ranged, Objective, Noise)
- **Combat**: Real-time damage calculation with dice rolling
- **Inventory**: Drag-and-drop card management system
- **Health System**: Player damage and death mechanics
- **Disconnection Handling**: Automatic pause with timer
- **Vote Kick System**: Remaining players can vote to remove
- **Reconnection**: Automatic popup for returning players

### 5. End Game Flows

- **Victory**: Collect objective tokens to win
- **Defeat**: All players killed by zombies
- **Leave Game**: Return to lobby system
- **Disconnection**: Automatic cleanup and reconnection options

---

## <a id="socket-communication-system"></a> 🔌 Socket Communication System

### Connection Architecture

- **Client**: Singleton socket via `getSocket()` in `socket.ts`
- **Server**: Modular socket handlers for lobby and game events
- **Rooms**: Automatic room management for lobbies and games
- **Reconnection**: Exponential backoff (1s-5s, max 5 attempts)
- **Error Handling**: Comprehensive typed error system with callbacks

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
| `end-turn`                        | Client → Server  | End current player turn    | `{gameId}`                                        |
| `move-player-to-zone`             | Client → Server  | Move player on board       | `{gameId, playerId, fromZoneId, toZoneId}`        |
| `open-door`                       | Client → Server  | Open door with card        | `{gameId, playerId, doorId}`                      |
| `make-noise`                      | Client → Server  | Generate noise token       | `{gameId, zoneId, playerId}`                      |
| `search-for-items`                | Client → Server  | Search zone for cards      | `{gameId, zoneId, playerId}`                      |
| `organise-inventory`              | Client → Server  | Reorganize player cards    | `{gameId, playerId, playerCards}`                 |
| `discard-swappable-card`          | Client → Server  | Discard found card         | `{gameId, playerId, playerCards}`                 |
| `melee-attack`                    | Client → Server  | Attack zombies in zone     | `{gameId, playerId, cardId, zoneId}`              |
| `ranged-attack`                   | Client → Server  | Ranged attack on zombies   | `{gameId, playerId, cardId, zoneId}`              |
| `get-ranged-attack-zones`         | Client → Server  | Get valid ranged targets   | `{gameId, playerId, cardId, zone}`                |
| `take-objective-token`            | Client → Server  | Collect objective          | `{gameId, zoneId, playerId}`                      |
| `dead-player-leave-game`          | Client → Server  | Leave as dead player       | `{gameId, playerId}`                              |
| `vote-kick-player-from-game`      | Client → Server  | Vote to remove player      | `{gameId, targetPlayerId, votingPlayerId}`        |
| `rejoin-game`                     | Client → Server  | Reconnect to game          | `{gameId, playerIdFromLocalStorage, newPlayerId}` |
| `leave-disconnected-game`         | Client → Server  | Leave as disconnected      | `{gameId, playerId}`                              |
| `games-with-disconnected-players` | Server → All     | Update reconnectable games | `Game[]`                                          |
| `updated-disconnect-timer`        | Server → All     | Timer updates              | `{time, playerId}`                                |
| `player-removed-from-game`        | Server → All     | Player removed             | `playerId`                                        |
| `log-event`                       | Server → Players | Real-time game events      | `LogEvent`                                        |

### Advanced Features

- **Room Management**: Automatic Socket.IO room joining/leaving
- **Disconnection Handling**: 10-minute countdown timers
- **Vote System**: Democratic player removal
- **Reconnection**: Persistent player IDs in localStorage
- **Error Handling**: Comprehensive callback-based error responses with typed errors
- **Event Logging**: Real-time game event broadcasting

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
  isMyTurn: boolean,          // Current turn status
  selectedAction: GameAction, // Currently selected action
  selectedCardForRanged: Card, // Selected ranged weapon

  // Player Stats
  XP: number,                 // Experience points
  playerCards: PlayerCards,   // Inventory (reserve, hand, swappable)
}
```

#### 3. Game Store (`useGameStore`)

**Purpose**: Shared game state synchronized across players

```typescript
{
  gameId: string,             // Current game ID
  setGameId: (id) => void,
  players: Player[],          // All players in game with health/stats
  setPlayers: (players) => void,
  status: GameStatus,         // "active" | "paused" | "lost" | "won"
  setStatus: (status) => void,
  disconnectedPlayers: {...}, // Disconnected player tracking
  setDisconnectedPlayers: (players) => void,
  disconnectTimers: {...},    // Countdown timers
  setDisconnectTimers: (timers) => void,
  gameLogs: LogEvent[],       // Real-time game event log
  setGameLogs: (logs) => void,
  map: Map,                   // Complete map with zones, tiles, doors
  setMap: (map) => void,
  isZombiesTurn: boolean,     // Zombie turn indicator
  setIsZombiesTurn: (isTurn) => void
}
```

#### 4. Dev Store (`useDevStore`)

**Purpose**: Development and debugging features

```typescript
{
  devMode: boolean,           // Development panel visibility
  setDevMode: (mode) => void,
  hideOverlay: boolean,       // Hide UI overlay
  setHideOverlay: (hide) => void,
  addTestCards: () => void,   // Add test cards for development
  clearAllCards: () => void   // Clear all cards for testing
}
```

### State Synchronization

- **Lobby State**: Real-time sync via Socket.IO broadcasts
- **Game State**: Server-authoritative with client updates
- **Player State**: Client-local with server sync for actions
- **Dev State**: Client-local only
- **Persistence**: Player ID in localStorage for reconnection
- **Real-time Updates**: Game events immediately update all clients

---

## <a id="ui-components"></a> 🎨 UI Components

### Component Hierarchy

```
App
├── Toaster (react-hot-toast)
├── DevMode (development tools)
├── GameOverPopup (loss condition)
├── GameWonPopup (victory condition)
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
- **`GameBoard/`**: Tile-based board system with token rendering
- **`Overlay/`**: UI overlay components with game controls
- **`KeyboardListener.tsx`**: Keyboard event handling
- **`PlayerDisconnectedPopup.tsx`**: Vote kick interface

#### Game Board System

- **`GameBoard.tsx`**: Main board container with pan/zoom
- **`Tiles.tsx`**: Tile rendering system
- **`Tile.tsx`**: Individual tile components with images
- **`Cell.tsx`**: Interactive cell components with click handling
- **`UnitTokens.tsx`**: Container for player and zombie tokens
- **`PlayerToken.tsx`**: Visual player representation with positioning
- **`ZombieToken.tsx`**: Visual zombie representation with count
- **`NoiseToken.tsx`**: Animated noise indicators
- **`ObjectiveToken.tsx`**: Collectible objective markers
- **`ZombieSpawnToken.tsx`**: Spawn point indicators
- **`Door.tsx`**: Interactive door components

#### Overlay System

- **`Overlay.tsx`**: Main overlay container
- **`Header.tsx`**: Top bar with reset/rotate controls
- **`Footer.tsx`**: Action panel with inventory and controls
- **`RightSidebar.tsx`**: Zone information panel
- **`LeftSidebar.tsx`**: Player status sidebar
- **`ActionButtons.tsx`**: 8 interactive game actions
- **`PlayerCards.tsx`**: Drag-and-drop inventory system
- **`ActionsRemaining.tsx`**: Action counter with end turn
- **`XPTracker.tsx`**: Experience point display
- **`ZoneInfoPanel.tsx`**: Zone information display
- **`EventLog.tsx`**: Real-time scrolling game events
- **`GameOverPopup.tsx`**: Styled defeat screen
- **`GameWonPopup.tsx`**: Styled victory screen

#### Development System

- **`DevMode.tsx`**: Development tools container
- **`DevModeSwitch.tsx`**: Dev mode toggle
- **`DevPanel.tsx`**: Debug information panel with card testing

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
- **Animations**: Token positioning, noise effects, hover states

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
  room: boolean,              // Indoor/outdoor flag
  noiseTokens: number,        // Current noise level
  zombies: number,            // Zombie count in zone
  hasZombieSpawn: boolean,    // Spawn point marker
  hasObjectiveToken: boolean  // Collectible objective
}

Door {
  id: string,                 // Door identifier
  cellIds: string[],          // Adjacent cells
  zoneIds: string[],          // Connected zones
  state: "open" | "closed",   // Current state
  transform: string           // CSS positioning
}
```

#### Current Implementation

- **Tutorial Map**: 2-tile setup with tiles "1B" and "2B"
- **Tile Images**: Loaded dynamically from assets
- **3x3 Cell Grid**: Each tile has 9 interactive cells
- **Zone System**: 14 predefined zones spanning multiple tiles
- **Cross-Tile Zones**: Zones can span multiple tiles seamlessly
- **Token System**: Visual representation of players, zombies, and game objects
- **Interactive Elements**: Doors, objective tokens, spawn points

#### Board Interaction System

- **Pan Mode**: Hold spacebar + drag to pan
- **Zoom**: Mouse wheel (0.5x to 2.0x)
- **Rotation**: Board rotation controls
- **Zone Selection**: Click cells to select zones
- **Movement**: Click highlighted zones to move
- **Visual Feedback**: Cursor changes, hover effects, pulse animations

#### Technical Implementation

- **CSS Grid**: 1.5x1.5 grid layout for tiles
- **Transform-Based**: Hardware-accelerated pan/zoom/rotate
- **Image Loading**: Dynamic tile image imports
- **Event Handling**: Mouse/keyboard event management
- **State Management**: Board state in PlayerStore
- **Token Positioning**: Algorithmic placement for multiple tokens

---

## <a id="game-features"></a> 🎮 Game Features

### Player Management

#### Lobby Features

- **Real-time Player List**: Live updates of joined players
- **Ready System**: Players must ready up before game start
- **Host Powers**: Change game name, delete lobby, start game
- **Player Limits**: Maximum 4 players per lobby

#### Game Features

- **Health System**: Players start with 2 health, can take damage and die
- **Action System**: Players have 3 actions per turn (fully implemented)
- **Action Types**: Search, Move, Door, Inventory, Melee, Ranged, Take, Noise
- **Player Cards**: Display player status and information
- **Experience Tracking**: XP gained from combat and objectives
- **Death State**: Dead players can observe or leave game

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
- **Seamless Rejoining**: Players rejoin their original game with full state

### Board Interaction

#### Zone System

- **Interactive Cells**: Click cells to select zones
- **Zone Information**: Display zone details in sidebar
- **Room Detection**: Indoor/outdoor zone classification
- **Multi-Tile Zones**: Zones span multiple tiles seamlessly
- **Movement Validation**: Only adjacent and accessible zones allowed

#### Board Controls

- **Pan/Zoom/Rotate**: Full board manipulation
- **Reset Controls**: One-click board reset
- **Keyboard Controls**: Spacebar for pan mode
- **Visual Feedback**: Cursor changes and hover effects

---

## <a id="game-mechanics"></a> 🎮 Game Mechanics

### Turn System

#### Player Turns

- **Turn Order**: Players take turns in sequence
- **Action Points**: 3 actions per turn
- **Action Types**: 8 different actions available
- **Turn End**: Manual end turn or action depletion
- **Death Handling**: Dead players skipped in turn order

#### Zombie Turns

- **Automated**: Zombies act after all players complete turns
- **AI Behavior**: Line of sight detection and pathfinding
- **Noise Following**: Zombies move toward noise and players
- **Combat**: Automatic attacks on players in same zone
- **Spawning**: New zombies spawn at designated points

### Combat System

#### Melee Combat

- **Range**: Same zone only (maxRange: 0)
- **Weapons**: Crowbar, Fire Axe, Pan
- **Damage Calculation**: Dice rolling with success thresholds
- **Action Cost**: 1 action per attack
- **Zombie Reduction**: Removes zombies from zone

#### Ranged Combat

- **Range**: Variable based on weapon (1-3 zones)
- **Weapons**: Pistol, Rifle
- **Target Selection**: Visual zone highlighting
- **Noise Generation**: Ranged weapons create noise
- **Line of Sight**: Validation of valid targets

#### Damage System

- **Player Health**: 2 hit points maximum
- **Zombie Attacks**: 1 damage per zombie per turn
- **Item Loss**: Random card dropped when damaged
- **Death**: Players die at 0 health
- **Win/Loss**: Game ends when all players die

### Inventory System

#### Card Management

- **Reserve Slots**: 3 cards maximum
- **Hand Slots**: 2 cards maximum (usable)
- **Swappable Card**: Temporary found item storage
- **Drag & Drop**: Full drag-and-drop interface
- **Card Swapping**: Exchange cards between slots

#### Item Types

- **Melee Weapons**: Crowbar, Fire Axe, Pan
- **Ranged Weapons**: Pistol, Rifle
- **Door Tools**: Silent (Crowbar) or Loud (Fire Axe)
- **Rarity System**: Common, Uncommon, Rare, Epic, Legendary

#### Search System

- **Room Requirement**: Only indoor zones searchable
- **Once Per Turn**: Limited to one search per turn
- **Random Generation**: Weighted rarity system
- **Inventory Management**: Auto-placement or swappable storage

### Movement System

#### Zone Movement

- **Adjacent Zones**: Move to connected zones only
- **Door Requirements**: Some zones require open doors
- **Zombie Penalty**: Extra action cost when leaving zombie zones
- **Movement Restriction**: Can't move after entering zombie zone

#### Action Costs

- **Base Cost**: 1 action per move
- **Zombie Tax**: +1 action per zombie in departure zone
- **Door Opening**: 1 action to open doors
- **Movement Validation**: Server-side validation of legal moves

### Objective System

#### Win Conditions

- **Objective Tokens**: Collect tokens to win
- **Token Locations**: Predetermined positions on map
- **Collection Action**: 1 action to collect
- **XP Reward**: 5 XP per objective token
- **Victory**: Game ends when goal reached

#### Experience System

- **Combat XP**: 1 XP per zombie killed
- **Objective XP**: 5 XP per objective collected
- **Display**: Real-time XP tracking in UI
- **Persistence**: XP maintained throughout game

### Noise System

#### Noise Generation

- **Player Actions**: Manual noise generation (1 action)
- **Weapon Noise**: Ranged weapons create noise
- **Door Noise**: Some door-opening methods create noise
- **Visual Indicators**: Noise tokens displayed on zones

#### Zombie Response

- **Attraction**: Zombies move toward noise sources
- **Line of Sight**: Zombies prioritize visible players
- **Pathfinding**: Complex routing around obstacles
- **Split Behavior**: Multiple targets cause zombie splitting

---

## <a id="development-features"></a> 🛠️ Development Features

### Development Mode System

#### DevMode Components

- **DevModeSwitch**: Toggle development panel on/off
- **DevPanel**: Debug information and controls
- **Overlay Controls**: Hide/show UI overlay
- **State Inspection**: Access to all store states
- **Card Testing**: Add/remove test cards for inventory system

#### Development Tools

- **Zone Debugging**: Display zone IDs and tile relationships
- **State Monitoring**: Real-time state inspection
- **Board Information**: Tile and cell debugging info
- **Socket Debugging**: Connection and event monitoring
- **Inventory Testing**: Drag & drop functionality testing

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
- **Error Handling**: Comprehensive error system with typed errors

### Error Handling System

#### Client-Side Errors

- **Toast Notifications**: User-friendly error messages
- **Hook Integration**: `useHandleError` for consistent handling
- **Validation**: Client-side input validation
- **Graceful Degradation**: Fallbacks for failed operations

#### Server-Side Errors

- **Typed Errors**: Custom error classes with codes
- **Socket Wrapper**: Centralized error handling for all events
- **Logging**: Comprehensive server-side logging
- **Callback System**: Error responses to client callbacks

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
- **Component Optimization**: Memoization where appropriate

#### Server-Side

- **Room Management**: Efficient Socket.IO room handling
- **Memory Management**: Proper cleanup of disconnected players
- **Event Batching**: Efficient broadcast patterns
- **Game State Management**: In-memory game storage with cleanup

### Security & Validation

#### Input Validation

- **Server-Side**: All inputs validated before processing
- **Type Safety**: TypeScript interfaces for all data
- **Error Handling**: Comprehensive error responses
- **Action Validation**: Game rule enforcement on server

#### Network Security

- **CORS**: Currently permissive for development
- **Rate Limiting**: Planned for production
- **Authentication**: Basic socket-based authentication

---

## <a id="future-plans"></a> 🚀 Future Plans

### Immediate Development (Next Phase)

#### Map Expansion

- [ ] **Additional Maps**: Create more diverse map layouts
- [ ] **Dynamic Map Selection**: Choose maps at game creation

#### Enhanced Game Features

- [ ] **Character Classes**: Different survivor types with unique abilities
- [ ] **Difficulty Scaling**: Adjustable zombie spawn rates

#### Enhanced Zombies

- [ ] **Special Zombies**: Different zombie types with unique abilities
- [ ] **Dynamic Spawning**: Adaptive spawn rates based on player progress

### Polish & Production

#### User Experience

- [ ] **Tutorial System**: Interactive game tutorial
- [ ] **Sound Effects**: Audio feedback for actions
- [ ] **Animations**: Enhanced visual feedback

#### Social Features - Maybe

- [ ] **Player Statistics**: Track wins, losses, and achievements
- [ ] **Leaderboards**: Competitive rankings
- [ ] **Spectator Mode**: Observe ongoing games

### Deployment & Scaling - Maybe

- [ ] **Railway Deployment**: Production deployment setup
- [ ] **Database Integration**: Persistent player data
- [ ] **Monitoring**: Performance and error tracking
- [ ] **Load Testing**: Multi-game server performance

---

## 🔍 Key Files Reference

### Server Architecture

- `server/index.ts` - Main server entry point
- `server/config.ts` - Express and Socket.IO configuration
- `server/lobby/lobbyManager.ts` - Lobby business logic
- `server/lobby/lobbySocketHandlers.ts` - Lobby socket events
- `server/game/gameManager.ts` - Core game mechanics and logic
- `server/game/gameSocketHandlers.ts` - 15+ game socket events
- `server/game/gameUtils.ts` - Game utility functions
- `server/maps/maps.ts` - Game map definitions
- `server/maps/mapUtils.ts` - Zone calculations and zombie AI
- `server/connection/connectionManager.ts` - Connection handling
- `server/utils/socketWrapper.ts` - Error handling system
- `server/utils/socketErrors.ts` - Typed error classes
- `server/cards.ts` - Item and weapon definitions

### Client Architecture

- `client/src/App.tsx` - Application root with routing
- `client/src/components/Home/` - Lobby system components
- `client/src/components/GameWrapper.tsx` - Game interface container
- `client/src/components/GameBoard/` - Board and token system
- `client/src/components/Overlay/` - UI overlay with game controls
- `client/src/store/` - Zustand state management (4 stores)
- `client/src/hooks/` - Custom hooks for game mechanics
- `client/src/socket.ts` - Socket.IO client configuration

### Shared Resources

- `shared/types.ts` - Comprehensive TypeScript type definitions
- `client/src/assets/` - Game tile images and assets

---

Documentation created on 02/07/2025  
**V2.0 05/07/2025** - Major update reflecting complete game implementation
