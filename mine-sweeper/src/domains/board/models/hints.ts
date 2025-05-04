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
  // TODO: Implement

  return hints;
}
