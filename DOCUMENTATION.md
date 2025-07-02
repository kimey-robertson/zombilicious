# 🧟 Zombilicious Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [User Flow During Lobbies](#user-flow-during-lobbies)
4. [Socket Communication System](#socket-communication-system)
5. [State Management](#state-management)
6. [UI Components](#ui-components)
7. [Game Board System](#game-board-system)
8. [Development Features](#development-features)
9. [Technical Details](#technical-details)
10. [Future Plans](#future-plans)

---

## 🎯 Project Overview {#project-overview}

**Zombilicious** is a web-based multiplayer zombie survival game featuring:

- Tile-based draggable/pannable board with CSS Grid
- Real-time turn-based gameplay
- Socket.IO for multiplayer synchronisation
- Fixed UI elements with responsive design
- Modern React frontend with TypeScript

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + Zustand
- **Backend**: Node.js + Express + Socket.IO + TypeScript
- **State Management**: Zustand
- **Real-time Communication**: Socket.IO
- **UI Libraries**: React Hot Toast, React Icons
- **Build Tool**: Vite with hot reload
- **Deployment**: Railway (planned)

---

## 🏗️ Architecture

### Project Structure

```
zombilicious/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components organised by feature
│   │   ├── store/         # Zustand state management
│   │   ├── hooks/         # Custom React hooks
│   │   └── assets/        # Static assets (images, tiles)
├── server/                # Node.js backend
│   ├── index.ts          # Server entry point
│   ├── socketHandlers.ts # Socket.IO event handlers
│   ├── lobbyLogic.ts     # Lobby management logic
│   ├── maps.ts           # Game map configurations
│   └── config.ts         # Server configuration
├── shared/               # Shared TypeScript types
└── tsconfig.json        # Root TypeScript config
```

### Key Design Patterns

- **Component-based architecture** with feature-organised folders
- **Centralized state management** using Zustand stores
- **Real-time synchronisation** via Socket.IO events
- **Type safety** with shared TypeScript interfaces
- **Separation of concerns** between game logic and UI

---

## 👥 User Flow During Lobbies

### 1. Initial Entry

- User lands on home screen with `Home` component
- Must enter player name (1-24 characters)
- Two options: "Create Game" or "Join Game"

### 2. Creating a Lobby

**Flow**: `HomeButtons` → `LobbyScreen`

1. User enters player name and clicks "Create Game"
2. Client emits `create-game-lobby` socket event with player name
3. Server creates lobby with random 4-character ID
4. Creator becomes host with `isHost: true` and `isReady: true`
5. Returns to `LobbyScreen` with lobby details

### 3. Joining a Lobby

**Flow**: `HomeButtons` → `JoinLobbiesScreen` → `LobbyScreen`

1. User enters player name and clicks "Join Game"
2. Client fetches all available lobbies via `fetch-lobbies` socket event
3. User selects lobby from list (shows player count, lobby ID, status)
4. Client emits `join-lobby` with lobby ID and player name
5. Server validates (max 4 players, unique socket ID)
6. Player joins with `isHost: false` and `isReady: false`
7. Redirects to `LobbyScreen`

### 4. Lobby Management

**In `LobbyScreen`:**

- **Left Panel**: Player list with ready/unready status indicators
- **Right Panel**: Game settings (name, max players)
- **Host Capabilities**:
  - Change game name (real-time updates)
  - Delete lobby (kicks all players)
  - Start game (only when all players ready)
- **Player Capabilities**:
  - Toggle ready status
  - Leave lobby
- **Real-time Updates**: All changes broadcast via `lobby-updated` events

### 5. Lobby States

- **Waiting**: Players joining, some not ready
- **Ready**: All players marked ready, host can start
- **Starting**: Game initialization (planned)

### 6. Exit Flows

- **Host leaves**: Lobby deleted, all players kicked
- **Player leaves**: Removed from lobby, others notified
- **Disconnection**: Automatic cleanup, host transfer if needed

---

## 🔌 Socket Communication System

### Connection Setup

- **Client**: Singleton socket connection via `getSocket()` in `socket.ts`
- **Server**: Socket.IO server with CORS enabled for all origins
- **Reconnection**: Configured with exponential backoff (1s-5s, max 5 attempts)

### Event Architecture

#### Lobby Events (Bidirectional)

| Event                          | Direction       | Purpose                  | Data                                    |
| ------------------------------ | --------------- | ------------------------ | --------------------------------------- |
| `create-game-lobby`            | Client → Server | Create new lobby         | `{playerName: string}`                  |
| `delete-game-lobby`            | Client → Server | Delete lobby (host only) | `lobbyId: string`                       |
| `join-lobby`                   | Client → Server | Join existing lobby      | `{lobbyId: string, playerName: string}` |
| `leave-lobby`                  | Client → Server | Leave lobby              | `lobbyId: string`                       |
| `fetch-lobbies`                | Client → Server | Get all lobbies          | None                                    |
| `toggle-is-ready-lobby-player` | Client → Server | Toggle ready status      | `playerId: string`                      |
| `change-game-name-lobby`       | Client → Server | Update game name         | `{lobbyId, gameName, playerId}`         |

#### Broadcast Events (Server → All Clients)

| Event           | Purpose             | Data                           |
| --------------- | ------------------- | ------------------------------ |
| `lobby-updated` | Lobby state changed | `{lobbyId, gameName, players}` |
| `lobby-deleted` | Lobby removed       | `{lobbyId}`                    |

### Socket Event Handlers

**Server (`socketHandlers.ts`)**:

- Validates all inputs and permissions
- Uses callback pattern for immediate responses
- Broadcasts state changes to all connected clients
- Handles disconnection cleanup automatically

**Client (`useLobbySockets.ts`)**:

- Hook-based event listener management
- Automatic cleanup on component unmount
- State synchronisation with Zustand stores

### Error Handling

- Callback-based error responses with descriptive messages
- Toast notifications for user feedback
- Graceful fallbacks for network issues
- Automatic lobby cleanup on disconnection

---

## 🗄️ State Management

### Two-Store Architecture

#### 1. Lobby Store (`useLobbyStore`)

**Purpose**: Manages lobby-related state shared across users

```typescript
{
  myLobbyId: string,           // Current lobby ID
  setMyLobbyId: (id) => void,
  lobbies: Lobby[],            // All available lobbies
  setLobbies: (lobbies) => void
}
```

#### 2. Player Store (`usePlayerStore`)

**Purpose**: Manages player-specific UI and game state

```typescript
{
  // Game View Controls
  zoom: number,                // Board zoom level (0.5-2.0)
  offset: {x, y},             // Board pan offset
  rotation: number,           // Board rotation (0-360)

  // Interaction States
  isDragging: boolean,        // Currently dragging board
  panMode: boolean,           // Space key held for panning
  selectedZone: Zone,         // Selected board zone

  // UI Controls
  devMode: boolean,           // Development panel visibility
  hideOverlay: boolean,       // Hide UI overlay

  // Player Identity
  playerName: string,         // Display name
  playerId: string           // Socket ID
}
```

### State Synchronisation

- **Lobby state**: Synchronised via Socket.IO broadcasts
- **Player state**: Local to each client
- **Game state**: Planned for actual gameplay
- **Persistence**: Currently in-memory only

---

## 🎨 UI Components

### Component Hierarchy

```
App
├── Toaster (react-hot-toast)
└── Home
    ├── HomeButtons (initial screen)
    ├── JoinLobbiesScreen (lobby browser)
    └── LobbyScreen (lobby management)

GameWrapper (commented out in App.tsx)
├── GameBoard (tile-based board)
├── Overlay (UI overlay)
├── KeyboardListener (space key handler)
└── DevMode (development tools)
```

### Key Components

#### `Home` Component Family

- **`Home.tsx`**: Main container with screen routing logic
- **`HomeButtons.tsx`**: Player name input + create/join buttons
- **`JoinLobbiesScreen.tsx`**: Lobby browser with real-time updates
- **`LobbyScreen.tsx`**: Full lobby management interface

#### `GameBoard` System (for future game)

- **`GameBoard.tsx`**: Main board container with pan/zoom controls
- **`Tiles.tsx`**: Tile rendering system
- **`Cell.tsx`**: Individual cell components
- **Interaction**: Mouse-based pan/zoom, keyboard controls

#### `Overlay` System

- **`Overlay.tsx`**: Main overlay container
- **`Header.tsx`**: Top navigation/info bar
- **`RightSidebar.tsx`**: Right panel controls
- **`Footer.tsx`**: Bottom action bar

#### UI Primitives (`UI/`)

- **`Button.tsx`**: Standardized button component with variants
- **`Card.tsx`**: Flexible card component with header/content/actions
- **`Switch.tsx`**: Toggle switch component

### Styling Architecture

- **Tailwind CSS**: Utility-first styling
- **CSS Modules**: Component-specific styles (e.g., `GameBoard.css`)
- **CSS Variables**: Custom color scheme
- **Responsive Design**: Mobile-friendly layouts

### Visual Design

- **Theme**: Dark/apocalyptic with red accents
- **Typography**: Bold, readable fonts with zombie aesthetics
- **Animations**: Smooth transitions, hover effects
- **Accessibility**: Focus states, readable contrast

---

## 🎲 Game Board System

### Tile-Based Architecture

The game uses a tile-based system:

#### Data Models

```typescript
Tile {
  id: string,
  position: {x, y},
  rotation: 0|90|180|270,
  cells: Cell[]
}

Cell {
  id: string,
  tileId: string,
  row: number (0-2),
  col: number (0-2)
}

Zone {
  id: string,
  cellIds: string[],
  tileIds: string[],
  room: boolean
}
```

#### Current Implementation

- **Tutorial Map**: 2 tiles (1B and 2B) with predefined zones
- **3x3 Grid**: Each tile contains 9 cells in a 3x3 layout
- **Zone System**: Cells grouped into logical zones (rooms/outdoor areas)
- **Cross-Tile Zones**: Zones can span multiple tiles

#### Interaction System

- **Pan Mode**: Hold spacebar + drag to pan around board
- **Zoom**: Mouse wheel to zoom in/out (0.5x - 2.0x)
- **Rotation**: Board rotation feature
- **Zone Selection**: Click zones for zone information

#### Technical Details

- **CSS Grid**: Board rendered using CSS Grid layout
- **Transform-based**: Pan/zoom via CSS transforms for performance
- **Event Handling**: Mouse events for interaction
- **State Management**: Board state in PlayerStore (unique to each player)

---

## 🛠️ Development Features

### DevMode System

- **Toggle**: Only available in development builds
- **Components**:
  - `DevModeSwitch`: Toggle development panel
  - `DevPanel`: Development tools and debugging info
- **Features**: Debug information, state inspection

### Hot Reload

- **Vite**: Lightning-fast development server
- **TypeScript**: Live type checking
- **Socket**: Development socket server on port 8000

### Code Quality

- **ESLint**: Code linting with React hooks rules
- **TypeScript**: Full type safety across client/server
- **Shared Types**: Common interfaces in `/shared` folder

---

## 🔧 Technical Details

### Build System

- **Client**: Vite build system with TypeScript
- **Server**: ts-node for development, compiled for production
- **Scripts**:
  - `npm run dev` (client): Start development server
  - `npm start` (root): Start production server

### Deployment Architecture

- **Static Hosting**: Client builds to `/client/dist`
- **Server Routing**: Express serves client + handles API
- **Railway**: Planned deployment platform
- **Environment**: PORT variable for server configuration

### Type Safety

- **Shared Types**: Common interfaces in `/shared/types.ts`
- **Store Types**: Zustand store interfaces in `/client/src/store/storeTypes.ts`
- **Socket Events**: Typed socket event handlers

### Performance Considerations

- **Singleton Socket**: Single socket connection per client
- **State Batching**: Zustand automatic state batching
- **Transform-based Animation**: Hardware-accelerated board movement
- **Component Memoization**: Planned for game components

### Security

- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: Planned for production
- **CORS**: Currently permissive (development)

---

## 🚀 Future Plans

### Immediate Roadmap (from ROADMAP.md)

- [ ] Basic survivor tokens
- [ ] Basic zombie tokens
- [ ] Game loop implementation
- [ ] Game state management
- [ ] Core game logic
- [ ] Enhanced networking
- [ ] Production deployment

### Planned Features

- **Game Mechanics**: Turn-based gameplay, actions system
- **Token System**: Survivor and zombie pieces
- **Inventory**: Item management for survivors
- **Combat**: Attack/defense mechanics
- **Win Conditions**: Objective-based gameplay

---

## 🔍 Key Files Reference

### Core Server Files

- `server/index.ts` - Server entry point and Socket.IO setup
- `server/socketHandlers.ts` - Socket event handlers and validation
- `server/lobbyLogic.ts` - Lobby management business logic
- `server/config.ts` - Express and Socket.IO configuration

### Core Client Files

- `client/src/App.tsx` - Application root component
- `client/src/components/Home/` - Lobby system components
- `client/src/store/` - Zustand state management
- `client/src/hooks/useLobbySockets.ts` - Socket lobby event handling

### Shared Resources

- `shared/types.ts` - Common TypeScript interfaces
- `server/maps.ts` - Game map definitions
- `server/utils.ts` - Server utility functions

---

Documentation created on 02/07/2025
