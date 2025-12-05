import { SuiteResult, TestResult } from '../core/types';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
  yellow: '\x1b[33m'
};

export class ConsoleReporter {
  private totalTests = 0;
  private passedTests = 0;
  private failedTests = 0;

  report(results: SuiteResult[]) {
    console.log('\nRunning tests...\n');

    for (const suite of results) {
      this.reportSuite(suite, 0);
    }

    this.reportSummary();
  }

  private reportSuite(suite: SuiteResult, indent: number) {
    if (suite.name) {
      const allPassed = this.allTestsPassed(suite);
      const symbol = allPassed ? '✓' : '✗';
      const color = allPassed ? colors.green : colors.red;
      console.log(`${'  '.repeat(indent)}${color}${symbol} ${suite.name}${colors.reset}`);
    }

    for (const test of suite.tests) {
      this.reportTest(test, indent + (suite.name ? 1 : 0));
    }

    for (const childSuite of suite.suites) {
      this.reportSuite(childSuite, indent + (suite.name ? 1 : 0));
    }
  }

  private reportTest(test: TestResult, indent: number) {
    this.totalTests++;

    if (test.skipped) {
      console.log(`${'  '.repeat(indent)}${colors.yellow}○${colors.reset} ${colors.gray}${test.name} (skipped)${colors.reset}`);
      return;
    }

    if (test.passed) {
      this.passedTests++;
      console.log(`${'  '.repeat(indent)}${colors.green}✓${colors.reset} ${colors.gray}${test.name}${colors.reset}`);
    } else {
      this.failedTests++;
      console.log(`${'  '.repeat(indent)}${colors.red}✗${colors.reset} ${test.name}`);
      if (test.error) {
        this.printError(test.error, indent + 1);
      }
    }
  }

  private printError(error: Error, indent: number) {
    const message = error.message;
    
    // Try to parse expected vs actual from error message
    const expectedMatch = message.match(/Expected (.+?) (?:not )?to/);
    const toMatch = message.match(/to (?:be|equal) (.+?)$/);
    
    if (expectedMatch && toMatch) {
      console.log(`${'  '.repeat(indent)}${colors.red}Expected:${colors.reset} ${toMatch[1]}`);
      console.log(`${'  '.repeat(indent)}${colors.red}Received:${colors.reset} ${expectedMatch[1]}`);
    } else {
      const errorLines = message.split('\n');
      errorLines.forEach(line => {
        console.log(`${'  '.repeat(indent)}${colors.red}${line}${colors.reset}`);
      });
    }

    // Print clean stack trace (filter out framework internals)
    if (error.stack) {
      const stackLines = error.stack.split('\n').slice(1);
      const relevantStack = stackLines
        .filter(line => !line.includes('node_modules') && !line.includes('dist/core'))
        .slice(0, 3);
      
      if (relevantStack.length > 0) {
        console.log(`${'  '.repeat(indent)}${colors.gray}${relevantStack.join('\n' + '  '.repeat(indent))}${colors.reset}`);
      }
    }
  }

  private allTestsPassed(suite: SuiteResult): boolean {
    const testsPass = suite.tests.every(t => t.passed);
    const suitesPass = suite.suites.every(s => this.allTestsPassed(s));
    return testsPass && suitesPass;
  }

  private reportSummary() {
    console.log();
    
    const failedText = this.failedTests > 0 
      ? `${colors.red}${this.failedTests} failed${colors.reset}, `
      : '';
    
    const passedText = `${colors.green}${this.passedTests} passed${colors.reset}`;
    
    console.log(`Tests: ${failedText}${passedText}, ${this.totalTests} total`);
  }

  hasFailures(): boolean {
    return this.failedTests > 0;
  }
}
