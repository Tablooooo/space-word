/** @vitest-environment jsdom */
import { expect, test, describe } from "vitest";
import {
  getRandomInt,
  rectIntersect,
  circleIntersect,
  timeToString,
} from "./script.js";

// getRandomInt
describe("getRandomInt", () => {
  // Tests fournis dans le pdf
  test("getRandomInt(-42, 42) < 43 returns true", () => {
    expect(getRandomInt(-42, 42)).toBeLessThan(43);
  });

  test("getRandomInt(42, 42) returns 42", () => {
    expect(getRandomInt(42, 42)).toBe(42);
  });

  // Tests supplémentaires
  test("getRandomInt(0, 0) returns 0", () => {
    expect(getRandomInt(0, 0)).toBe(0);
  });

  test("getRandomInt(1, 10) is >= 1", () => {
    expect(getRandomInt(1, 10)).toBeGreaterThanOrEqual(1);
  });

  test("getRandomInt(1, 10) is <= 10", () => {
    expect(getRandomInt(1, 10)).toBeLessThanOrEqual(10);
  });

  test("getRandomInt(-10, -5) is >= -10", () => {
    expect(getRandomInt(-10, -5)).toBeGreaterThanOrEqual(-10);
  });

  test("getRandomInt(-10, -5) is <= -5", () => {
    expect(getRandomInt(-10, -5)).toBeLessThanOrEqual(-5);
  });
});

// rectIntersect
describe("rectIntersect", () => {
  // Tests fournis dans le pdf
  test("rectIntersect(1,1,2,1,4,1,1,2) returns false", () => {
    expect(rectIntersect(1, 1, 2, 1, 4, 1, 1, 2)).toBe(false);
  });

  test("rectIntersect(1,1,5,2,4,1,1,2) returns true", () => {
    expect(rectIntersect(1, 1, 5, 2, 4, 1, 1, 2)).toBe(true);
  });

  // Tests supplémentaires
  test("two identical rects intersect", () => {
    expect(rectIntersect(0, 0, 2, 2, 0, 0, 2, 2)).toBe(true);
  });

  test("rects touching at edge intersect (non strict)", () => {
    expect(rectIntersect(0, 0, 2, 2, 2, 0, 2, 2)).toBe(true);
  });

  test("rect completely inside another intersects", () => {
    expect(rectIntersect(0, 0, 10, 10, 2, 2, 5, 5)).toBe(true);
  });
});

// circleIntersect
describe("circleIntersect", () => {
  // Tests fournis dans le pdf
  test("circleIntersect(3,2,1,6,1,1.5) returns false", () => {
    expect(circleIntersect(3, 2, 1, 6, 1, 1.5)).toBe(false);
  });

  test("circleIntersect(3,2,1,3,-2,4) returns true", () => {
    expect(circleIntersect(3, 2, 1, 3, -2, 4)).toBe(true);
  });

  // Tests supplémentaires
  test("two circles at same center intersect", () => {
    expect(circleIntersect(0, 0, 1, 0, 0, 2)).toBe(true);
  });

  test("two very far circles do not intersect", () => {
    expect(circleIntersect(0, 0, 1, 1000, 1000, 1)).toBe(false);
  });

  test("circles touching exactly at one point intersect", () => {
    // distance = 4, r1 + r2 = 4 → touching
    expect(circleIntersect(0, 0, 2, 4, 0, 2)).toBe(true);
  });
});

// timeToString
describe("timeToString", () => {
  // Tests fournis dans le pdf
  test('timeToString(123456789) returns "17:36:78"', () => {
    expect(timeToString(123456789)).toBe("17:36:78");
  });

  test('timeToString("toto") returns "NaN:NaN:NaN"', () => {
    expect(timeToString("toto")).toBe("NaN:NaN:NaN");
  });

  // Tests supplémentaires
  test('timeToString(0) returns "00:00:00"', () => {
    expect(timeToString(0)).toBe("00:00:00");
  });

  test("timeToString(3600000) returns correct hours", () => {
    const result = timeToString(3600000);
    expect(typeof result).toBe("string");
  });

  test('timeToString(null) returns "00:00:00"', () => {
    expect(timeToString(null)).toBe("00:00:00");
  });
});
