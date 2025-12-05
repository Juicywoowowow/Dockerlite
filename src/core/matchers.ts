import { AlsoValue } from './also';
import { MaybeValue } from './maybe';
import { RoughlyValue } from './roughly';

export class Matchers {
  constructor(private actual: any, private isNot: boolean = false) {}

  toBe(expected: any) {
    const actual = this.actual;

    if (expected instanceof MaybeValue) {
      const result = expected.matches(actual);
      if (this.isNot ? result.pass : !result.pass) {
        throw new Error(
          result.message || `Expected ${JSON.stringify(actual)} ${this.isNot ? 'not ' : ''}to match ${expected.toString()}`
        );
      }
      return;
    }

    if (expected instanceof AlsoValue) {
      const passed = expected.matches(actual);
      if (this.isNot ? passed : !passed) {
        throw new Error(
          `Expected ${JSON.stringify(actual)} ${this.isNot ? 'not ' : ''}to be one of ${expected.toString()}`
        );
      }
      return;
    }

    const passed = Object.is(actual, expected);
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${JSON.stringify(actual)} ${this.isNot ? 'not ' : ''}to be ${JSON.stringify(expected)}`
      );
    }
  }

  toEqual(expected: any) {
    if (expected instanceof MaybeValue) {
      const result = expected.matches(this.actual);
      if (this.isNot ? result.pass : !result.pass) {
        throw new Error(
          result.message || `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to match ${expected.toString()}`
        );
      }
      return;
    }

    if (expected instanceof AlsoValue) {
      const passed = expected.matches(this.actual);
      if (this.isNot ? passed : !passed) {
        throw new Error(
          `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to equal one of ${expected.toString()}`
        );
      }
      return;
    }

    const passed = this.deepEqual(this.actual, expected);
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to equal ${JSON.stringify(expected)}`
      );
    }
  }

  toBeTruthy() {
    const passed = !!this.actual;
    if (this.isNot ? passed : !passed) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to be truthy`);
    }
  }

  toBeFalsy() {
    const passed = !this.actual;
    if (this.isNot ? passed : !passed) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to be falsy`);
    }
  }

  toBeNull() {
    const passed = this.actual === null;
    if (this.isNot ? passed : !passed) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to be null`);
    }
  }

  toBeUndefined() {
    const passed = this.actual === undefined;
    if (this.isNot ? passed : !passed) {
      throw new Error(`Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to be undefined`);
    }
  }

  toContain(item: any) {
    const passed = Array.isArray(this.actual) 
      ? this.actual.includes(item)
      : typeof this.actual === 'string' && this.actual.includes(item);
    
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to contain ${JSON.stringify(item)}`
      );
    }
  }

  toThrow(expected?: any) {
    if (typeof this.actual !== 'function') {
      throw new Error('toThrow expects a function');
    }

    let thrown = false;
    let error: any;

    try {
      this.actual();
    } catch (e) {
      thrown = true;
      error = e;
    }

    if (this.isNot) {
      if (thrown) {
        throw new Error(`Expected function not to throw but it threw: ${error.message}`);
      }
      return;
    }

    if (!thrown) {
      throw new Error('Expected function to throw but it didn\'t');
    }

    if (expected) {
      if (typeof expected === 'function') {
        if (!(error instanceof expected)) {
          throw new Error(`Expected function to throw ${expected.name} but threw ${error.constructor.name}`);
        }
      } else if (typeof expected === 'string') {
        if (!error.message.includes(expected)) {
          throw new Error(`Expected error message to include "${expected}" but got "${error.message}"`);
        }
      }
    }
  }

  toHaveBeenCalled() {
    if (!this.actual || typeof this.actual.getCallCount !== 'function') {
      throw new Error('toHaveBeenCalled expects a mock function');
    }

    const callCount = this.actual.getCallCount();
    const passed = callCount > 0;

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected mock function ${this.isNot ? 'not ' : ''}to have been called, but it was called ${callCount} times`
      );
    }
  }

  toHaveBeenCalledWith(...args: any[]) {
    if (!this.actual || typeof this.actual.wasCalledWith !== 'function') {
      throw new Error('toHaveBeenCalledWith expects a mock function');
    }

    const passed = this.actual.wasCalledWith(...args);

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected mock function ${this.isNot ? 'not ' : ''}to have been called with ${JSON.stringify(args)}`
      );
    }
  }

  toHaveBeenCalledTimes(times: number) {
    if (!this.actual || typeof this.actual.getCallCount !== 'function') {
      throw new Error('toHaveBeenCalledTimes expects a mock function');
    }

    const callCount = this.actual.getCallCount();
    const passed = callCount === times;

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected mock function ${this.isNot ? 'not ' : ''}to have been called ${times} times, but it was called ${callCount} times`
      );
    }
  }

  toBeInstanceOf(expectedClass: any) {
    const passed = this.actual instanceof expectedClass;
    if (this.isNot ? passed : !passed) {
      const actualType = this.actual?.constructor?.name || typeof this.actual;
      throw new Error(
        `Expected ${actualType} ${this.isNot ? 'not ' : ''}to be instance of ${expectedClass.name}`
      );
    }
  }

  toBeTypeOf(expectedType: string) {
    const actualType = typeof this.actual;
    const passed = actualType === expectedType;
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected type ${actualType} ${this.isNot ? 'not ' : ''}to be ${expectedType}`
      );
    }
  }

  toBeCloseTo(expected: number, precision: number = 2) {
    if (typeof this.actual !== 'number' || typeof expected !== 'number') {
      throw new Error('toBeCloseTo expects numbers');
    }

    const multiplier = Math.pow(10, precision);
    const actualRounded = Math.round(this.actual * multiplier);
    const expectedRounded = Math.round(expected * multiplier);
    const passed = actualRounded === expectedRounded;

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be close to ${expected} (precision: ${precision})`
      );
    }
  }

  toBeNaN() {
    const passed = Number.isNaN(this.actual);
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be NaN`
      );
    }
  }

  toBeFinite() {
    const passed = Number.isFinite(this.actual);
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be finite`
      );
    }
  }

  toHaveProperty(key: string, value?: any) {
    if (typeof this.actual !== 'object' || this.actual === null) {
      throw new Error('toHaveProperty expects an object');
    }

    const hasProperty = key in this.actual;
    
    if (!hasProperty) {
      if (!this.isNot) {
        throw new Error(`Expected object to have property "${key}"`);
      }
      return;
    }

    if (this.isNot && !arguments.length) {
      throw new Error(`Expected object not to have property "${key}"`);
    }

    if (arguments.length > 1) {
      const actualValue = this.actual[key];
      const valuesMatch = this.deepEqual(actualValue, value);
      
      if (this.isNot ? valuesMatch : !valuesMatch) {
        throw new Error(
          `Expected property "${key}" ${this.isNot ? 'not ' : ''}to be ${JSON.stringify(value)}, but got ${JSON.stringify(actualValue)}`
        );
      }
    }
  }

  toHaveLength(expected: number) {
    if (this.actual === null || this.actual === undefined || typeof this.actual.length !== 'number') {
      throw new Error('toHaveLength expects an object with a length property');
    }

    const passed = this.actual.length === expected;
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected length ${this.actual.length} ${this.isNot ? 'not ' : ''}to be ${expected}`
      );
    }
  }

  toContainEqual(item: any) {
    if (!Array.isArray(this.actual)) {
      throw new Error('toContainEqual expects an array');
    }

    const passed = this.actual.some(element => this.deepEqual(element, item));
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected array ${this.isNot ? 'not ' : ''}to contain ${JSON.stringify(item)}`
      );
    }
  }

  toStartWith(prefix: string) {
    if (typeof this.actual !== 'string') {
      throw new Error('toStartWith expects a string');
    }

    const passed = this.actual.startsWith(prefix);
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected "${this.actual}" ${this.isNot ? 'not ' : ''}to start with "${prefix}"`
      );
    }
  }

  toEndWith(suffix: string) {
    if (typeof this.actual !== 'string') {
      throw new Error('toEndWith expects a string');
    }

    const passed = this.actual.endsWith(suffix);
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected "${this.actual}" ${this.isNot ? 'not ' : ''}to end with "${suffix}"`
      );
    }
  }

  async toResolve() {
    const actual = this.actual;

    if (!(actual instanceof Promise)) {
      throw new Error('toResolve expects a Promise');
    }

    try {
      await actual;
      if (this.isNot) {
        throw new Error('Expected promise not to resolve but it did');
      }
    } catch (error) {
      if (!this.isNot) {
        throw new Error(`Expected promise to resolve but it rejected with: ${(error as Error).message}`);
      }
    }
  }

  async toReject() {
    if (!(this.actual instanceof Promise)) {
      throw new Error('toReject expects a Promise');
    }

    try {
      await this.actual;
      if (!this.isNot) {
        throw new Error('Expected promise to reject but it resolved');
      }
    } catch (error) {
      if (this.isNot) {
        throw new Error('Expected promise not to reject but it did');
      }
    }
  }

  async toResolveWith(expected: any) {
    if (!(this.actual instanceof Promise)) {
      throw new Error('toResolveWith expects a Promise');
    }

    try {
      const result = await this.actual;
      const passed = this.deepEqual(result, expected);
      
      if (this.isNot ? passed : !passed) {
        throw new Error(
          `Expected promise ${this.isNot ? 'not ' : ''}to resolve with ${JSON.stringify(expected)}, but got ${JSON.stringify(result)}`
        );
      }
    } catch (error) {
      throw new Error(`Expected promise to resolve but it rejected with: ${(error as Error).message}`);
    }
  }

  toMatchSnapshot() {
    const { snapshotManager } = require('./snapshot');
    const result = snapshotManager.matchSnapshot(this.actual);
    
    if (!result.pass) {
      throw new Error(result.message || 'Snapshot mismatch');
    }
  }

  toBeGreaterThan(expected: number) {
    if (typeof this.actual !== 'number' || typeof expected !== 'number') {
      throw new Error('toBeGreaterThan expects numbers');
    }

    const passed = this.actual > expected;
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be greater than ${expected}`
      );
    }
  }

  toBeLessThan(expected: number) {
    if (typeof this.actual !== 'number' || typeof expected !== 'number') {
      throw new Error('toBeLessThan expects numbers');
    }

    const passed = this.actual < expected;
    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be less than ${expected}`
      );
    }
  }

  toMatch(pattern: RegExp | string) {
    if (typeof this.actual !== 'string') {
      throw new Error('toMatch expects a string');
    }

    const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
    const passed = regex.test(this.actual);

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected "${this.actual}" ${this.isNot ? 'not ' : ''}to match ${regex.toString()}`
      );
    }
  }

  toRoughlyMatch(expected: string | RoughlyValue, options?: { distance?: number }) {
    if (typeof this.actual !== 'string') {
      throw new Error('toRoughlyMatch expects a string');
    }

    let roughlyValue: RoughlyValue;
    if (expected instanceof RoughlyValue) {
      roughlyValue = expected;
    } else {
      const { Roughly } = require('./roughly');
      roughlyValue = Roughly(expected, options);
    }

    const passed = roughlyValue.matches(this.actual);

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected "${this.actual}" ${this.isNot ? 'not ' : ''}to roughly match "${expected instanceof RoughlyValue ? expected.toString() : expected}"`
      );
    }
  }

  toRoughlyEqual(expected: any, options?: { tolerance?: number; ignoreKeys?: string[] }) {
    const tolerance = options?.tolerance ?? 0.1;
    const ignoreKeys = options?.ignoreKeys ?? [];

    const passed = this.roughlyEqual(this.actual, expected, tolerance, ignoreKeys);

    if (this.isNot ? passed : !passed) {
      throw new Error(
        `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not ' : ''}to roughly equal ${JSON.stringify(expected)} (tolerance: ${tolerance})`
      );
    }
  }

  private roughlyEqual(a: any, b: any, tolerance: number, ignoreKeys: string[]): boolean {
    if (typeof a === 'number' && typeof b === 'number') {
      const diff = Math.abs(a - b);
      const avg = (Math.abs(a) + Math.abs(b)) / 2;
      return diff <= avg * tolerance;
    }

    if (typeof a !== typeof b) return false;
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object') return a === b;

    const keysA = Object.keys(a).filter(k => !ignoreKeys.includes(k));
    const keysB = Object.keys(b).filter(k => !ignoreKeys.includes(k));

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.roughlyEqual(a[key], b[key], tolerance, ignoreKeys)) return false;
    }

    return true;
  }

  toBeBetween(min: number, max: number, options?: { inclusive?: boolean }) {
    if (typeof this.actual !== 'number' || typeof min !== 'number' || typeof max !== 'number') {
      throw new Error('toBeBetween expects numbers');
    }

    const inclusive = options?.inclusive !== false; // Default to true
    const passed = inclusive 
      ? (this.actual >= min && this.actual <= max)
      : (this.actual > min && this.actual < max);

    if (this.isNot ? passed : !passed) {
      const rangeType = inclusive ? 'inclusive' : 'exclusive';
      throw new Error(
        `Expected ${this.actual} ${this.isNot ? 'not ' : ''}to be between ${min} and ${max} (${rangeType})`
      );
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
}
