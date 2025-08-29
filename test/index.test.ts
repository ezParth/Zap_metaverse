import type { Int32 } from "mongoose"

function add(a: number, b: number): number {
    return a + b
}

test("Add two values", () => {
    expect(add(1, 2)).toBe(3);
  });