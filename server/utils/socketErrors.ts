import { SocketErrorCodes } from "../../shared/types";

export class SocketError extends Error {
  constructor(
    public code: SocketErrorCodes,
    message: string,
    public details?: any //TODO: make this more specific
  ) {
    super(message);
    this.name = "SocketError";
  }
}
export class OperationFailedError extends SocketError {
  constructor(operation: string, details?: any) {
    super(
      SocketErrorCodes.OPERATION_FAILED,
      `Operation failed: ${operation}`,
      details
    );
  }
}

export class LobbyNotFoundError extends SocketError {
  constructor(lobbyId: string, details?: any) {
    super(
      SocketErrorCodes.LOBBY_NOT_FOUND,
      `Lobby not found: ${lobbyId}`,
      details
    );
  }
}

export class LobbyPlayerNotFoundError extends SocketError {
  constructor(playerId: string, lobbyId: string, details?: any) {
    super(
      SocketErrorCodes.LOBBY_PLAYER_NOT_FOUND,
      `Lobby player not found: ${playerId} in lobby ${lobbyId}`,
      details
    );
  }
}

export class GameNotFoundError extends SocketError {
  constructor(gameId: string, details?: any) {
    super(
      SocketErrorCodes.GAME_NOT_FOUND,
      `Game not found: ${gameId}`,
      details
    );
  }
}
