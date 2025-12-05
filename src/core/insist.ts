type InsistOptions = {
  attempts: number;
  delay?: number;
};

export class InsistValue {
  private fn: () => any;
  private attempts: number;
  private delay: number;

  constructor(fn: (() => any) | any, attemptsOrOptions: number | InsistOptions) {
    // If fn is not a function, wrap it in a function that returns it
    this.fn = typeof fn === 'function' ? fn : () => fn;

    // Parse options
    if (typeof attemptsOrOptions === 'number') {
      this.attempts = attemptsOrOptions;
      this.delay = 100; // Default 100ms
    } else {
      this.attempts = attemptsOrOptions.attempts;
      this.delay = attemptsOrOptions.delay ?? 100;
    }
  }

  getValue(): any {
    let lastError: any;
    
    for (let attempt = 1; attempt <= this.attempts; attempt++) {
      try {
        console.log(`\x1b[33m  ⟳ Insist attempt ${attempt} of ${this.attempts}...\x1b[0m`);
        
        // Call the function
        const result = this.fn();
        
        // Success! Log and return (could be a value or a Promise)
        console.log(`\x1b[33m  ✓ Insist succeeded on attempt ${attempt} of ${this.attempts}\x1b[0m`);
        return result;
      } catch (error) {
        lastError = error;
        
        // If not the last attempt, wait before retrying
        if (attempt < this.attempts) {
          this.sleepSync(this.delay);
        }
      }
    }
    
    // All attempts failed, throw the last error
    throw new Error(`Insist failed after ${this.attempts} attempts: ${lastError?.message || lastError}`);
  }

  private sleepSync(ms: number): void {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait (blocking - works for sync context)
    }
  }

  toString(): string {
    return `Insist(${this.attempts} attempts)`;
  }
}

export function Insist(fn: (() => any) | any, attemptsOrOptions: number | InsistOptions): InsistValue {
  return new InsistValue(fn, attemptsOrOptions);
}
