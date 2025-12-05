"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../dist/index.js");
const api_js_1 = require("./api.js");
describe('New Matcher Features', () => {
    describe('Also() - Multiple acceptable values', () => {
        test('accepts any of multiple status codes', () => {
            const status = (0, api_js_1.getStatusCode)();
            expect(status).toBe(Also(200, 201, 204));
        });
        test('works with objects', () => {
            const response = (0, api_js_1.getResponse)();
            expect(response).toEqual(Also({ status: 200, data: { message: 'Success' } }, { status: 201, data: { message: 'Created' } }));
        });
        test('supports nesting', () => {
            const age = (0, api_js_1.getUserAge)('user1');
            expect(age).toBe(Also(25, Also(30, 18)));
        });
        test('fails when value not in Also list', () => {
            expect(() => {
                expect(999).toBe(Also(200, 201, 204));
            }).toThrow();
        });
    });
    describe('toBeGreaterThan() / toBeLessThan()', () => {
        test('checks if number is greater', () => {
            const age = (0, api_js_1.getUserAge)('user2');
            expect(age).toBeGreaterThan(20);
            expect(age).toBeGreaterThan(29);
        });
        test('checks if number is less', () => {
            const age = (0, api_js_1.getUserAge)('user3');
            expect(age).toBeLessThan(21);
            expect(age).toBeLessThan(100);
        });
        test('works with negation', () => {
            expect(50).not.toBeGreaterThan(100);
            expect(50).not.toBeLessThan(10);
        });
    });
    describe('toMatch() - Regex matching', () => {
        test('matches email pattern', () => {
            expect('test@example.com').toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        });
        test('matches string pattern', () => {
            expect('hello123').toMatch(/hello\d+/);
            expect('test-file.ts').toMatch(/\.ts$/);
        });
        test('works with string regex', () => {
            expect('hello world').toMatch('hello');
        });
        test('works with negation', () => {
            expect('hello').not.toMatch(/\d+/);
        });
    });
    describe('Please() - Forced values with warning', () => {
        test('forces the actual value being tested', async () => {
            const result = await (0, api_js_1.mockApiCall)(); // Returns random number
            // Please forces the actual value to 42, ignoring result
            expect(Please(42)).toBe(42);
        });
        test('works with toEqual', () => {
            const obj = { random: Math.random() };
            // Forces the actual value to be { forced: true }
            expect(Please({ forced: true })).toEqual({ forced: true });
        });
        test('can force any value regardless of actual', () => {
            const actualValue = 'this will be ignored';
            // Please overrides the actual value
            expect(Please(999)).toBe(999);
            expect(Please('forced')).toBe('forced');
        });
    });
    describe('Combined usage', () => {
        test('Also with toBeGreaterThan', () => {
            const age = (0, api_js_1.getUserAge)('user1');
            expect(age).toBe(Also(25, 30, 18));
            expect(age).toBeGreaterThan(20);
        });
        test('validates email and matches pattern', () => {
            const email = 'user@test.com';
            expect((0, api_js_1.validateEmail)(email)).toBeTruthy();
            expect(email).toMatch(/@test\.com$/);
        });
    });
});
describe('Skip and Only Features', () => {
    test('this test runs normally', () => {
        expect(1 + 1).toBe(2);
    });
    test.skip('this test is skipped', () => {
        expect(true).toBe(false); // Would fail but won't run
    });
    describe.skip('Skipped suite', () => {
        test('this entire suite is skipped', () => {
            expect(true).toBe(false);
        });
        test('all tests in skipped suite are skipped', () => {
            expect(1).toBe(2);
        });
    });
    // Uncomment to test .only functionality
    // test.only('only this test runs', () => {
    //   expect(true).toBeTruthy();
    // });
});
describe('Mock Functions', () => {
    test('creates a mock function', () => {
        const mockFn = mock();
        expect(mockFn).toBeTruthy();
    });
    test('tracks function calls', () => {
        const mockFn = mock();
        mockFn();
        mockFn();
        expect(mockFn).toHaveBeenCalled();
        expect(mockFn).toHaveBeenCalledTimes(2);
    });
    test('tracks call arguments', () => {
        const mockFn = mock();
        mockFn('hello', 123);
        mockFn('world', 456);
        expect(mockFn).toHaveBeenCalledWith('hello', 123);
        expect(mockFn).toHaveBeenCalledWith('world', 456);
    });
    test('returns mocked values', () => {
        const mockFn = mock();
        mockFn.mockReturnValue(42);
        expect(mockFn()).toBe(42);
        expect(mockFn()).toBe(42);
    });
    test('returns different values with mockReturnValueOnce', () => {
        const mockFn = mock();
        mockFn.mockReturnValueOnce(1);
        mockFn.mockReturnValueOnce(2);
        mockFn.mockReturnValue(3);
        expect(mockFn()).toBe(1);
        expect(mockFn()).toBe(2);
        expect(mockFn()).toBe(3);
        expect(mockFn()).toBe(3);
    });
    test('uses custom implementation', () => {
        const mockFn = mock();
        mockFn.mockImplementation((a, b) => a + b);
        expect(mockFn(2, 3)).toBe(5);
        expect(mockFn(10, 20)).toBe(30);
    });
    test('uses implementation once', () => {
        const mockFn = mock();
        mockFn.mockImplementationOnce((x) => x * 2);
        mockFn.mockImplementation((x) => x * 3);
        expect(mockFn(5)).toBe(10);
        expect(mockFn(5)).toBe(15);
    });
    test('resets mock state', () => {
        const mockFn = mock();
        mockFn.mockReturnValue(42);
        mockFn();
        mockFn();
        expect(mockFn).toHaveBeenCalledTimes(2);
        mockFn.reset();
        expect(mockFn.getCallCount()).toBe(0);
    });
    test('works with complex objects', () => {
        const mockFn = mock();
        const user = { id: 1, name: 'Alice' };
        mockFn(user);
        expect(mockFn).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
    });
});
describe('Better Error Output', () => {
    test('shows clear error for failed assertions', () => {
        expect(5).toBe(5);
    });
    test('handles object comparison', () => {
        const obj = { name: 'test', value: 42 };
        expect(obj).toEqual({ name: 'test', value: 42 });
    });
    // Uncomment to see improved error output
    // test('example of failed test with better errors', () => {
    //   expect(10).toBe(20);
    // });
});
describe('Send and Receive - Data Sharing', () => {
    afterAll(() => {
        clearSent(); // Clean up after tests
    });
    test('sends basic data', () => {
        const userId = 12345;
        send('userId', userId);
        expect(userId).toBe(12345);
    });
    test('receives basic data', () => {
        const userId = receive('userId');
        expect(userId).toBe(12345);
    });
    test('sends filtered data', () => {
        const user = {
            id: 1,
            name: 'Alice',
            email: 'alice@test.com',
            password: 'secret123',
            token: 'abc123'
        };
        // Exclude sensitive fields
        send('user', user, { exclude: ['password', 'token'] });
        expect(user.password).toBe('secret123'); // Original unchanged
    });
    test('receives filtered data', () => {
        const user = receive('user');
        expect(user.id).toBe(1);
        expect(user.name).toBe('Alice');
        expect(user.email).toBe('alice@test.com');
        expect(user.password).toBeUndefined(); // Filtered out
        expect(user.token).toBeUndefined(); // Filtered out
    });
    test('sends with include filter', () => {
        const config = {
            apiUrl: 'https://api.test.com',
            apiKey: 'secret',
            timeout: 5000,
            retries: 3
        };
        send('config', config, { include: ['apiUrl', 'timeout'] });
    });
    test('receives include filtered data', () => {
        const config = receive('config');
        expect(config.apiUrl).toBe('https://api.test.com');
        expect(config.timeout).toBe(5000);
        expect(config.apiKey).toBeUndefined();
        expect(config.retries).toBeUndefined();
    });
    test('sends nested data', () => {
        const auth = {
            user: { id: 1, name: 'Bob' },
            token: 'xyz789',
            expires: Date.now() + 3600000
        };
        send('auth', auth);
    });
    test('receives nested data with dot notation', () => {
        const userName = receive('auth.user.name');
        expect(userName).toBe('Bob');
        const userId = receive('auth.user.id');
        expect(userId).toBe(1);
        const token = receive('auth.token');
        expect(token).toBe('xyz789');
    });
    test('warns on duplicate key', () => {
        send('duplicate', 'first');
        send('duplicate', 'second'); // Should warn and ignore
        const value = receive('duplicate');
        expect(value).toBe('first'); // First value wins
    });
    test('fails when receiving non-existent key', () => {
        expect(() => {
            receive('nonExistentKey');
        }).toThrow('receive() failed: Key "nonExistentKey" was not sent');
    });
    test('fails when accessing non-existent nested key', () => {
        send('shallow', { a: 1 });
        expect(() => {
            receive('shallow.b.c');
        }).toThrow('receive() failed: Property "b" does not exist');
    });
});
describe('Send and Receive - Error Cases', () => {
    afterAll(() => {
        clearSent();
    });
    test('setup some data', () => {
        send('validKey', 'some data');
        send('numbers', { one: 1, two: 2 });
    });
    // Uncomment to see actual failures in action
    test('FAIL: receive wrong key', () => {
        const data = receive('wrongKey'); // This will fail the test
        expect(data).toBeTruthy();
    });
    test('FAIL: receive nested key that does not exist', () => {
        const value = receive('numbers.three'); // This will fail
        expect(value).toBe(3);
    });
    test('FAIL: access property on null', () => {
        send('nullValue', null);
        const value = receive('nullValue.property'); // This will fail
        expect(value).toBeTruthy();
    });
    test('demonstrates error is caught', () => {
        // This shows the error is thrown but caught by expect
        expect(() => {
            receive('definitelyDoesNotExist');
        }).toThrow('receive() failed: Key "definitelyDoesNotExist" was not sent');
    });
    test('demonstrates nested error is caught', () => {
        send('simple', { x: 10 });
        expect(() => {
            receive('simple.y.z');
        }).toThrow('receive() failed: Property "y" does not exist');
    });
    test('demonstrates accessing property on primitive', () => {
        send('primitive', 42);
        expect(() => {
            receive('primitive.value');
        }).toThrow('receive() failed: Cannot access property "value" on non-object');
    });
});
describe('Standard Matchers - Type Checking', () => {
    test('toBeInstanceOf checks class instances', () => {
        expect(new Date()).toBeInstanceOf(Date);
        expect([1, 2, 3]).toBeInstanceOf(Array);
        expect(new Error('test')).toBeInstanceOf(Error);
    });
    test('toBeTypeOf checks primitive types', () => {
        expect('hello').toBeTypeOf('string');
        expect(42).toBeTypeOf('number');
        expect(true).toBeTypeOf('boolean');
        expect({}).toBeTypeOf('object');
        expect(() => { }).toBeTypeOf('function');
        expect(undefined).toBeTypeOf('undefined');
    });
    test('toBeCloseTo for floating point comparison', () => {
        expect(0.1 + 0.2).toBeCloseTo(0.3, 1);
        expect(Math.PI).toBeCloseTo(3.14, 2);
        expect(1.23456).toBeCloseTo(1.23, 2);
    });
    test('toBeNaN checks for NaN', () => {
        expect(NaN).toBeNaN();
        expect(0 / 0).toBeNaN();
        expect(parseInt('not a number')).toBeNaN();
        expect(42).not.toBeNaN();
    });
    test('toBeFinite checks for finite numbers', () => {
        expect(42).toBeFinite();
        expect(0).toBeFinite();
        expect(-100).toBeFinite();
        expect(Infinity).not.toBeFinite();
        expect(-Infinity).not.toBeFinite();
        expect(NaN).not.toBeFinite();
    });
});
describe('Standard Matchers - Objects and Arrays', () => {
    test('toHaveProperty checks object properties', () => {
        const user = { name: 'Alice', age: 30, email: 'alice@test.com' };
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('age', 30);
        expect(user).toHaveProperty('email', 'alice@test.com');
        expect(user).not.toHaveProperty('password');
    });
    test('toHaveLength checks array/string length', () => {
        expect([1, 2, 3]).toHaveLength(3);
        expect('hello').toHaveLength(5);
        expect([]).toHaveLength(0);
        expect('').toHaveLength(0);
    });
    test('toContainEqual checks array contains object', () => {
        const users = [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' }
        ];
        expect(users).toContainEqual({ id: 1, name: 'Alice' });
        expect(users).toContainEqual({ id: 2, name: 'Bob' });
        expect(users).not.toContainEqual({ id: 3, name: 'Charlie' });
    });
});
describe('Standard Matchers - Strings', () => {
    test('toStartWith checks string prefix', () => {
        expect('hello world').toStartWith('hello');
        expect('test.ts').toStartWith('test');
        expect('hello').not.toStartWith('world');
    });
    test('toEndWith checks string suffix', () => {
        expect('hello world').toEndWith('world');
        expect('test.ts').toEndWith('.ts');
        expect('hello').not.toEndWith('test');
    });
});
describe('Standard Matchers - Promises', () => {
    test('toResolve checks promise resolves', async () => {
        await expect(Promise.resolve(42)).toResolve();
        await expect(Promise.reject('error')).not.toResolve();
    });
    test('toReject checks promise rejects', async () => {
        await expect(Promise.reject('error')).toReject();
        await expect(Promise.resolve(42)).not.toReject();
    });
    test('toResolveWith checks promise resolves with value', async () => {
        await expect(Promise.resolve(42)).toResolveWith(42);
        await expect(Promise.resolve({ id: 1 })).toResolveWith({ id: 1 });
    });
});
describe('Unique Matchers - Snapshots', () => {
    test('toMatchSnapshot creates and compares snapshots', () => {
        const user = { id: 1, name: 'Alice', email: 'alice@test.com' };
        expect(user).toMatchSnapshot();
    });
    test('toMatchSnapshot works with arrays', () => {
        const numbers = [1, 2, 3, 4, 5];
        expect(numbers).toMatchSnapshot();
    });
    test('toMatchSnapshot handles nested objects', () => {
        const data = {
            user: { id: 1, name: 'Bob' },
            posts: [
                { id: 1, title: 'First Post' },
                { id: 2, title: 'Second Post' }
            ]
        };
        expect(data).toMatchSnapshot();
    });
});
describe('Unique Matchers - Maybe()', () => {
    test('Maybe() with range for random numbers', () => {
        const randomNum = Math.floor(Math.random() * 100) + 1; // 1-100
        expect(randomNum).toBe(Maybe(1, 100));
    });
    test('Maybe() with explicit values for non-deterministic code', () => {
        const choices = ['red', 'blue', 'green'];
        const randomChoice = choices[Math.floor(Math.random() * choices.length)];
        expect(randomChoice).toBe(Maybe('red', 'blue', 'green'));
    });
    test('Maybe() with dice roll', () => {
        const diceRoll = Math.floor(Math.random() * 6) + 1;
        expect(diceRoll).toBe(Maybe(1, 6));
    });
    test('Maybe() with multiple number possibilities', () => {
        const values = [10, 20, 30];
        const picked = values[Math.floor(Math.random() * values.length)];
        expect(picked).toBe(Maybe(10, 20, 30));
    });
    test('Maybe() with objects', () => {
        const statuses = [
            { code: 200, message: 'OK' },
            { code: 201, message: 'Created' },
            { code: 204, message: 'No Content' }
        ];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        expect(status).toEqual(Maybe({ code: 200, message: 'OK' }, { code: 201, message: 'Created' }, { code: 204, message: 'No Content' }));
    });
});
describe('Standard Matchers - toBeBetween()', () => {
    test('toBeBetween checks inclusive range by default', () => {
        expect(50).toBeBetween(1, 100);
        expect(1).toBeBetween(1, 100);
        expect(100).toBeBetween(1, 100);
    });
    test('toBeBetween checks exclusive range', () => {
        expect(50).toBeBetween(1, 100, { inclusive: false });
        expect(1).not.toBeBetween(1, 100, { inclusive: false });
        expect(100).not.toBeBetween(1, 100, { inclusive: false });
    });
    test('toBeBetween with age validation', () => {
        const age = 25;
        expect(age).toBeBetween(18, 65);
    });
    test('toBeBetween with price range', () => {
        const price = 49.99;
        expect(price).toBeBetween(10.0, 100.0);
    });
    test('toBeBetween with score validation', () => {
        const score = 85;
        expect(score).toBeBetween(0, 100);
        expect(score).not.toBeBetween(90, 100);
    });
    test('toBeBetween with negative numbers', () => {
        expect(-5).toBeBetween(-10, 0);
        expect(-10).toBeBetween(-10, 0);
        expect(0).toBeBetween(-10, 0);
    });
    test('toBeBetween with floats', () => {
        expect(3.14).toBeBetween(3.0, 4.0);
        expect(0.5).toBeBetween(0.0, 1.0);
    });
});
