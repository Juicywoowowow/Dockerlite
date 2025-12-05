const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m'
};

export class PleaseValue {
  constructor(public value: any) {
    this.printWarning();
  }

  private printWarning() {
    console.warn(
      `${colors.yellow}Warning: Do not use Please() as it may bring false results. Use it for mocks or forced values.${colors.reset}`
    );
  }

  getValue(): any {
    return this.value;
  }
}

export function Please(value: any): PleaseValue {
  return new PleaseValue(value);
}
