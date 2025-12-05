interface MockCall {
  args: any[];
  returnValue?: any;
  error?: Error;
}

export interface MockFunction {
  (...args: any[]): any;
  mockReturnValue(value: any): MockFunction;
  mockReturnValueOnce(value: any): MockFunction;
  mockImplementation(fn: (...args: any[]) => any): MockFunction;
  mockImplementationOnce(fn: (...args: any[]) => any): MockFunction;
  getCalls(): MockCall[];
  getCallCount(): number;
  getCallArgs(index: number): any[];
  wasCalledWith(...args: any[]): boolean;
  reset(): void;
}

class MockFunctionImpl {
  private calls: MockCall[] = [];
  private returnValues: any[] = [];
  private implementations: ((...args: any[]) => any)[] = [];
  private defaultReturnValue: any = undefined;

  execute(...args: any[]): any {
    const call: MockCall = { args };

    try {
      let returnValue: any;

      if (this.onceImplementations.length > 0) {
        // Use once implementation first
        const impl = this.onceImplementations.shift();
        returnValue = impl!(...args);
      } else if (this.implementations.length > 0) {
        // Use persistent implementation
        returnValue = this.implementations[0](...args);
      } else if (this.returnValues.length > 0) {
        returnValue = this.returnValues.shift();
      } else {
        returnValue = this.defaultReturnValue;
      }

      call.returnValue = returnValue;
      this.calls.push(call);
      return returnValue;
    } catch (error) {
      call.error = error as Error;
      this.calls.push(call);
      throw error;
    }
  }

  mockReturnValue(value: any): MockFunction {
    this.defaultReturnValue = value;
    return this.proxy;
  }

  mockReturnValueOnce(value: any): MockFunction {
    this.returnValues.push(value);
    return this.proxy;
  }

  mockImplementation(fn: (...args: any[]) => any): MockFunction {
    this.implementations = [fn];
    this.defaultReturnValue = undefined;
    this.returnValues = [];
    // Don't clear onceImplementations - they should run first
    return this.proxy;
  }

  mockImplementationOnce(fn: (...args: any[]) => any): MockFunction {
    this.onceImplementations.push(fn);
    return this.proxy;
  }

  private onceImplementations: ((...args: any[]) => any)[] = [];

  public proxy!: MockFunction;

  getCalls(): MockCall[] {
    return this.calls;
  }

  getCallCount(): number {
    return this.calls.length;
  }

  getCallArgs(index: number): any[] {
    return this.calls[index]?.args || [];
  }

  wasCalledWith(...args: any[]): boolean {
    return this.calls.some(call => 
      call.args.length === args.length &&
      call.args.every((arg, i) => this.deepEqual(arg, args[i]))
    );
  }

  reset(): void {
    this.calls = [];
    this.returnValues = [];
    this.implementations = [];
    this.defaultReturnValue = undefined;
  }

  private deepEqual(a: any, b: any): boolean {
    if (Object.is(a, b)) return true;
    if (a === null || b === null) return false;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
      if (!keysB.includes(key)) return false;
      if (!this.deepEqual(a[key], b[key])) return false;
    }

    return true;
  }
}

export function mock(): MockFunction {
  const impl = new MockFunctionImpl();
  
  const fn = function(...args: any[]) {
    return impl.execute(...args);
  } as MockFunction;

  fn.mockReturnValue = impl.mockReturnValue.bind(impl);
  fn.mockReturnValueOnce = impl.mockReturnValueOnce.bind(impl);
  fn.mockImplementation = impl.mockImplementation.bind(impl);
  fn.mockImplementationOnce = impl.mockImplementationOnce.bind(impl);
  fn.getCalls = impl.getCalls.bind(impl);
  fn.getCallCount = impl.getCallCount.bind(impl);
  fn.getCallArgs = impl.getCallArgs.bind(impl);
  fn.wasCalledWith = impl.wasCalledWith.bind(impl);
  fn.reset = impl.reset.bind(impl);

  impl.proxy = fn;

  return fn;
}
