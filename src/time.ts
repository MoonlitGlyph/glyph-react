import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  callbackRef.current = callback;
  useEffect(() => () => clearTimeout(timeoutRef.current), []);
  return useCallback(
    (...args: Args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(
        () => callbackRef.current(...args),
        delayMs,
      );
    },
    [delayMs],
  );
}

export function useToggleInterval(
  intervalMs: number,
  initial = false,
  enabled = true,
): boolean {
  const [value, setValue] = useState(initial);
  useEffect(() => {
    if (!enabled) return undefined;
    const id = setInterval(() => setValue((previous) => !previous), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs, enabled]);
  return value;
}
