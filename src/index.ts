import { testContext } from './core/test-context';
import { expect } from './core/expect';
import { Also } from './core/also';
import { Maybe } from './core/maybe';
import { Please } from './core/please';
import { Transform } from './core/transform';
import { Insist } from './core/insist';
import { Roughly } from './core/roughly';
import { Spy } from './core/spy';
import { Ask } from './core/ask';
import { mock } from './core/mock';
import { send, receive, clearSent } from './core/send-receive';

export function describe(name: string, fn: () => void) {
  testContext.describe(name, fn);
}

describe.skip = function(name: string, fn: () => void) {
  testContext.describe(name, fn, { skip: true });
};

describe.only = function(name: string, fn: () => void) {
  testContext.describe(name, fn, { only: true });
};

export function test(name: string, fn: () => void | Promise<void>, timeout?: number) {
  testContext.test(name, fn, { timeout });
}

test.skip = function(name: string, fn: () => void | Promise<void>, timeout?: number) {
  testContext.test(name, fn, { skip: true, timeout });
};

test.only = function(name: string, fn: () => void | Promise<void>, timeout?: number) {
  testContext.test(name, fn, { only: true, timeout });
};

export function it(name: string, fn: () => void | Promise<void>, timeout?: number) {
  testContext.test(name, fn, { timeout });
}

it.skip = function(name: string, fn: () => void | Promise<void>, timeout?: number) {
  testContext.test(name, fn, { skip: true, timeout });
};

it.only = function(name: string, fn: () => void | Promise<void>, timeout?: number) {
  testContext.test(name, fn, { only: true, timeout });
};

export function beforeEach(fn: () => void | Promise<void>) {
  testContext.beforeEach(fn);
}

export function afterEach(fn: () => void | Promise<void>) {
  testContext.afterEach(fn);
}

export function beforeAll(fn: () => void | Promise<void>) {
  testContext.beforeAll(fn);
}

export function afterAll(fn: () => void | Promise<void>) {
  testContext.afterAll(fn);
}

export { expect, Also, Maybe, Please, Transform, Insist, Roughly, Spy, Ask, mock, send, receive, clearSent };

// Type definitions for global functions
type DescribeFn = ((name: string, fn: () => void) => void) & {
  skip: (name: string, fn: () => void) => void;
  only: (name: string, fn: () => void) => void;
};
type TestFn = ((name: string, fn: () => void | Promise<void>, timeout?: number) => void) & {
  skip: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
  only: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
};
type ItFn = ((name: string, fn: () => void | Promise<void>, timeout?: number) => void) & {
  skip: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
  only: (name: string, fn: () => void | Promise<void>, timeout?: number) => void;
};
type HookFn = (fn: () => void | Promise<void>) => void;
type ExpectFn = typeof expect;
type AlsoFn = typeof Also;
type MaybeFn = typeof Maybe;
type PleaseFn = typeof Please;
type TransformFn = typeof Transform;
type InsistFn = typeof Insist;
type RoughlyFn = typeof Roughly;
type SpyFn = typeof Spy;
type AskFn = typeof Ask;
type MockFn = typeof mock;
type SendFn = typeof send;
type ReceiveFn = typeof receive;
type ClearSentFn = typeof clearSent;

// Make functions globally available
declare global {
  var describe: DescribeFn;
  var test: TestFn;
  var it: ItFn;
  var beforeEach: HookFn;
  var afterEach: HookFn;
  var beforeAll: HookFn;
  var afterAll: HookFn;
  var expect: ExpectFn;
  var Also: AlsoFn;
  var Maybe: MaybeFn;
  var Please: PleaseFn;
  var Transform: TransformFn;
  var Insist: InsistFn;
  var Roughly: RoughlyFn;
  var Spy: SpyFn;
  var Ask: AskFn;
  var mock: MockFn;
  var send: SendFn;
  var receive: ReceiveFn;
  var clearSent: ClearSentFn;
}

global.describe = describe as DescribeFn;
global.test = test as TestFn;
global.it = it as ItFn;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.expect = expect;
global.Also = Also;
global.Maybe = Maybe;
global.Please = Please;
global.Transform = Transform;
global.Insist = Insist;
global.Roughly = Roughly;
global.Spy = Spy;
global.Ask = Ask;
global.mock = mock;
global.send = send;
global.receive = receive;
global.clearSent = clearSent;
