import { useEffect, useState } from "react";
import { Timer } from "../domains/game/models/timer";

export function useTimer() {
  const [timer, setTimer] = useState<Timer>(new Timer());
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    timer.tick((newTimer: Timer) => {
      setTimer(newTimer);
    });
  }, [isRunning, timer]);

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
  };

  const reset = () => {
    setTimer(new Timer());
    setIsRunning(false);
  };

  return {
    timer,
    start,
    stop,
    reset,
  };
}
