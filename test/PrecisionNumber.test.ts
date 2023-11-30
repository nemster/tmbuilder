import { describe, it, expect, beforeAll } from "vitest";
import { PrecisionNumber } from "../src/lib/PrecisionNumber";

beforeAll(() => {
  PrecisionNumber.setPrecision(2);
});

describe("PrecisionNumber Arithmetic Operations", () => {
  it("adds 0.105 and 0.215 correctly", () => {
    const numA = PrecisionNumber.fromString("0.105");
    const numB = PrecisionNumber.fromString("0.215");
    expect(numA.plus(numB).toString()).toBe("0.33");
  });

  it("subtracts 0.215 from 0.105 correctly", () => {
    const numA = PrecisionNumber.fromString("0.105");
    const numB = PrecisionNumber.fromString("0.215");
    expect(numA.minus(numB).toString()).toBe("-0.11");
  });

  it("multiplies 0.105 and 0.215 correctly", () => {
    const numA = PrecisionNumber.fromString("0.105");
    const numB = PrecisionNumber.fromString("0.215");
    expect(numA.multipliedBy(numB).toString()).toBe("0.02");
  });

  it("divides 0.105 by 0.215 correctly", () => {
    const numA = PrecisionNumber.fromString("0.105");
    const numB = PrecisionNumber.fromString("0.215");
    expect(numA.dividedBy(numB).toString()).toBe("0.5");
  });

  it("makes back and forth conversions between string and PrecisionNumber consistent", () => {
    const numA = PrecisionNumber.fromString("0.105");
    const numB = PrecisionNumber.fromString(numA.toString());
    expect(numA.isEqualTo(numB)).toBeTruthy();
    expect(numB.toString()).toBe("0.11");
  });
});
