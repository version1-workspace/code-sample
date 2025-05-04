import { useField } from "./useField";
import { useDifficulty } from "./useDifficulty";
import { useStatus } from "./useStatus";
import { useTimer } from "./useTimer";
import { Position } from "../domains/board/models";

export function useGame() {
  const { timer, start: startTimer, stop: stopTimer, reset } = useTimer();
  const {
    gameover,
    start,
    success,
    initial,
    isInitial,
    isGameover,
    isSuccess,
    isPlaying,
  } = useStatus();
  const { difficulty, change: changeDifficluty } = useDifficulty();
  const {
    hints,
    revealed,
    flags,
    mines,
    toggleFlag,
    revealCell,
    revealMines,
    assignMines,
    changeSettings,
    calculateHints,
  } = useField(difficulty.value);

  const changeDifficulty = (key: string) => {
    if (isPlaying) {
      return;
    }
    const d = key as string;
    const difficulty = changeDifficluty(d);
    changeSettings(difficulty.value);
    reset();
    initial();
  };

  const onClickCell = (pos: Position) => {
    if (isGameover || isSuccess || flags.has(pos) || revealed.has(pos)) {
      return;
    }

    if (mines.has(pos)) {
      revealMines();
      gameover();
      stopTimer();
      return;
    }

    if (isInitial) {
      start();
      startTimer();
      const mines = assignMines(difficulty.value.mineCount);
      const hints = calculateHints(mines);
      revealCell(pos.row, pos.col, mines, hints.asArray());
      return;
    }

    const res = revealCell(pos.row, pos.col, mines, hints.asArray());
    if (
      res.size ===
      difficulty.value.size * difficulty.value.size - difficulty.value.mineCount
    ) {
      success();
      stopTimer();
    }
  };

  return {
    flags,
    hints,
    revealed,
    mines,
    timer,
    isInitial,
    isGameover,
    isSuccess,
    isPlaying,
    difficulty,
    changeDifficulty,
    toggleFlag,
    onClickCell,
  };
}
