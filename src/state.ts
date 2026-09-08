import type { Dispatch, SetStateAction } from "react";
import { useCallback, useRef, useState } from "react";

export function useOnOff(initial = false) {
  const [state, setState] = useState(initial);
  return {
    state,
    setState,
    on: useCallback(() => setState(true), []),
    off: useCallback(() => setState(false), []),
    toggle: useCallback(() => setState((previous) => !previous), []),
  } as const;
}

export type UseOnOff = ReturnType<typeof useOnOff>;

export function useStateRef<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const ref = useRef(value);
  ref.current = value;
  const setValueRef: Dispatch<SetStateAction<T>> = useCallback((next) => {
    const resolved =
      typeof next === "function"
        ? (next as (current: T) => T)(ref.current)
        : next;
    ref.current = resolved;
    setValue(resolved);
  }, []);
  return [value, setValueRef, ref] as const;
}

export interface DirtyRevision {
  revision: number;
  saved: number;
}

export function useDirtyRef() {
  const dirtyRef = useRef<DirtyRevision>({ revision: 0, saved: 0 });
  const markDirty = useCallback(() => {
    dirtyRef.current.revision += 1;
  }, []);
  const markClean = useCallback(
    (revision: number = dirtyRef.current.revision) => {
      dirtyRef.current.saved = revision;
    },
    [],
  );
  const isClean = useCallback(
    () => dirtyRef.current.revision === dirtyRef.current.saved,
    [],
  );
  return { dirtyRef, markDirty, markClean, isClean };
}
