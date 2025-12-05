import '../dist/index.js';

describe('Roughly() - Fuzzy Matching', () => {
  test('toRoughlyMatch with typos', () => {
    expect('hello world').toRoughlyMatch('helo wrld', { distance: 3 });
    expect('testing').toRoughlyMatch('testng', { distance: 2 });
  });

  test('toRoughlyMatch with custom distance', () => {
    expect('hello').toRoughlyMatch(Roughly('helo', { distance: 1 }));
    expect('hello').not.toRoughlyMatch(Roughly('xyz', { distance: 1 }));
  });

  test('toRoughlyMatch with minor differences', () => {
    expect('The quick brown fox').toRoughlyMatch('The quik brown fox');
    expect('JavaScript').toRoughlyMatch('Javascript');
  });

  test('toRoughlyEqual with number tolerance', () => {
    const obj1 = { value: 100, score: 85.5 };
    const obj2 = { value: 105, score: 88.2 };
    
    expect(obj1).toRoughlyEqual(obj2, { tolerance: 0.1 }); // 10% tolerance
  });

  test('toRoughlyEqual ignoring keys', () => {
    const obj1 = { id: 1, name: 'Alice', timestamp: 1234567890 };
    const obj2 = { id: 1, name: 'Alice', timestamp: 9999999999 };
    
    expect(obj1).toRoughlyEqual(obj2, { ignoreKeys: ['timestamp'] });
  });

  test('toRoughlyEqual with nested objects', () => {
    const data1 = { user: { age: 30, score: 100 } };
    const data2 = { user: { age: 31, score: 105 } };
    
    expect(data1).toRoughlyEqual(data2, { tolerance: 0.1 });
  });
});

describe('Spy() - Function Spying', () => {
  test('spy tracks function calls', () => {
    const add = (a: number, b: number) => a + b;
    const spiedAdd = Spy(add);
    
    const result = spiedAdd(2, 3);
    
    expect(result).toBe(5);
    expect(spiedAdd).toHaveBeenCalled();
    expect(spiedAdd).toHaveBeenCalledWith(2, 3);
  });

  test('spy tracks multiple calls', () => {
    const multiply = (a: number, b: number) => a * b;
    const spiedMultiply = Spy(multiply);
    
    spiedMultiply(2, 3);
    spiedMultiply(4, 5);
    spiedMultiply(6, 7);
    
    expect(spiedMultiply).toHaveBeenCalledTimes(3);
    expect(spiedMultiply.getCallCount()).toBe(3);
  });

  test('spy tracks return values', () => {
    const square = (n: number) => n * n;
    const spiedSquare = Spy(square);
    
    spiedSquare(5);
    spiedSquare(10);
    
    expect(spiedSquare.getLastReturnValue()).toBe(100);
  });

  test('spy works with objects', () => {
    const getUser = (id: number) => ({ id, name: `User${id}` });
    const spiedGetUser = Spy(getUser);
    
    const user = spiedGetUser(42);
    
    expect(user).toEqual({ id: 42, name: 'User42' });
    expect(spiedGetUser).toHaveBeenCalledWith(42);
  });

  test('spy can be reset', () => {
    const fn = (x: number) => x * 2;
    const spiedFn = Spy(fn);
    
    spiedFn(5);
    spiedFn(10);
    expect(spiedFn.getCallCount()).toBe(2);
    
    spiedFn.reset();
    expect(spiedFn.getCallCount()).toBe(0);
  });

  test('spy tracks errors', () => {
    const throwError = () => {
      throw new Error('Test error');
    };
    const spiedThrow = Spy(throwError);
    
    expect(() => spiedThrow()).toThrow('Test error');
    expect(spiedThrow.getCallCount()).toBe(1);
  });
});

describe('Ask() - Test Communication Channel', () => {
  test('producer sends data', () => {
    const channel = Ask();
    
    channel.send({ message: 'Hello from producer' });
    channel.send({ count: 42 });
    channel.close();
    
    expect(channel.isClosed()).toBe(true);
  });

  test('consumer receives data', () => {
    const channel = Ask.receive();
    
    const msg1 = channel.receive();
    const msg2 = channel.receive();
    
    expect(msg1).toEqual({ message: 'Hello from producer' });
    expect(msg2).toEqual({ count: 42 });
  });

  test('bidirectional channel - send first', () => {
    const channel = Ask();
    
    channel.send({ step: 1, data: 'first' });
    channel.send({ step: 2, data: 'second' });
    channel.close();
    
    expect(channel.getBufferSize()).toBeGreaterThan(0);
  });

  test('bidirectional channel - receive', () => {
    const channel = Ask.receive();
    
    expect(channel.hasMore()).toBe(true);
    
    const data1 = channel.next();
    const data2 = channel.next();
    
    expect(data1.step).toBe(1);
    expect(data2.step).toBe(2);
  });

  test('channel with multiple messages', () => {
    const channel = Ask();
    
    for (let i = 0; i < 5; i++) {
      channel.send({ iteration: i, value: i * 10 });
    }
    
    channel.close();
    expect(channel.getBufferSize()).toBe(5);
  });

  test('channel receives multiple messages', () => {
    const channel = Ask.receive();
    
    let sum = 0;
    let count = 0;
    
    while (channel.hasMore() && count < 5) {
      const msg = channel.receive();
      sum += msg.value;
      count++;
    }
    
    expect(count).toBe(5);
    expect(sum).toBe(0 + 10 + 20 + 30 + 40);
  });
});

describe('Combined Advanced Features', () => {
  test('Roughly + Transform', () => {
    const data = { text: 'Hello World' };
    expect(Transform(data, d => d.text.toLowerCase())).toRoughlyMatch('hello wrld');
  });

  test('Spy + Insist', () => {
    let attempts = 0;
    const flaky = () => {
      attempts++;
      if (attempts < 2) throw new Error('Not ready');
      return 'success';
    };
    
    const spiedFlaky = Spy(flaky);
    const result = Insist(spiedFlaky, 3);
    
    expect(result).toBe('success');
    expect(spiedFlaky.getCallCount()).toBeGreaterThan(1);
  });

  test('Ask + Transform', () => {
    const channel = Ask();
    channel.send({ numbers: [1, 2, 3, 4, 5] });
    channel.close();
    
    expect(channel.isClosed()).toBe(true);
  });

  test('Ask + Transform receive', () => {
    const channel = Ask.receive();
    const data = channel.receive();
    
    expect(Transform(data.numbers, arr => arr.length)).toBe(5);
  });
});
