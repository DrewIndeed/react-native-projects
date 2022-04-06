import { useState, useEffect, useRef } from 'react';

export function useCountDown(idx: number, initDuration: number = -1) {
  const [currentDuration, setCurrentDuration] = useState(-1);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number>();

  // counting down handler
  useEffect(() => {
    // if there is no item in the sequence array, do nothing
    if (idx === -1) return;

    if (isRunning && !intervalRef.current) {
      // use tracking duration to count down
      intervalRef.current = window.setInterval(() => {
        setCurrentDuration((curDur) => {
          // console.log(curDur);
          return curDur - 1;
        });
      }, 1000);
    }

    return cleanup;
  }, [idx, isRunning]);

  // to set initial value of counting down duration
  // THIS WILL OVERRIDE start() if not commented out
  useEffect(() => {
    setCurrentDuration(initDuration);
  }, [initDuration]);

  // clean up overall Count Down hook
  useEffect(() => {
    if (currentDuration === 0) cleanup();
  }, [currentDuration]);

  // clean up function
  const cleanup = () => {
    if (intervalRef.current) {
      console.log(`Cleaning up useCountDown() - ${idx}...`);
      setIsRunning(false);
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  return {
    currentDuration,
    isRunning,
    stop: cleanup,
    start: (count?: number) => {
      // if there is no particular count is specified, use initial duration value
      setCurrentDuration(count || initDuration);
      setIsRunning(true);
    },
  };
}
