// Player colors - using a variety of border colors
const playerColors = [
  "border-red-500",
  "border-blue-500",
  "border-green-500",
  "border-yellow-500",
  "border-purple-500",
  "border-pink-500",
  "border-indigo-500",
  "border-orange-500",
];

function getPlayerColor(playerId: string) {
  return playerColors[playerId.charCodeAt(0) % playerColors.length];
}

export { getPlayerColor };
