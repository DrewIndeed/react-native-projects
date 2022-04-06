import { useState, useEffect, useRef } from 'react';

export function useCountDown(idx: number, initDuration: number) {
  const [currentDuration, setCurrentDuration] = useState(-1);
  const intervalRef = useRef<number>();

  // counting down handler
  useEffect(() => {
    // if there is no item in the sequence array, do nothing
    if (idx === -1) return;

    // use tracking duration to count down
    intervalRef.current = window.setInterval(() => {
      setCurrentDuration((curDur) => {
        console.log(curDur);
        return curDur - 1;
      });
    }, 50);

    return cleanup;
  }, [idx]);

  // to set initial value of counting down duration
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
      console.log('Cleaning up useCountDown()...');
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  };

  return currentDuration;
}
