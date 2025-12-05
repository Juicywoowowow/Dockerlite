export class MaybeValue {
  private isRange: boolean;
  private min?: number;
  private max?: number;
  private values: any[];

  constructor(...args: any[]) {
    // If 2 arguments and both are numbers, treat as range
    if (args.length === 2 && typeof args[0] === 'number' && typeof args[1] === 'number') {
      this.isRange = true;
      this.min = args[0];
      this.max = args[1];
      this.values = [];
    } else {
      this.isRange = false;
      this.values = args;
    }
  }

  matches(actual: any): { pass: boolean; matchedValue?: any; message?: string } {
    if (this.isRange) {
      if (typeof actual !== 'number') {
        return {
          pass: false,
          message: `Expected a number for range check, but got ${typeof actual}`
        };
      }

      const inRange = actual >= this.min! && actual <= this.max!;
      if (inRange) {
        // Log the matched value with yellow color
        console.log(`\x1b[33m  ✓ Matched value: ${actual} (within range ${this.min}-${this.max})\x1b[0m`);
        return { pass: true, matchedValue: actual };
      } else {
        return {
          pass: false,
          message: `Value ${actual} is outside range ${this.min}-${this.max}`
        };
      }
    } else {
      // Check explicit list of values
      const matchIndex = this.values.findIndex(value => this.deepEqual(actual, value));
      
      if (matchIndex !== -1) {
        // Log the matched value with yellow color
        console.log(`\x1b[33m  ✓ Matched value: ${JSON.stringify(actual)} (out of ${this.values.length} possibilities)\x1b[0m`);
        return { pass: true, matchedValue: this.values[matchIndex] };
      } else {
        return {
          pass: false,
          message: `Value ${JSON.stringify(actual)} does not match any of the ${this.values.length} possibilities`
        };
      }
    }
  }

  private deepEqual(a: any, b: any): boolean {
    if (Object.is(a, b)) return true;
    if (a === null || b === null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.deepEqual(a[key], b[key])) return false;
    }

    return true;
  }

  toString(): string {
    if (this.isRange) {
      return `Maybe(${this.min}, ${this.max})`;
    }
    return `Maybe(${this.values.map(v => JSON.stringify(v)).join(', ')})`;
  }
}

export function Maybe(...args: any[]): MaybeValue {
  return new MaybeValue(...args);
}
