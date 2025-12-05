import { TestRunner } from './runner';

export async function cli(args: string[]) {
  const patterns = args.slice(2);
  const runner = new TestRunner();
  const success = await runner.run(patterns);
  process.exit(success ? 0 : 1);
}
