export class AlsoValue {
  constructor(public values: any[]) {}

  matches(actual: any): boolean {
    return this.values.some(value => {
      if (value instanceof AlsoValue) {
        return value.matches(actual);
      }
      return this.deepEqual(actual, value);
    });
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
    return `Also(${this.values.map(v => JSON.stringify(v)).join(', ')})`;
  }
}

export function Also(...values: any[]): AlsoValue {
  return new AlsoValue(values);
}
