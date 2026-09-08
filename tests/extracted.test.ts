import { renderHook } from "@testing-library/react";
import { expect, it } from "vitest";
import { useDocumentTitle } from "../src/document.js";
import { useRandomPool } from "../src/array.js";

it("exhausts the pool before refilling from current values", () => {
  const { result, rerender } = renderHook(
    ({ values }) => useRandomPool(values),
    { initialProps: { values: [1, 2, 3] } },
  );
  expect(
    new Set([result.current(), result.current(), result.current()]),
  ).toEqual(new Set([1, 2, 3]));
  rerender({ values: [4] });
  expect(result.current()).toBe(4);
  rerender({ values: [] });
  expect(result.current()).toBeUndefined();
});
it("updates the title when the site name changes", () => {
  const { rerender } = renderHook(
    ({ site }) => useDocumentTitle("Journal", site),
    { initialProps: { site: "Weather" } },
  );
  expect(document.title).toBe("Journal | Weather");
  rerender({ site: "New" });
  expect(document.title).toBe("Journal | New");
});
