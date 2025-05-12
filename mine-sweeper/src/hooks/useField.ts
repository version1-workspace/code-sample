import { useState } from "react";
import { Position, PositionSet, Settings } from "../domains/board/models";
import { Hints } from "../domains/board/models/hints";

export function useField({ size, mineCount }: Settings) {
  const [settings, setSettings] = useState<Settings>({
    size,
    mineCount,
  });
  const [flags, setFlags] = useState(new PositionSet());
  const [mines, setMines] = useState(new PositionSet());
  const [revealed, setRevealed] = useState(new PositionSet());
  const [hints, setHints] = useState<Hints>(new Hints(size, mines));

  function reset() {
    setFlags(new PositionSet());
    setRevealed(new PositionSet());
    const mines = new PositionSet();
    setMines(new PositionSet());
    setHints(new Hints(size, mines));
  }

  function changeSettings(settings: Settings) {
    setSettings(settings);
    reset();
  }

  function revealCell(
    row: number,
    col: number,
    mines: PositionSet,
    hints: number[],
  ) {
    const cloned = revealed.cloned();
    const position = new Position(row, col);
    cloned.add(position);

    setRevealed(cloned);
    return cloned;
  }

  function revealMines() {
    const cloned = revealed.cloned();
    mines.asArray.forEach((pos: Position) => {
      cloned.add(pos);
    });
    setRevealed(cloned);
  }

  function toggleFlag(row: number, col: number) {
    const cloned = flags.cloned();
    const position = new Position(row, col);
    if (revealed.has(position)) {
      return;
    }

    if (cloned.has(position)) {
      cloned.delete(position);
    } else {
      cloned.add(position);
    }

    setFlags(cloned);
  }

  function assignMines(mineCount: number, target: Position) {
    const mines = new PositionSet();

    for (let i = 0; i < mineCount; i++) {
      let row = Math.floor(Math.random() * size);
      let col = Math.floor(Math.random() * size);
      while (
        mines.has(new Position(row, col)) ||
        target.is(new Position(row, col))
      ) {
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * size);
      }

      mines.add(new Position(row, col));
    }

    setMines(mines);
    return mines;
  }

  function calculateHints(mines: PositionSet) {
    const hints = new Hints(size, mines);
    setHints(hints);
    return hints;
  }

  return {
    flags,
    mines,
    revealed,
    hints,
    revealCell,
    revealMines,
    assignMines,
    calculateHints,
    toggleFlag,
    changeSettings,
  };
}
