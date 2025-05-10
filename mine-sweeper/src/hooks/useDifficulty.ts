import { useState } from "react";
import {
  Difficulty,
  DifficultyKey,
  difficulties,
} from "../domains/game/models/difficulty";

export function useDifficulty() {
  const [difficulty, setDifficulty] = useState<Difficulty>(difficulties.medium);

  return {
    difficulty,
    change: (key: DifficultyKey) => {
      const value = difficulties[key];
      setDifficulty(value);
    },
  };
}
