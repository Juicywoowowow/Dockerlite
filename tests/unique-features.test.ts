import '../dist/index.js';

describe('Also() - Multiple Values', () => {
  test('accepts any of multiple values', () => {
    expect(2).toBe(Also(1, 2, 3));
    expect('blue').toBe(Also('red', 'blue', 'green'));
  });

  test('works with objects', () => {
    const result = { status: 200 };
    expect(result).toEqual(Also({ status: 200 }, { status: 201 }));
  });

  test('supports nesting', () => {
    expect(5).toBe(Also(1, Also(4, 5, 6), 10));
  });
});

describe('Maybe() - Probabilistic Testing', () => {
  test('range matching', () => {
    const random = Math.floor(Math.random() * 100) + 1;
    expect(random).toBe(Maybe(1, 100));
  });

  test('explicit values', () => {
    const choices = ['a', 'b', 'c'];
    const pick = choices[Math.floor(Math.random() * choices.length)];
    expect(pick).toBe(Maybe('a', 'b', 'c'));
  });
});

describe('Please() - Force Override', () => {
  test('forces value with warning', () => {
    expect(Please(42)).toBe(42);
    expect(Please('forced')).toBe('forced');
  });

  test('works with objects', () => {
    expect(Please({ id: 1 })).toEqual({ id: 1 });
  });
});

describe('Transform() - Value Transformation', () => {
  test('transforms strings', () => {
    expect(Transform('hello', s => s.toUpperCase())).toBe('HELLO');
  });

  test('transforms arrays', () => {
    expect(Transform([1, 2, 3], arr => arr.length)).toBe(3);
  });

  test('transforms objects', () => {
    const user = { name: 'Alice', age: 30 };
    expect(Transform(user, u => u.age)).toBeGreaterThan(18);
  });

  test('chains with other matchers', () => {
    expect(Transform([1, 2, 3, 4, 5], arr => arr.reduce((a, b) => a + b))).toBe(15);
  });
});

describe('Insist() - Retry Logic', () => {
  test('retries until success', () => {
    let count = 0;
    const fn = () => {
      count++;
      if (count < 3) throw new Error('Not ready');
      return 'success';
    };
    
    expect(Insist(fn, 5)).toBe('success');
  });

  test('works with static values', () => {
    expect(Insist(42, 3)).toBe(42);
  });

  test('custom delay and attempts', () => {
    let attempts = 0;
    const fn = () => {
      attempts++;
      if (attempts < 2) throw new Error('Wait');
      return 'done';
    };
    
    expect(Insist(fn, { attempts: 3, delay: 10 })).toBe('done');
  });
});

describe('Roughly() - Fuzzy Matching', () => {
  test('toRoughlyMatch with typos', () => {
    expect('hello').toRoughlyMatch('helo', { distance: 1 });
    expect('testing').toRoughlyMatch('testng', { distance: 2 });
  });

  test('toRoughlyEqual with tolerance', () => {
    const obj1 = { value: 100 };
    const obj2 = { value: 105 };
    expect(obj1).toRoughlyEqual(obj2, { tolerance: 0.1 });
  });

  test('toRoughlyEqual ignoring keys', () => {
    const a = { id: 1, timestamp: 123 };
    const b = { id: 1, timestamp: 999 };
    expect(a).toRoughlyEqual(b, { ignoreKeys: ['timestamp'] });
  });
});

describe('Spy() - Function Spying', () => {
  test('tracks calls while executing', () => {
    const add = (a: number, b: number) => a + b;
    const spied = Spy(add);
    
    const result = spied(2, 3);
    
    expect(result).toBe(5);
    expect(spied).toHaveBeenCalled();
    expect(spied).toHaveBeenCalledWith(2, 3);
  });

  test('tracks multiple calls', () => {
    const fn = (x: number) => x * 2;
    const spied = Spy(fn);
    
    spied(5);
    spied(10);
    
    expect(spied).toHaveBeenCalledTimes(2);
    expect(spied.getLastReturnValue()).toBe(20);
  });

  test('can be reset', () => {
    const fn = () => 'test';
    const spied = Spy(fn);
    
    spied();
    expect(spied.getCallCount()).toBe(1);
    
    spied.reset();
    expect(spied.getCallCount()).toBe(0);
  });
});

describe('send() and receive() - Data Sharing', () => {
  test('sends and receives data', () => {
    send('testKey', { value: 42 });
    const data = receive('testKey');
    expect(data).toEqual({ value: 42 });
  });

  test('supports dot notation', () => {
    send('nested', { user: { name: 'Alice' } });
    const name = receive('nested.user.name');
    expect(name).toBe('Alice');
  });

  test('filters with exclude', () => {
    send('filtered', { a: 1, b: 2, c: 3 }, { exclude: ['b'] });
    const data = receive('filtered');
    expect(data).toEqual({ a: 1, c: 3 });
  });

  test('filters with include', () => {
    send('included', { a: 1, b: 2, c: 3 }, { include: ['a', 'c'] });
    const data = receive('included');
    expect(data).toEqual({ a: 1, c: 3 });
  });
});
