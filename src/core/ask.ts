interface Message {
  data: any;
  timestamp: number;
}

class AskChannel {
  private buffer: Message[] = [];
  private closed = false;
  private targetTest: string | null = null;
  private sourceTest: string | null = null;

  constructor(target?: string) {
    this.targetTest = target || null;
  }

  send(data: any): void {
    if (this.closed) {
      throw new Error('Cannot send on closed channel');
    }

    this.buffer.push({
      data,
      timestamp: Date.now()
    });

    console.log(`\x1b[36m  → Ask channel sent message (buffer: ${this.buffer.length})\x1b[0m`);
  }

  receive(): any {
    if (this.buffer.length === 0) {
      if (this.closed) {
        throw new Error('Channel is closed and no messages available');
      }
      throw new Error('No messages available in channel');
    }

    const message = this.buffer.shift();
    console.log(`\x1b[36m  ← Ask channel received message (buffer: ${this.buffer.length})\x1b[0m`);
    return message!.data;
  }

  next(): any {
    return this.receive();
  }

  hasMore(): boolean {
    return this.buffer.length > 0 || !this.closed;
  }

  peek(): any {
    if (this.buffer.length === 0) {
      return undefined;
    }
    return this.buffer[0].data;
  }

  close(): void {
    this.closed = true;
    console.log(`\x1b[36m  ✓ Ask channel closed (${this.buffer.length} messages remaining)\x1b[0m`);
  }

  isClosed(): boolean {
    return this.closed;
  }

  getBufferSize(): number {
    return this.buffer.length;
  }

  clear(): void {
    this.buffer = [];
  }
}

class AskManager {
  private channels: Map<string, AskChannel> = new Map();
  private currentTest: string = '';
  private testOrder: string[] = [];

  setCurrentTest(testName: string): void {
    this.currentTest = testName;
    if (!this.testOrder.includes(testName)) {
      this.testOrder.push(testName);
    }
  }

  createChannel(target?: string): AskChannel {
    // If no target specified, use a wildcard that will match the next test
    const targetTest = target || '__NEXT__';
    const channelKey = `${this.currentTest}<->${targetTest}`;
    
    if (!this.channels.has(channelKey)) {
      const channel = new AskChannel(targetTest);
      this.channels.set(channelKey, channel);
      console.log(`\x1b[36m  ⚡ Ask channel created: ${this.currentTest} ↔ ${targetTest}\x1b[0m`);
    }

    return this.channels.get(channelKey)!;
  }

  receiveChannel(from?: string): AskChannel {
    // If no source specified, look for channel from previous test
    if (!from) {
      // Find any channel that targets this test or uses __NEXT__
      for (const [key, channel] of this.channels.entries()) {
        const [source, target] = key.split('<->');
        if (target === '__NEXT__' || target === this.currentTest) {
          const prevIndex = this.testOrder.indexOf(source);
          const currIndex = this.testOrder.indexOf(this.currentTest);
          // Check if source is the previous test
          if (currIndex === prevIndex + 1) {
            console.log(`\x1b[36m  ⚡ Ask channel found: ${key}\x1b[0m`);
            return channel;
          }
        }
      }
    }
    
    const sourceTest = from || this.getPreviousTest();
    const channelKey = `${sourceTest}<->${this.currentTest}`;
    
    if (!this.channels.has(channelKey)) {
      // Channel doesn't exist yet, create it (sender will come later)
      const channel = new AskChannel(this.currentTest);
      this.channels.set(channelKey, channel);
      console.log(`\x1b[36m  ⚡ Ask channel created (receiver first): ${sourceTest} ↔ ${this.currentTest}\x1b[0m`);
    }

    return this.channels.get(channelKey)!;
  }

  private getNextTest(): string {
    const currentIndex = this.testOrder.indexOf(this.currentTest);
    if (currentIndex !== -1 && currentIndex < this.testOrder.length - 1) {
      return this.testOrder[currentIndex + 1];
    }
    // Return a placeholder that will match when the next test runs
    return `__next__${this.testOrder.length}`;
  }

  private getPreviousTest(): string {
    const currentIndex = this.testOrder.indexOf(this.currentTest);
    if (currentIndex > 0) {
      return this.testOrder[currentIndex - 1];
    }
    // Return a placeholder
    return `__prev__${this.testOrder.length}`;
  }

  reset(): void {
    this.channels.clear();
    this.testOrder = [];
    this.currentTest = '';
  }
}

export const askManager = new AskManager();

export function Ask(target?: string): AskChannel {
  return askManager.createChannel(target);
}

Ask.receive = function(from?: string): AskChannel {
  return askManager.receiveChannel(from);
};

Ask.from = function(source: string): AskChannel {
  return askManager.receiveChannel(source);
};
