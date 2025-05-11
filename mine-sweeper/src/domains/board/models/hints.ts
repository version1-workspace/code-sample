import { Position, PositionSet } from ".";

export class Hints {
  private hints: number[] = [];
  private size: number = 0;

  constructor(size: number, mines: PositionSet) {
    this.size = size;
    this.hints = traverseAndCalculate(size, mines);
  }

  get(row: number, col: number) {
    const index = Position.fromIndex(row * this.size + col, this.size).index(
      this.size,
    );
    return this.hints[index];
  }

  getFromIndex(index: number) {
    return this.hints[index];
  }

  asArray() {
    return this.hints;
  }
}

function traverseAndCalculate(size: number, mines: PositionSet): number[] {
  const hints = new Array(size * size).fill(0);
  for (let i = 0; i < size * size; i++) {
    const pos = Position.fromIndex(i, size);
    if (mines.has(pos)) {
      hints[i] = -1; // -1 indicates a mine
      continue;
    }

    const neighbors = [
      new Position(pos.row - 1, pos.col - 1),
      new Position(pos.row - 1, pos.col),
      new Position(pos.row - 1, pos.col + 1),
      new Position(pos.row, pos.col - 1),
      new Position(pos.row, pos.col + 1),
      new Position(pos.row + 1, pos.col - 1),
      new Position(pos.row + 1, pos.col),
      new Position(pos.row + 1, pos.col + 1),
    ];

    for (const neighbor of neighbors) {
      if (mines.has(neighbor)) {
        hints[i]++;
      }
    }
  }

  return hints;
}
