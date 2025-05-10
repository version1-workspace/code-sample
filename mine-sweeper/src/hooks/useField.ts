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

  const totalCells = settings.size * settings.size;

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
        console.log("target", index, target, set);
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
    cloned.add(new Position(row, col));
    const newRevealed = revealCellRecursively(cloned, mines, hints, row, col);

    setRevealed(newRevealed);

    return cloned;
  }

  function revealMines() {
    const cloned = revealed.cloned();
    mines.asArray.forEach((pos) => {
      cloned.add(pos);
    });
    setRevealed(cloned);
  }

  function toggleFlag(row: number, col: number) {
    const pos = new Position(row, col);
    if (revealed.has(pos)) {
      return;
    }

    if (flags.has(pos)) {
      setFlags((prev) => {
        const cloned = prev.cloned();
        cloned.delete(pos);
        return cloned;
      });
    } else {
      setFlags((prev) => {
        const cloned = prev.cloned();
        cloned.add(pos);
        return cloned;
      });
    }
  }

  function assignMines(mineCount: number, target: Position) {
    const mines = new PositionSet();

    while (mines.size < mineCount) {
      const index = Math.floor(Math.random() * totalCells);
      const position = Position.fromIndex(index, size);
      if (mines.has(position)) {
        continue;
      }

      if (target.is(position)) {
        continue;
      }

      mines.add(position);
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
