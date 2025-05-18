export interface Settings {
  size: number;
  mineCount: number;
}

export class Position {
  static fromIndex(index: number, size: number) {
    const row = Math.floor(index / size);
    const col = index % size;
    return new Position(row, col);
  }

  constructor(
    public row: number,
    public col: number,
  ) {
    this.row = row;
    this.col = col;
  }

  is(pos: Position) {
    return this.row === pos.row && this.col === pos.col;
  }

  index(size: number) {
    return this.row * size + this.col;
  }
}

export class PositionSet {
  private positions: Set<Position> = new Set<Position>();

  get size() {
    return this.positions.size;
  }

  get asArray() {
    return [...this.positions];
  }

  cloned() {
    const cloned = new PositionSet();
    this.positions.forEach((pos) => {
      cloned.add(pos);
    });
    return cloned;
  }

  has(pos: Position) {
    return [...this.positions].some((p) => p.is(pos));
  }

  add(...pos: Position[]) {
    pos.forEach((p) => {
      this.positions.add(p);
    });
  }

  delete(pos: Position) {
    const sets = new Set<Position>();
    this.positions.forEach((p) => {
      if (p.is(pos)) {
        return;
      }
      sets.add(p);
    });
    this.positions = sets;
  }
}
