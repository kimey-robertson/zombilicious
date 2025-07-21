import type { Card, Cell } from "../../shared/types";
import { cards } from "../cards";

function getTileCells(tileId: string) {
  const cells: Cell[] = [];
  for (let i = 0; i < 9; i++) {
    cells.push({
      id: `${tileId}-${i}`,
      tileId,
      row: Math.floor(i / 3),
      col: i % 3,
    });
  }
  return cells;
}

function addZero(number: number) {
  return number < 10 ? "0" + number.toString() : number;
}

function countDownTimer(onTick: (time: string) => void) {
  let startTime = new Date(0, 0, 0, 0, 10, 0);

  const intervalId = setInterval(() => {
    const time = `${addZero(startTime.getMinutes())}:${addZero(
      startTime.getSeconds()
    )}`;
    onTick(time);

    // Check AFTER calling onTick so "00:00" gets emitted
    if (startTime.getSeconds() === 0 && startTime.getMinutes() === 0) {
      clearInterval(intervalId);
      return;
    }

    startTime.setSeconds(startTime.getSeconds() - 1);
  }, 1000);

  return () => clearInterval(intervalId);
}

const rarityWeights = {
  common: 5,
  uncommon: 4,
  rare: 3,
  epic: 2,
  legendary: 1,
};

function getRandomCard() {
  const weightedPool: Card[] = [];

  cards.forEach((card) => {
    const weight = rarityWeights[card.rarity];
    for (let i = 0; i < weight; i++) {
      weightedPool.push(card);
    }
  });

  return weightedPool[Math.floor(Math.random() * weightedPool.length)];
}

export { getTileCells, countDownTimer, getRandomCard };
