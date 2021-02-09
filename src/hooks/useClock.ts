import { useCallback, useRef, useState } from 'react';
const MS_INTERVAL = 500;

export const useTimer = () => {
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const countRef = useRef<NodeJS.Timeout>();

  const handleStart = useCallback(() => {
    setIsActive(true);
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, MS_INTERVAL);
  }, []);

  const handlePause = useCallback(() => {
    countRef.current && clearInterval(countRef.current);
    setIsPaused(false);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(true);
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, 1000);
  }, []);

  const handleReset = useCallback(() => {
    countRef.current && clearInterval(countRef.current);
    setIsActive(false);
    setIsPaused(false);
    setTimer(0);
  }, []);

  return {
    timer,
    isActive,
    isPaused,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
    interval: MS_INTERVAL,
  };
};
