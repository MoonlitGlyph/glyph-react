import { useRef } from "react";

/** Draw without replacement; refill from the latest values when exhausted. */
export function useRandomPool<T>(values: readonly T[]) {
  const pool = useRef([...values]);
  return (): T | undefined => {
    if (pool.current.length === 0) pool.current = [...values];
    const index = Math.floor(Math.random() * pool.current.length);
    return pool.current.splice(index, 1)[0];
  };
}
