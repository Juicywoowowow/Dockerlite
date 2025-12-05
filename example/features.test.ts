import '../dist/index.js';

describe('Transform() Feature', () => {
  test('transforms string to uppercase', () => {
    const str = 'hello world';
    expect(Transform(str, s => s.toUpperCase())).toBe('HELLO WORLD');
  });

  test('transforms array to length', () => {
    const arr = [1, 2, 3, 4, 5];
    expect(Transform(arr, a => a.length)).toBe(5);
  });

  test('transforms object property', () => {
    const user = { name: 'Alice', age: 30 };
    expect(Transform(user, u => u.age)).toBeGreaterThan(18);
  });

  test('transforms with complex logic', () => {
    const numbers = [1, 2, 3, 4, 5];
    expect(Transform(numbers, arr => arr.reduce((sum, n) => sum + n, 0))).toBe(15);
  });

  test('transforms nested object', () => {
    const data = { user: { profile: { email: 'test@example.com' } } };
    expect(Transform(data, d => d.user.profile.email)).toMatch(/@example\.com$/);
  });

  test('transforms with toBeBetween', () => {
    const user = { name: 'Bob', age: 25 };
    expect(Transform(user, u => u.age)).toBeBetween(18, 65);
  });
});

describe('Insist() Feature', () => {
  let counter = 0;

  test('insists on value after retries', () => {
    counter = 0;
    const getValue = () => {
      counter++;
      if (counter < 3) throw new Error('Not ready');
      return 'success';
    };

    expect(Insist(getValue, 5)).toBe('success');
  });

  test('insists with custom delay', () => {
    let attempts = 0;
    const getValue = () => {
      attempts++;
      if (attempts < 2) throw new Error('Not ready');
      return 42;
    };

    expect(Insist(getValue, { attempts: 3, delay: 50 })).toBe(42);
  });

  test('insists on object equality', () => {
    let callCount = 0;
    const getUser = () => {
      callCount++;
      if (callCount < 2) throw new Error('Loading...');
      return { id: 1, name: 'Alice' };
    };

    expect(Insist(getUser, 3)).toEqual({ id: 1, name: 'Alice' });
  });

  test('insists with static value (immediate success)', () => {
    expect(Insist(100, 3)).toBe(100);
  });

  test('insists on array contains', () => {
    let tries = 0;
    const getData = () => {
      tries++;
      if (tries < 2) throw new Error('Empty');
      return [1, 2, 3, 4, 5];
    };

    expect(Insist(getData, 3)).toContain(3);
  });
});

describe('Test Timeout Feature', () => {
  test('completes within timeout', async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    expect(true).toBe(true);
  }, 1000);

  test('fast test with timeout', () => {
    expect(1 + 1).toBe(2);
  }, 500);

  test('async operation with timeout', async () => {
    const result = await Promise.resolve(42);
    expect(result).toBe(42);
  }, 1000);
});

describe('Combined Features', () => {
  test('Transform + Insist', () => {
    let count = 0;
    const getArray = () => {
      count++;
      if (count < 2) throw new Error('Not ready');
      return [1, 2, 3, 4, 5];
    };

    // Insist gets the array, then Transform gets its length
    expect(Transform(Insist(getArray, 3), (arr: any) => arr.length)).toBe(5);
  });

  test('Transform + Maybe', () => {
    const users = [
      { name: 'Alice', status: 'active' },
      { name: 'Bob', status: 'inactive' },
      { name: 'Charlie', status: 'pending' }
    ];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    expect(Transform(randomUser, u => u.status)).toBe(Maybe('active', 'inactive', 'pending'));
  });

  test('Transform + toBeBetween', () => {
    const scores = [85, 92, 78, 95, 88];
    expect(Transform(scores, s => s.reduce((a, b) => a + b) / s.length)).toBeBetween(80, 95);
  });

  test('Insist + toBeGreaterThan', () => {
    let value = 0;
    const increment = () => {
      value += 10;
      if (value < 30) throw new Error('Too small');
      return value;
    };

    expect(Insist(increment, 5)).toBeGreaterThan(25);
  });
});

describe('Insist Error Cases', () => {
  test('FAIL: insist exhausts all attempts', () => {
    const alwaysFails = () => {
      throw new Error('Always fails');
    };

    expect(Insist(alwaysFails, 2)).toBe('success');
  });
});
