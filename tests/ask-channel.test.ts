import '../dist/index.js';

describe('Ask() Channel Communication', () => {
  test('producer creates channel', () => {
    const channel = Ask();
    channel.send({ message: 'Hello' });
    channel.close();
    
    expect(channel.isClosed()).toBe(true);
  });

  test('consumer receives from producer', () => {
    const channel = Ask.receive();
    const msg = channel.receive();
    
    expect(msg).toEqual({ message: 'Hello' });
  });

  test('multiple messages in sequence', () => {
    const channel = Ask();
    
    for (let i = 0; i < 3; i++) {
      channel.send({ count: i });
    }
    
    channel.close();
    expect(channel.getBufferSize()).toBe(3);
  });

  test('receives multiple messages', () => {
    const channel = Ask.receive();
    
    const msg1 = channel.receive();
    const msg2 = channel.receive();
    const msg3 = channel.receive();
    
    expect(msg1.count).toBe(0);
    expect(msg2.count).toBe(1);
    expect(msg3.count).toBe(2);
  });

  test('bidirectional - send data back', () => {
    const channel = Ask();
    channel.send({ request: 'ping' });
    
    expect(channel.getBufferSize()).toBeGreaterThan(0);
  });

  test('bidirectional - receive and respond', () => {
    const channel = Ask.receive();
    const request = channel.receive();
    
    expect(request.request).toBe('ping');
  });

  test('hasMore checks buffer', () => {
    const channel = Ask();
    channel.send({ data: 1 });
    channel.send({ data: 2 });
    
    expect(channel.hasMore()).toBe(true);
    channel.close();
  });

  test('peek without consuming', () => {
    const channel = Ask.receive();
    
    const peeked = channel.peek();
    const received = channel.receive();
    
    expect(peeked).toEqual(received);
  });
});

describe('Ask() with Transform', () => {
  test('send transformed data', () => {
    const channel = Ask();
    const data = { numbers: [1, 2, 3, 4, 5] };
    channel.send(data);
    channel.close();
    
    expect(channel.isClosed()).toBe(true);
  });

  test('receive and transform', () => {
    const channel = Ask.receive();
    const data = channel.receive();
    
    expect(Transform(data.numbers, arr => arr.length)).toBe(5);
    expect(Transform(data.numbers, arr => arr.reduce((a: number, b: number) => a + b))).toBe(15);
  });
});
