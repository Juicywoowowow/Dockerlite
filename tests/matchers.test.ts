import '../dist/index.js';

describe('Core Matchers', () => {
  test('toBe works with primitives', () => {
    expect(42).toBe(42);
    expect('hello').toBe('hello');
    expect(true).toBe(true);
    expect(null).toBe(null);
  });

  test('toEqual works with objects', () => {
    expect({ a: 1, b: 2 }).toEqual({ a: 1, b: 2 });
    expect([1, 2, 3]).toEqual([1, 2, 3]);
  });

  test('toBeTruthy and toBeFalsy', () => {
    expect(1).toBeTruthy();
    expect('text').toBeTruthy();
    expect(0).toBeFalsy();
    expect('').toBeFalsy();
  });

  test('toBeNull and toBeUndefined', () => {
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect(0).not.toBeNull();
  });

  test('toContain for arrays and strings', () => {
    expect([1, 2, 3]).toContain(2);
    expect('hello world').toContain('world');
  });

  test('toThrow catches errors', () => {
    expect(() => { throw new Error('test'); }).toThrow();
    expect(() => { throw new Error('specific'); }).toThrow('specific');
  });

  test('toBeGreaterThan and toBeLessThan', () => {
    expect(10).toBeGreaterThan(5);
    expect(5).toBeLessThan(10);
  });

  test('toMatch with regex', () => {
    expect('test@example.com').toMatch(/@example\.com$/);
    expect('hello123').toMatch(/\d+/);
  });

  test('toBeBetween checks ranges', () => {
    expect(50).toBeBetween(1, 100);
    expect(1).toBeBetween(1, 100);
    expect(100).toBeBetween(1, 100);
  });
});

describe('Type Checking Matchers', () => {
  test('toBeInstanceOf', () => {
    expect(new Date()).toBeInstanceOf(Date);
    expect([]).toBeInstanceOf(Array);
    expect(new Error()).toBeInstanceOf(Error);
  });

  test('toBeTypeOf', () => {
    expect(42).toBeTypeOf('number');
    expect('text').toBeTypeOf('string');
    expect(true).toBeTypeOf('boolean');
  });

  test('toBeCloseTo for floats', () => {
    expect(0.1 + 0.2).toBeCloseTo(0.3, 1);
    expect(Math.PI).toBeCloseTo(3.14, 2);
  });

  test('toBeNaN', () => {
    expect(NaN).toBeNaN();
    expect(0 / 0).toBeNaN();
    expect(42).not.toBeNaN();
  });

  test('toBeFinite', () => {
    expect(42).toBeFinite();
    expect(Infinity).not.toBeFinite();
    expect(NaN).not.toBeFinite();
  });
});

describe('Object and Array Matchers', () => {
  test('toHaveProperty', () => {
    const obj = { name: 'test', value: 42 };
    expect(obj).toHaveProperty('name');
    expect(obj).toHaveProperty('value', 42);
  });

  test('toHaveLength', () => {
    expect([1, 2, 3]).toHaveLength(3);
    expect('hello').toHaveLength(5);
    expect([]).toHaveLength(0);
  });

  test('toContainEqual', () => {
    const arr = [{ id: 1 }, { id: 2 }];
    expect(arr).toContainEqual({ id: 1 });
    expect(arr).not.toContainEqual({ id: 3 });
  });

  test('toStartWith and toEndWith', () => {
    expect('hello world').toStartWith('hello');
    expect('hello world').toEndWith('world');
  });
});

describe('Promise Matchers', () => {
  test('toResolve', async () => {
    await expect(Promise.resolve(42)).toResolve();
    await expect(Promise.reject('error')).not.toResolve();
  });

  test('toReject', async () => {
    await expect(Promise.reject('error')).toReject();
    await expect(Promise.resolve(42)).not.toReject();
  });

  test('toResolveWith', async () => {
    await expect(Promise.resolve(42)).toResolveWith(42);
    await expect(Promise.resolve({ id: 1 })).toResolveWith({ id: 1 });
  });
});

describe('Negation with .not', () => {
  test('not.toBe', () => {
    expect(1).not.toBe(2);
    expect('hello').not.toBe('world');
  });

  test('not.toEqual', () => {
    expect({ a: 1 }).not.toEqual({ a: 2 });
  });

  test('not.toContain', () => {
    expect([1, 2, 3]).not.toContain(4);
  });
});
