interface SpyCall {
  args: any[];
  returnValue?: any;
  error?: Error;
  timestamp: number;
}

export class SpyFunction {
  private calls: SpyCall[] = [];
  private originalFn: Function;

  constructor(fn: Function) {
    this.originalFn = fn;
    
    const spy = (...args: any[]) => {
      const call: SpyCall = {
        args,
        timestamp: Date.now()
      };

      try {
        const result = this.originalFn(...args);
        call.returnValue = result;
        this.calls.push(call);
        return result;
      } catch (error) {
        call.error = error as Error;
        this.calls.push(call);
        throw error;
      }
    };

    // Copy spy methods to the function
    Object.setPrototypeOf(spy, SpyFunction.prototype);
    (spy as any).calls = this.calls;
    (spy as any).originalFn = this.originalFn;

    return spy as any;
  }

  getCallCount(): number {
    return this.calls.length;
  }

  getCalls(): SpyCall[] {
    return [...this.calls];
  }

  getCall(index: number): SpyCall | undefined {
    return this.calls[index];
  }

  getLastCall(): SpyCall | undefined {
    return this.calls[this.calls.length - 1];
  }

  getLastReturnValue(): any {
    const lastCall = this.getLastCall();
    return lastCall?.returnValue;
  }

  wasCalledWith(...args: any[]): boolean {
    return this.calls.some(call => 
      call.args.length === args.length &&
      call.args.every((arg, i) => this.deepEqual(arg, args[i]))
    );
  }

  reset(): void {
    this.calls = [];
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

export function Spy(fn: Function): any {
  return new SpyFunction(fn);
}
