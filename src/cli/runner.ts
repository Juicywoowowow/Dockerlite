import * as fs from 'fs';
import * as path from 'path';
import { testContext } from '../core/test-context';
import { ConsoleReporter } from '../reporters/console';

export class TestRunner {
  async run(patterns: string[]) {
    const testFiles = this.findTestFiles(patterns);

    if (testFiles.length === 0) {
      console.log('No test files found');
      return false;
    }

    for (const file of testFiles) {
      testContext.reset();
      
      // Set snapshot file for this test file
      const { snapshotManager } = require('../core/snapshot');
      snapshotManager.setSnapshotFile(file);
      
      await this.loadTestFile(file);
    }

    const results = await testContext.runTests();
    const reporter = new ConsoleReporter();
    reporter.report(results);

    return !reporter.hasFailures();
  }

  private findTestFiles(patterns: string[]): string[] {
    if (patterns.length > 0) {
      return patterns.filter(p => fs.existsSync(p));
    }

    return this.findTestFilesRecursive(process.cwd());
  }

  private findTestFilesRecursive(dir: string): string[] {
    const files: string[] = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'dist') {
        files.push(...this.findTestFilesRecursive(fullPath));
      } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.js'))) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private async loadTestFile(file: string) {
    try {
      require(file);
    } catch (error) {
      console.error(`Error loading test file ${file}:`, error);
    }
  }
}
