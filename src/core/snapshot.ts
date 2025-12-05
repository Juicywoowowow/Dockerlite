import * as fs from 'fs';
import * as path from 'path';

class SnapshotManager {
  private snapshots: Map<string, any> = new Map();
  private snapshotFile: string = '';
  private currentTest: string = '';
  private snapshotCounts: Map<string, number> = new Map();

  setSnapshotFile(file: string) {
    this.snapshotFile = file.replace(/\.test\.(ts|js)$/, '.snap.json');
    this.loadSnapshots();
  }

  setCurrentTest(testName: string) {
    this.currentTest = testName;
  }

  private loadSnapshots() {
    if (!this.snapshotFile) return;

    try {
      if (fs.existsSync(this.snapshotFile)) {
        const content = fs.readFileSync(this.snapshotFile, 'utf-8');
        const data = JSON.parse(content);
        this.snapshots = new Map(Object.entries(data));
      }
    } catch (error) {
      // Ignore errors, will create new snapshot file
    }
  }

  private saveSnapshots() {
    if (!this.snapshotFile) return;

    const data: Record<string, any> = {};
    this.snapshots.forEach((value, key) => {
      data[key] = value;
    });

    const dir = path.dirname(this.snapshotFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(this.snapshotFile, JSON.stringify(data, null, 2), 'utf-8');
  }

  matchSnapshot(value: any): { pass: boolean; message?: string } {
    const name = this.currentTest;
    
    if (!name) {
      throw new Error('Cannot create snapshot without test name. Make sure snapshot is called within a test.');
    }

    // Generate unique key for multiple snapshots in same test
    const count = this.snapshotCounts.get(name) || 0;
    this.snapshotCounts.set(name, count + 1);
    const key = count > 0 ? `${name} ${count + 1}` : name;

    const serialized = this.serialize(value);

    if (!this.snapshots.has(key)) {
      // Create new snapshot
      this.snapshots.set(key, serialized);
      this.saveSnapshots();
      return { pass: true };
    }

    // Compare with existing snapshot
    const existing = this.snapshots.get(key);
    const matches = this.deepEqual(serialized, existing);

    if (!matches) {
      return {
        pass: false,
        message: `Snapshot mismatch for "${key}"\nExpected: ${JSON.stringify(existing, null, 2)}\nReceived: ${JSON.stringify(serialized, null, 2)}`
      };
    }

    return { pass: true };
  }

  private serialize(value: any): any {
    if (value === null) return null;
    if (value === undefined) return '[Undefined]'; // Special marker for undefined
    if (typeof value === 'function') return '[Function]';
    if (value instanceof Date) return value.toISOString();
    if (value instanceof RegExp) return value.toString();
    if (Array.isArray(value)) return value.map(v => this.serialize(v));
    if (typeof value === 'object') {
      const result: any = {};
      for (const key in value) {
        if (value.hasOwnProperty(key)) {
          result[key] = this.serialize(value[key]);
        }
      }
      return result;
    }
    return value;
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

  reset() {
    this.snapshotCounts.clear();
  }
}

export const snapshotManager = new SnapshotManager();
