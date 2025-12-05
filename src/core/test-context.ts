import { TestFn, HookFn, TestResult, SuiteResult } from './types';

interface Test {
  name: string;
  fn: TestFn;
  skip?: boolean;
  only?: boolean;
  timeout?: number;
}

interface Suite {
  name: string;
  tests: Test[];
  suites: Suite[];
  beforeEachHooks: HookFn[];
  afterEachHooks: HookFn[];
  beforeAllHooks: HookFn[];
  afterAllHooks: HookFn[];
  skip?: boolean;
  only?: boolean;
}

class TestContext {
  private currentSuite: Suite | null = null;
  private rootSuites: Suite[] = [];
  private hasOnly = false;

  describe(name: string, fn: () => void, options?: { skip?: boolean; only?: boolean }) {
    const suite: Suite = {
      name,
      tests: [],
      suites: [],
      beforeEachHooks: [],
      afterEachHooks: [],
      beforeAllHooks: [],
      afterAllHooks: [],
      skip: options?.skip,
      only: options?.only
    };

    if (options?.only) {
      this.hasOnly = true;
    }

    if (this.currentSuite) {
      this.currentSuite.suites.push(suite);
    } else {
      this.rootSuites.push(suite);
    }

    const previousSuite = this.currentSuite;
    this.currentSuite = suite;
    fn();
    this.currentSuite = previousSuite;
  }

  test(name: string, fn: TestFn, options?: { skip?: boolean; only?: boolean; timeout?: number }) {
    if (!this.currentSuite) {
      const suite: Suite = {
        name: '',
        tests: [],
        suites: [],
        beforeEachHooks: [],
        afterEachHooks: [],
        beforeAllHooks: [],
        afterAllHooks: []
      };
      this.rootSuites.push(suite);
      this.currentSuite = suite;
    }

    if (options?.only) {
      this.hasOnly = true;
    }

    this.currentSuite.tests.push({ 
      name, 
      fn, 
      skip: options?.skip, 
      only: options?.only,
      timeout: options?.timeout
    });
  }

  beforeEach(fn: HookFn) {
    if (this.currentSuite) {
      this.currentSuite.beforeEachHooks.push(fn);
    }
  }

  afterEach(fn: HookFn) {
    if (this.currentSuite) {
      this.currentSuite.afterEachHooks.push(fn);
    }
  }

  beforeAll(fn: HookFn) {
    if (this.currentSuite) {
      this.currentSuite.beforeAllHooks.push(fn);
    }
  }

  afterAll(fn: HookFn) {
    if (this.currentSuite) {
      this.currentSuite.afterAllHooks.push(fn);
    }
  }

  async runTests(): Promise<SuiteResult[]> {
    const results: SuiteResult[] = [];

    for (const suite of this.rootSuites) {
      results.push(await this.runSuite(suite));
    }

    return results;
  }

  private async runSuite(suite: Suite): Promise<SuiteResult> {
    const result: SuiteResult = {
      name: suite.name,
      tests: [],
      suites: []
    };

    // Skip entire suite if marked
    if (suite.skip) {
      for (const test of suite.tests) {
        result.tests.push({
          name: test.name,
          passed: true,
          skipped: true,
          duration: 0
        });
      }
      return result;
    }

    // If hasOnly mode, skip suite unless it or a child has only
    if (this.hasOnly && !this.suiteHasOnly(suite)) {
      for (const test of suite.tests) {
        result.tests.push({
          name: test.name,
          passed: true,
          skipped: true,
          duration: 0
        });
      }
      return result;
    }

    for (const hook of suite.beforeAllHooks) {
      await hook();
    }

    for (const test of suite.tests) {
      // Skip if test is marked skip
      if (test.skip) {
        result.tests.push({
          name: test.name,
          passed: true,
          skipped: true,
          duration: 0
        });
        continue;
      }

      // In only mode, skip tests without only flag
      if (this.hasOnly && !test.only) {
        result.tests.push({
          name: test.name,
          passed: true,
          skipped: true,
          duration: 0
        });
        continue;
      }

      const testResult = await this.runTest(test, suite);
      result.tests.push(testResult);
    }

    for (const childSuite of suite.suites) {
      result.suites.push(await this.runSuite(childSuite));
    }

    for (const hook of suite.afterAllHooks) {
      await hook();
    }

    return result;
  }

  private suiteHasOnly(suite: Suite): boolean {
    if (suite.only) return true;
    if (suite.tests.some(t => t.only)) return true;
    return suite.suites.some(s => this.suiteHasOnly(s));
  }

  private async runTest(test: Test, suite: Suite): Promise<TestResult> {
    const start = Date.now();
    
    try {
      // Set current test name for snapshot manager and ask manager
      const { snapshotManager } = require('./snapshot');
      const { askManager } = require('./ask');
      const fullTestName = suite.name ? `${suite.name} > ${test.name}` : test.name;
      snapshotManager.setCurrentTest(fullTestName);
      askManager.setCurrentTest(fullTestName);

      for (const hook of suite.beforeEachHooks) {
        await hook();
      }

      // Run test with timeout if specified
      if (test.timeout) {
        await this.runWithTimeout(test.fn, test.timeout);
      } else {
        await test.fn();
      }

      for (const hook of suite.afterEachHooks) {
        await hook();
      }

      return {
        name: test.name,
        passed: true,
        duration: Date.now() - start
      };
    } catch (error) {
      return {
        name: test.name,
        passed: false,
        error: error as Error,
        duration: Date.now() - start
      };
    }
  }

  private async runWithTimeout(fn: TestFn, timeout: number): Promise<void> {
    return Promise.race([
      fn(),
      new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error(`Test timeout: exceeded ${timeout}ms`)), timeout)
      )
    ]);
  }

  reset() {
    this.currentSuite = null;
    this.rootSuites = [];
    this.hasOnly = false;
    
    // Reset ask manager
    const { askManager } = require('./ask');
    askManager.reset();
  }

  getRootSuites() {
    return this.rootSuites;
  }
}

export const testContext = new TestContext();
