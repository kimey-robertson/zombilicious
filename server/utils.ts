import type { Cell } from "../shared/types";
import Timeout = NodeJS.Timeout;

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
  let intervalId: Timeout | undefined;
  let time: string = "";

  intervalId = setInterval(() => {
    if (startTime.getSeconds() === 0 && startTime.getMinutes() === 0) {
      clearInterval(intervalId);
      intervalId = undefined;
    }
    time = `${addZero(startTime.getMinutes())}:${addZero(
      startTime.getSeconds()
    )}`;
    onTick(time);
    startTime.setSeconds(startTime.getSeconds() - 1);
  }, 1000);
}

export { getTileCells, countDownTimer };
