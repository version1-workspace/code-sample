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

  function revealCellRecursively(
    set: PositionSet,
    mines: PositionSet,
    hints: number[],
    row: number,
    col: number,
  ) {
    const pos = new Position(row, col);
    if (hints[pos.index(size)] > 0) {
      return set;
    }

    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        const newRow = pos.row + row;
        const newCol = pos.col + col;
        if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) {
          continue;
        }

        const index = newRow * size + newCol;
        const target = Position.fromIndex(index, size);
        if (set.has(target) || mines.has(target)) {
          continue;
        }

        set.add(target);
        if (hints[index] > 0) {
          continue;
        }

        const res = revealCellRecursively(set, mines, hints, newRow, newCol);
        set.add(...res.asArray);
      }
    }

    return set;
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
    const newRevealed = revealCellRecursively(cloned, mines, hints, row, col);

    setRevealed(newRevealed);
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
