import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce } from "../src/time.js";
import { useDirtyRef } from "../src/state.js";
import { useOnOff } from "../src/state.js";
import { useStateRef } from "../src/state.js";
import { useToggleInterval } from "../src/time.js";

describe("@raincheck/glyph-react", () => {
  it("controls boolean state", () => {
    const { result } = renderHook(() => useOnOff());
    act(result.current.on);
    expect(result.current.state).toBe(true);
    act(result.current.toggle);
    expect(result.current.state).toBe(false);
  });
  it("keeps state and ref synchronized", () => {
    const { result } = renderHook(() => useStateRef(1));
    act(() => result.current[1]((value) => value + 1));
    expect(result.current[0]).toBe(2);
    expect(result.current[2].current).toBe(2);
  });
  it("tracks dirty revisions", () => {
    const { result } = renderHook(useDirtyRef);
    act(result.current.markDirty);
    expect(result.current.isClean()).toBe(false);
    act(() => result.current.markClean());
    expect(result.current.isClean()).toBe(true);
  });
  it("debounces calls", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce(callback, 100));
    act(() => {
      result.current(1);
      result.current(2);
      vi.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(2);
    vi.useRealTimers();
  });
  it("toggles on an interval", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToggleInterval(100));
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe(true);
    vi.useRealTimers();
  });
});
