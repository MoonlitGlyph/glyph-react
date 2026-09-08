import { useRef } from "react";

/** Diagnostic render attempts, including extra development renders. */
export function useRenderCount(): number {
  const count = useRef(0);
  return ++count.current;
}

/** Pass the application's development flag to enable diagnostic logging. */
export function useRenderPrint(id = "Anonymous", enabled = false): void {
  const count = useRenderCount();
  if (enabled) console.log(`Renders (${id}):`, count);
}
