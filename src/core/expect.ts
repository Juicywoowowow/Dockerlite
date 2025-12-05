import { Matchers } from './matchers';
import { PleaseValue } from './please';
import { TransformValue } from './transform';
import { InsistValue } from './insist';

export function expect(actual: any) {
  // Handle Transform values
  if (actual instanceof TransformValue) {
    actual = actual.getValue();
  }

  // Handle Insist values - resolve immediately
  if (actual instanceof InsistValue) {
    actual = actual.getValue();
  }

  // If actual is a Please value, extract the forced value and show warning
  const actualValue = actual instanceof PleaseValue ? actual.getValue() : actual;
  
  const matchers = new Matchers(actualValue, false);
  const notMatchers = new Matchers(actualValue, true);
  
  return {
    toBe: matchers.toBe.bind(matchers),
    toEqual: matchers.toEqual.bind(matchers),
    toBeTruthy: matchers.toBeTruthy.bind(matchers),
    toBeFalsy: matchers.toBeFalsy.bind(matchers),
    toBeNull: matchers.toBeNull.bind(matchers),
    toBeUndefined: matchers.toBeUndefined.bind(matchers),
    toContain: matchers.toContain.bind(matchers),
    toThrow: matchers.toThrow.bind(matchers),
    toBeGreaterThan: matchers.toBeGreaterThan.bind(matchers),
    toBeLessThan: matchers.toBeLessThan.bind(matchers),
    toMatch: matchers.toMatch.bind(matchers),
    toHaveBeenCalled: matchers.toHaveBeenCalled.bind(matchers),
    toHaveBeenCalledWith: matchers.toHaveBeenCalledWith.bind(matchers),
    toHaveBeenCalledTimes: matchers.toHaveBeenCalledTimes.bind(matchers),
    toBeInstanceOf: matchers.toBeInstanceOf.bind(matchers),
    toBeTypeOf: matchers.toBeTypeOf.bind(matchers),
    toBeCloseTo: matchers.toBeCloseTo.bind(matchers),
    toBeNaN: matchers.toBeNaN.bind(matchers),
    toBeFinite: matchers.toBeFinite.bind(matchers),
    toHaveProperty: matchers.toHaveProperty.bind(matchers),
    toHaveLength: matchers.toHaveLength.bind(matchers),
    toContainEqual: matchers.toContainEqual.bind(matchers),
    toStartWith: matchers.toStartWith.bind(matchers),
    toEndWith: matchers.toEndWith.bind(matchers),
    toResolve: matchers.toResolve.bind(matchers),
    toReject: matchers.toReject.bind(matchers),
    toResolveWith: matchers.toResolveWith.bind(matchers),
    toMatchSnapshot: matchers.toMatchSnapshot.bind(matchers),
    toBeBetween: matchers.toBeBetween.bind(matchers),
    toRoughlyMatch: matchers.toRoughlyMatch.bind(matchers),
    toRoughlyEqual: matchers.toRoughlyEqual.bind(matchers),
    not: {
      toBe: notMatchers.toBe.bind(notMatchers),
      toEqual: notMatchers.toEqual.bind(notMatchers),
      toBeTruthy: notMatchers.toBeTruthy.bind(notMatchers),
      toBeFalsy: notMatchers.toBeFalsy.bind(notMatchers),
      toBeNull: notMatchers.toBeNull.bind(notMatchers),
      toBeUndefined: notMatchers.toBeUndefined.bind(notMatchers),
      toContain: notMatchers.toContain.bind(notMatchers),
      toThrow: notMatchers.toThrow.bind(notMatchers),
      toBeGreaterThan: notMatchers.toBeGreaterThan.bind(notMatchers),
      toBeLessThan: notMatchers.toBeLessThan.bind(notMatchers),
      toMatch: notMatchers.toMatch.bind(notMatchers),
      toHaveBeenCalled: notMatchers.toHaveBeenCalled.bind(notMatchers),
      toHaveBeenCalledWith: notMatchers.toHaveBeenCalledWith.bind(notMatchers),
      toHaveBeenCalledTimes: notMatchers.toHaveBeenCalledTimes.bind(notMatchers),
      toBeInstanceOf: notMatchers.toBeInstanceOf.bind(notMatchers),
      toBeTypeOf: notMatchers.toBeTypeOf.bind(notMatchers),
      toBeCloseTo: notMatchers.toBeCloseTo.bind(notMatchers),
      toBeNaN: notMatchers.toBeNaN.bind(notMatchers),
      toBeFinite: notMatchers.toBeFinite.bind(notMatchers),
      toHaveProperty: notMatchers.toHaveProperty.bind(notMatchers),
      toHaveLength: notMatchers.toHaveLength.bind(notMatchers),
      toContainEqual: notMatchers.toContainEqual.bind(notMatchers),
      toStartWith: notMatchers.toStartWith.bind(notMatchers),
      toEndWith: notMatchers.toEndWith.bind(notMatchers),
      toResolve: notMatchers.toResolve.bind(notMatchers),
      toReject: notMatchers.toReject.bind(notMatchers),
      toResolveWith: notMatchers.toResolveWith.bind(notMatchers),
      toBeBetween: notMatchers.toBeBetween.bind(notMatchers),
      toRoughlyMatch: notMatchers.toRoughlyMatch.bind(notMatchers),
      toRoughlyEqual: notMatchers.toRoughlyEqual.bind(notMatchers)
    }
  };
}
