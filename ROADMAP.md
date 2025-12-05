# Clown.js Roadmap

## ✅ Implemented Features

### Core Testing
- `describe()`, `test()`, `it()`
- `beforeEach()`, `afterEach()`, `beforeAll()`, `afterAll()`
- `test.skip()`, `test.only()`, `describe.skip()`, `describe.only()`

### Standard Matchers
- `toBe()`, `toEqual()`, `toBeTruthy()`, `toBeFalsy()`
- `toBeNull()`, `toBeUndefined()`, `toContain()`
- `toThrow()`, `toBeGreaterThan()`, `toBeLessThan()`, `toMatch()`
- `toBeInstanceOf()`, `toBeTypeOf()`
- `toBeCloseTo()`, `toBeNaN()`, `toBeFinite()`
- `toHaveProperty()`, `toHaveLength()`, `toContainEqual()`
- `toStartWith()`, `toEndWith()`
- `toResolve()`, `toReject()`, `toResolveWith()`
- `toMatchSnapshot()`

### Mock Functions
- `mock()` - Create mock functions
- `mockReturnValue()`, `mockReturnValueOnce()`
- `mockImplementation()`, `mockImplementationOnce()`
- `toHaveBeenCalled()`, `toHaveBeenCalledWith()`, `toHaveBeenCalledTimes()`

### Unique Clown.js Features
- ✅ `Also(...values)` - Multiple acceptable values with nesting support
- ✅ `Please(value)` - Force value override (with warning)
- ✅ `send(key, value, options)` - Send data between tests
- ✅ `receive(key)` - Receive data from previous tests (dot notation support)
- ✅ `clearSent()` - Clear sent data
- ✅ `Eventually(fn, timeout)` - Retry until pass
- ✅ Snapshot testing with `toMatchSnapshot()`

### Developer Experience
- ANSI colored output (green/red/yellow)
- Skip/Only test filtering
- Better error messages with Expected vs Received
- Clean stack traces (filters framework internals)
- Sequential execution for send/receive tests

---

## 🚀 Planned Unique Features

### 1. Maybe() - Probabilistic Testing
**Status:** Not Implemented  
**Priority:** Medium

```typescript
expect(randomValue()).toBe(Maybe(1, 2, 3));
// Output: "✓ Matched value: 2 (out of 3 possibilities)"
```

Like `Also()` but logs which value matched for debugging random/non-deterministic code.

### 2. Between() - Range Checking
**Status:** Not Implemented  
**Priority:** High

```typescript
expect(age).toBeBetween(18, 65);
expect(price).toBeBetween(10.0, 100.0);
expect(score).toBeBetween(0, 100, { inclusive: false });
```

Clean syntax for range validation.

### 3. Transform() - Test After Transformation
**Status:** Not Implemented  
**Priority:** Medium

```typescript
expect(Transform(str, s => s.toUpperCase())).toBe('HELLO');
expect(Transform(arr, a => a.length)).toBeGreaterThan(5);
expect(Transform(user, u => u.age)).toBeBetween(18, 65);
```

Apply transformation before assertion without modifying original value.

### 4. Roughly() - Fuzzy Matching
**Status:** Not Implemented  
**Priority:** Low

```typescript
expect('hello world').toRoughlyMatch('helo wrld'); // Typo tolerance
expect(obj).toRoughlyEqual(expected, { tolerance: 0.1 }); // Ignore minor differences
```

Useful for testing with typos, OCR output, or approximate data.

### 5. Spy() - Quick Spy Without Mock
**Status:** Not Implemented  
**Priority:** Medium

```typescript
const fn = Spy(originalFn);
fn(1, 2); // Calls original function
expect(fn).toHaveBeenCalledWith(1, 2);
expect(fn.getReturnValue()).toBe(originalResult);
```

Spy on function calls while still executing the original function.

### 6. Freeze() - Deep Clone for send()
**Status:** Not Implemented  
**Priority:** Low

```typescript
const obj = { count: 0 };
send('snapshot', Freeze(obj)); // Deep clone
obj.count = 10;
const received = receive('snapshot');
expect(received.count).toBe(0); // Original frozen value
```

Prevents mutations from affecting sent data.

---

## 📋 Planned Standard Features

### Watch Mode
**Status:** Not Implemented  
**Priority:** High

```bash
clown --watch
```

Auto-rerun tests on file changes.

### Test Timeouts
**Status:** Not Implemented  
**Priority:** Medium

```typescript
test('slow operation', async () => {
  // ...
}, 5000); // 5 second timeout
```

### Config File
**Status:** Not Implemented  
**Priority:** Medium

`clown.config.ts`:
```typescript
export default {
  testMatch: ['**/*.test.ts'],
  timeout: 5000,
  setupFiles: ['./setup.ts']
};
```

### Parallel Execution
**Status:** Not Implemented  
**Priority:** Low

Run test files in parallel for speed (except when using send/receive).

### Coverage Reporting
**Status:** Not Implemented  
**Priority:** Low

Integrate with c8 or istanbul for code coverage.

### JSON Reporter
**Status:** Not Implemented  
**Priority:** Low

Output test results as JSON for CI/CD integration.

---

## 🎯 Philosophy

Clown.js provides powerful, sometimes dangerous tools with clear warnings. We give developers:
- **Unique matchers** that don't exist elsewhere (`Also`, `Please`, `send/receive`)
- **Standard matchers** for compatibility
- **Clear feedback** through warnings and error messages
- **Sequential execution** when needed (send/receive)
- **Professional output** without emojis

Great power comes with great responsibility. 🤡
