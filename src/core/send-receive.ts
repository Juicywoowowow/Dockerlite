const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m'
};

interface SendOptions {
  exclude?: string[];
  include?: string[];
}

class SendReceiveStore {
  private store: Map<string, any> = new Map();

  send(key: string, value: any, options?: SendOptions): void {
    // Check for duplicate key
    if (this.store.has(key)) {
      console.warn(
        `${colors.yellow}Warning: Key "${key}" has already been sent. Duplicate send() ignored.${colors.reset}`
      );
      return;
    }

    let processedValue = value;

    // Apply filtering if options provided
    if (options && typeof value === 'object' && value !== null) {
      processedValue = this.filterValue(value, options);
    }

    this.store.set(key, processedValue);
  }

  receive(key: string): any {
    // Support nested access with dot notation
    if (key.includes('.')) {
      return this.getNestedValue(key);
    }

    if (!this.store.has(key)) {
      throw new Error(`receive() failed: Key "${key}" was not sent by any previous test`);
    }

    return this.store.get(key);
  }

  clearSent(): void {
    this.store.clear();
  }

  private filterValue(value: any, options: SendOptions): any {
    if (Array.isArray(value)) {
      return value.map(item => this.filterValue(item, options));
    }

    if (typeof value !== 'object' || value === null) {
      return value;
    }

    const result: any = {};

    if (options.include) {
      // Only include specified fields
      for (const key of options.include) {
        if (key in value) {
          result[key] = value[key];
        }
      }
    } else if (options.exclude) {
      // Include all except excluded fields
      for (const key in value) {
        if (!options.exclude.includes(key)) {
          result[key] = value[key];
        }
      }
    } else {
      return value;
    }

    return result;
  }

  private getNestedValue(path: string): any {
    const parts = path.split('.');
    const rootKey = parts[0];

    if (!this.store.has(rootKey)) {
      throw new Error(`receive() failed: Key "${rootKey}" was not sent by any previous test`);
    }

    let current = this.store.get(rootKey);

    for (let i = 1; i < parts.length; i++) {
      if (current === null || current === undefined) {
        throw new Error(`receive() failed: Cannot access "${parts[i]}" on ${current} at path "${path}"`);
      }

      if (typeof current !== 'object') {
        throw new Error(`receive() failed: Cannot access property "${parts[i]}" on non-object at path "${path}"`);
      }

      if (!(parts[i] in current)) {
        throw new Error(`receive() failed: Property "${parts[i]}" does not exist at path "${path}"`);
      }

      current = current[parts[i]];
    }

    return current;
  }
}

export const sendReceiveStore = new SendReceiveStore();

export function send(key: string, value: any, options?: SendOptions): void {
  sendReceiveStore.send(key, value, options);
}

export function receive(key: string): any {
  return sendReceiveStore.receive(key);
}

export function clearSent(): void {
  sendReceiveStore.clearSent();
}
