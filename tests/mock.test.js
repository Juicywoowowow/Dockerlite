"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("../dist/index.js");
describe('Mock Functions', () => {
    test('creates a mock function', () => {
        const mockFn = mock();
        mockFn();
        expect(mockFn).toHaveBeenCalled();
    });
    test('tracks call count', () => {
        const mockFn = mock();
        mockFn();
        mockFn();
        mockFn();
        expect(mockFn).toHaveBeenCalledTimes(3);
    });
    test('tracks call arguments', () => {
        const mockFn = mock();
        mockFn(1, 2, 3);
        expect(mockFn).toHaveBeenCalledWith(1, 2, 3);
    });
    test('mockReturnValue', () => {
        const mockFn = mock();
        mockFn.mockReturnValue(42);
        expect(mockFn()).toBe(42);
        expect(mockFn()).toBe(42);
    });
    test('mockReturnValueOnce', () => {
        const mockFn = mock();
        mockFn.mockReturnValueOnce(1);
        mockFn.mockReturnValueOnce(2);
        mockFn.mockReturnValue(3);
        expect(mockFn()).toBe(1);
        expect(mockFn()).toBe(2);
        expect(mockFn()).toBe(3);
        expect(mockFn()).toBe(3);
    });
    test('mockImplementation', () => {
        const mockFn = mock();
        mockFn.mockImplementation((a, b) => a + b);
        expect(mockFn(2, 3)).toBe(5);
        expect(mockFn(10, 20)).toBe(30);
    });
    test('mockImplementationOnce', () => {
        const mockFn = mock();
        mockFn.mockImplementationOnce((x) => x * 2);
        mockFn.mockImplementation((x) => x * 3);
        expect(mockFn(5)).toBe(10);
        expect(mockFn(5)).toBe(15);
    });
    test('reset clears mock state', () => {
        const mockFn = mock();
        mockFn(1, 2);
        mockFn(3, 4);
        expect(mockFn.getCallCount()).toBe(2);
        mockFn.reset();
        expect(mockFn.getCallCount()).toBe(0);
    });
    test('works with objects', () => {
        const mockFn = mock();
        mockFn.mockReturnValue({ id: 1, name: 'test' });
        const result = mockFn();
        expect(result).toEqual({ id: 1, name: 'test' });
    });
});
describe('Mock with Spy Comparison', () => {
    test('mock replaces function', () => {
        const mockFn = mock();
        mockFn.mockReturnValue('mocked');
        expect(mockFn()).toBe('mocked');
    });
    test('spy wraps function', () => {
        const original = (x) => x * 2;
        const spied = Spy(original);
        expect(spied(5)).toBe(10); // Calls original
        expect(spied).toHaveBeenCalledWith(5);
    });
});
