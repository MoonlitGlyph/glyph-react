import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useDebounce, useDebounceLead, useDebounceTrail } from "../src/time.js";
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
  it("debounces leading calls until the last call has settled", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebounce(callback, 100, "leading"),
    );
    act(() => result.current(1));
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(1);

    act(() => {
      vi.advanceTimersByTime(50);
      result.current(2);
      vi.advanceTimersByTime(50);
      result.current(3);
      vi.advanceTimersByTime(99);
    });
    expect(callback).toHaveBeenCalledOnce();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(callback).toHaveBeenCalledOnce();
    act(() => result.current(4));
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenLastCalledWith(4);

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledTimes(2);
    unmount();
    vi.useRealTimers();
  });
  it.each([
    ["leading", useDebounceLead],
    ["trailing", useDebounceTrail],
  ] as const)("provides a %s debounce helper", (edge, useHook) => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const { result, unmount } = renderHook(() => useHook(callback, 100));
    act(() => {
      result.current(1);
      result.current(2);
    });
    expect(callback).toHaveBeenCalledTimes(edge === "leading" ? 1 : 0);
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(edge === "leading" ? 1 : 2);
    unmount();
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
