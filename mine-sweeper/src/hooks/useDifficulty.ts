import { useState } from "react";
import { DifficultyKey, difficulties } from "../domains/game/models/difficulty";

export function useDifficulty() {
  const [difficulty, setDifficulty] = useState(difficulties.easy);

  const change = (difficulty: DifficultyKey) => {
    const d = difficulties[difficulty];
    setDifficulty(d);
    return d;
  };

  return {
    difficulty,
    change,
  };
}
