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

function traverseAndCalculate(size: number, mines: PositionSet) {
  const hints = new Array(size * size).fill(0);

  for (let i = 0; i < size * size; i++) {
    hints[i] = 0;
    const pos = Position.fromIndex(i, size);
    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        const newRow = pos.row + row;
        const newCol = pos.col + col;
        if (
          newRow < 0 ||
          newRow >= size ||
          newCol < 0 ||
          newCol >= size ||
          pos.is(new Position(newRow, newCol))
        ) {
          continue;
        }

        const target = Position.fromIndex(newRow * size + newCol, size);
        if (mines.has(target)) {
          hints[i]++;
        }
      }
    }
  }

  return hints;
}
