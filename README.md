# Clown.js

A simple, professional testing framework built from scratch in TypeScript.

## Installation

```bash
npm install
npm run build
```

## Usage

Create test files with `.test.ts` extension:

```typescript
import { describe, test, expect } from 'clown.js';

describe('My feature', () => {
  test('does something', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run tests:

```bash
clown                    # Run all tests
clown path/to/test.ts    # Run specific file
```

## API

### Test Definition
- `describe(name, fn)` - Group tests
- `describe.skip(name, fn)` - Skip a test suite
- `describe.only(name, fn)` - Run only this suite
- `test(name, fn)` / `it(name, fn)` - Define a test
- `test.skip(name, fn)` - Skip a test
- `test.only(name, fn)` - Run only this test
- `beforeEach(fn)` - Run before each test
- `afterEach(fn)` - Run after each test
- `beforeAll(fn)` - Run once before all tests
- `afterAll(fn)` - Run once after all tests

### Assertions
- `expect(value).toBe(expected)` - Strict equality
- `expect(value).toEqual(expected)` - Deep equality
- `expect(value).toBeTruthy()` - Truthy check
- `expect(value).toBeFalsy()` - Falsy check
- `expect(value).toBeNull()` - Null check
- `expect(value).toBeUndefined()` - Undefined check
- `expect(value).toContain(item)` - Array/string contains
- `expect(fn).toThrow()` - Function throws error
- `expect(value).toBeGreaterThan(number)` - Number comparison
- `expect(value).toBeLessThan(number)` - Number comparison
- `expect(value).toMatch(regex)` - Regex matching
- `expect(mockFn).toHaveBeenCalled()` - Mock was called
- `expect(mockFn).toHaveBeenCalledWith(...args)` - Mock called with args
- `expect(mockFn).toHaveBeenCalledTimes(n)` - Mock called n times
- `expect(value).not.toBe(expected)` - Negation

### Special Matchers
- `Also(...values)` - Match any of multiple values
  ```typescript
  expect(statusCode).toBe(Also(200, 201, 204));
  expect(result).toEqual(Also({a: 1}, {a: 2}));
  ```
- `Please(value)` - Force/override the actual value being tested (for mocks, shows warning)
  ```typescript
  expect(Please(42)).toBe(42); // Forces actual to be 42, prints warning
  const result = mockFn(); // returns random value
  expect(Please(100)).toBe(100); // Ignores result, forces 100
  ```

### Data Sharing Between Tests
- `send(key, value, options?)` - Send data to subsequent tests
  ```typescript
  send('userId', 123);
  send('user', userData, { exclude: ['password'] });
  send('config', { api: { url: 'test.com' } });
  ```
- `receive(key)` - Receive data from previous tests (supports dot notation)
  ```typescript
  const userId = receive('userId');
  const apiUrl = receive('config.api.url'); // Nested access
  ```
- `clearSent()` - Clear all sent data
  ```typescript
  afterAll(() => clearSent());
  ```

**Note:** Tests using send/receive run sequentially. Duplicate keys show a warning and are ignored.

## Example

See the `example/` directory for a complete sample project.

```bash
cd example
npm run test
```
