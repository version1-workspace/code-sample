interface DifficultyValue {
  size: number;
  mineCount: number;
}

export class Difficulty {
  key: string;
  name: string;
  value: DifficultyValue;

  constructor(key: string, name: string, value: DifficultyValue) {
    this.key = key;
    this.name = name;
    this.value = value;
  }
}

export const difficulties: Record<string, Difficulty> = {
  easy: new Difficulty("easy", "Easy", { size: 9, mineCount: 10 }),
  medium: new Difficulty("medium", "Medium", { size: 16, mineCount: 40 }),
  hard: new Difficulty("hard", "Hard", { size: 24, mineCount: 99 }),
};

export type DifficultyKey = keyof typeof difficulties;
