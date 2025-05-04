import { useState } from "react";
import { DifficultyKey, difficulties } from "../domains/game/models/difficulty";

export function useDifficulty() {
  // TODO: Implement
  return {
    difficulty: difficulties.medium,
    change: (key: DifficultyKey) => {
      return difficulties.medium;
    },
  };
}
