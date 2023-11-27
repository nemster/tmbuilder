/* eslint-disable no-restricted-syntax */

import BigNumber from "bignumber.js";

// TODO: different exchanges might have different
// precision requirements for pair prices and amounts
export const DEFAULT_DECIMAL_PLACES = 18;
BigNumber.config({
  DECIMAL_PLACES: DEFAULT_DECIMAL_PLACES,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
});

export class PrecisionNumber {
  /// A wrapper around BigNumber that ensures a consistent
  /// precision of decimals for all operations.

  private readonly value: BigNumber;

  constructor(value: BigNumber | string | number) {
    this.value = new BigNumber(value).decimalPlaces(
      this.getDecimalPlaces(),
      BigNumber.ROUND_HALF_UP
    );
  }

  static setPrecision(precision: number): void {
    BigNumber.config({ DECIMAL_PLACES: precision });
  }

  private getDecimalPlaces(): number {
    return BigNumber.config().DECIMAL_PLACES ?? DEFAULT_DECIMAL_PLACES;
  }

  // Return a new instance instead of mutating
  plus(other: PrecisionNumber): PrecisionNumber {
    return new PrecisionNumber(this.value.plus(other.value));
  }

  minus(other: PrecisionNumber): PrecisionNumber {
    return new PrecisionNumber(this.value.minus(other.value));
  }

  multipliedBy(other: PrecisionNumber): PrecisionNumber {
    return new PrecisionNumber(this.value.multipliedBy(other.value));
  }

  dividedBy(other: PrecisionNumber): PrecisionNumber {
    return new PrecisionNumber(this.value.dividedBy(other.value));
  }

  // Comparison methods
  isEqualTo(other: PrecisionNumber): boolean {
    return this.value.isEqualTo(other.value);
  }

  isGreaterThan(other: PrecisionNumber): boolean {
    return this.value.isGreaterThan(other.value);
  }

  isGreaterThanOrEqualTo(other: PrecisionNumber): boolean {
    return this.value.isGreaterThanOrEqualTo(other.value);
  }

  isLessThan(other: PrecisionNumber): boolean {
    return this.value.isLessThan(other.value);
  }

  isLessThanOrEqualTo(other: PrecisionNumber): boolean {
    return this.value.isLessThanOrEqualTo(other.value);
  }

  isZero(): boolean {
    return this.value.isZero();
  }

  isPositive(): boolean {
    return this.value.isPositive();
  }

  isNegative(): boolean {
    return this.value.isNegative();
  }

  isGreaterThanZero(): boolean {
    return this.isGreaterThan(PrecisionNumber.ZERO());
  }

  floor(): PrecisionNumber {
    return new PrecisionNumber(this.value.integerValue());
  }

  // String conversion
  toString(): string {
    return this.value.toFixed(); // Ensures consistent string representation
  }

  // Static method to create a PrecisionNumber from a string
  static fromString(str: string): PrecisionNumber {
    return new PrecisionNumber(str);
  }

  static ZERO(): PrecisionNumber {
    return new PrecisionNumber("0");
  }
}

export default PrecisionNumber;
