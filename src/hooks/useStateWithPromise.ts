import { useCallback, useEffect, useRef, useState } from 'react';

// Adapted from https://ysfaran.github.io/blog/post/0002-use-state-with-promise/
export const useStateWithPromise = <T extends unknown>(
  initialState: T
): [T, (state: T) => Promise<T>] => {
  const [state, setState] = useState(initialState);
  const resolverRef = useRef<((state: T) => void) | null>(null);

  useEffect(() => {
    if (resolverRef.current) {
      resolverRef.current(state);
      resolverRef.current = null;
    }
    /**
     * Since a state update could be triggered with the exact same state again,
     * it's not enough to specify state as the only dependency of this useEffect.
     * That's why resolverRef.current is also a dependency, because it will guarantee,
     * that handleSetState was called in previous render
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolverRef.current, state]);

  const handleSetState: (state: T) => Promise<T> = useCallback(
    (stateAction) => {
      setState(stateAction);
      return new Promise((resolve) => {
        resolverRef.current = resolve;
      });
    },
    [setState]
  );

  return [state, handleSetState];
};
