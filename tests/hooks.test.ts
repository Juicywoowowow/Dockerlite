import '../dist/index.js';

describe('Test Hooks', () => {
  let setupCount = 0;
  let teardownCount = 0;
  let beforeAllCount = 0;
  let afterAllCount = 0;

  beforeAll(() => {
    beforeAllCount++;
  });

  afterAll(() => {
    afterAllCount++;
  });

  beforeEach(() => {
    setupCount++;
  });

  afterEach(() => {
    teardownCount++;
  });

  test('first test', () => {
    expect(setupCount).toBe(1);
    expect(beforeAllCount).toBe(1);
  });

  test('second test', () => {
    expect(setupCount).toBe(2);
    expect(teardownCount).toBe(1);
  });

  test('third test', () => {
    expect(setupCount).toBe(3);
    expect(teardownCount).toBe(2);
  });
});

describe('Nested Hooks', () => {
  let outerSetup = 0;
  let innerSetup = 0;

  beforeEach(() => {
    outerSetup++;
  });

  test('outer test', () => {
    expect(outerSetup).toBeGreaterThan(0);
  });

  describe('Inner Suite', () => {
    beforeEach(() => {
      innerSetup++;
    });

    test('inner test', () => {
      expect(outerSetup).toBeGreaterThan(0);
      expect(innerSetup).toBeGreaterThan(0);
    });
  });
});

describe('Skip and Only', () => {
  test('normal test runs', () => {
    expect(true).toBe(true);
  });

  test.skip('skipped test', () => {
    expect(false).toBe(true); // Would fail if run
  });
});
