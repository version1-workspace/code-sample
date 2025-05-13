import { useState } from "react";

enum Status {
  initial = "initial",
  playing = "playing",
  gameover = "gameover",
  success = "success",
}

export function useStatus() {
  const [status, setStatus] = useState(Status.initial);

  const success = () => setStatus(Status.success);
  const start = () => setStatus(Status.playing);
  const gameover = () => setStatus(Status.gameover);
  const initial = () => setStatus(Status.initial);

  const isInitial = status === Status.initial;
  const isPlaying = status === Status.playing;
  const isGameover = status === Status.gameover;
  const isSuccess = status === Status.success;

  return {
    status,
    success,
    start,
    gameover,
    initial,
    isInitial,
    isPlaying,
    isGameover,
    isSuccess,
  };
}
