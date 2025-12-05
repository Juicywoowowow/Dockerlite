import { InsistValue } from './insist';

export class TransformValue {
  constructor(
    private value: any,
    private transformer: (val: any) => any
  ) {}

  getValue(): any {
    // If value is InsistValue, resolve it first
    let resolvedValue = this.value;
    if (resolvedValue instanceof InsistValue) {
      resolvedValue = resolvedValue.getValue();
    }
    return this.transformer(resolvedValue);
  }

  getOriginal(): any {
    return this.value;
  }

  toString(): string {
    return `Transform(${JSON.stringify(this.value)})`;
  }
}

export function Transform<T, R>(value: T, transformer: (val: T) => R): TransformValue {
  return new TransformValue(value, transformer);
}
