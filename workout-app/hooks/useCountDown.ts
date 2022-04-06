import { useState, useEffect } from 'react';

export function useCountDown(idx: number, initDuration: number) {
  const [currentDuration, setCurrentDuration] = useState(-1);

  // counting down handler
  useEffect(() => {
    // if there is no item in the sequence array, do nothing
    if (idx === -1) return;

    // use tracking duration to count down
    const intervalId = window.setInterval(() => {
      setCurrentDuration((curDur) => {
        console.log(curDur);
        return curDur - 1;
      });
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [idx]);

  // to set initial value of counting down duration
  useEffect(() => {
    setCurrentDuration(initDuration);
  }, [initDuration]);

  return currentDuration;
}
