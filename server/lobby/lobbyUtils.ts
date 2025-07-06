import { Lobby } from "../../shared/types";
import { lobbies } from "./lobbyManager";

function getAllLobbies(): Lobby[] {
  return lobbies || [];
}

export { getAllLobbies };
