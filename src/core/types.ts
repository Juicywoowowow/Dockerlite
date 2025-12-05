export interface TestResult {
  name: string;
  passed: boolean;
  error?: Error;
  duration: number;
  skipped?: boolean;
}

export interface SuiteResult {
  name: string;
  tests: TestResult[];
  suites: SuiteResult[];
}

export type TestFn = () => void | Promise<void>;
export type HookFn = () => void | Promise<void>;
