import { useCallback, useEffect, useRef, useState } from "react";

export type DebounceEdge = "leading" | "trailing";

export function useDebounce<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
  edge: DebounceEdge = "trailing",
) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  callbackRef.current = callback;
  useEffect(
    () => () => {
      clearTimeout(timeoutRef.current);
    },
    [],
  );
  return useCallback(
    (...args: Args) => {
      const invokeLeading =
        edge === "leading" && timeoutRef.current === undefined;

      clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        timeoutRef.current = undefined;

        if (edge === "trailing") {
          callbackRef.current(...args);
        }
      }, delayMs);

      if (invokeLeading) {
        callbackRef.current(...args);
      }
    },
    [delayMs, edge],
  );
}

export function useDebounceLead<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  return useDebounce(callback, delayMs, "leading");
}

export function useDebounceTrail<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delayMs: number,
) {
  return useDebounce(callback, delayMs, "trailing");
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
