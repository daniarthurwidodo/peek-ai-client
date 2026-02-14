// Test setup and global configuration
global.beforeAll = global.beforeAll || ((fn: any, timeout?: number) => fn());
global.afterAll = global.afterAll || ((fn: any, timeout?: number) => fn());
global.test = global.test || ((name: string, fn: any, timeout?: number) => fn());
global.describe = global.describe || ((name: string, fn: any) => fn());
global.expect = global.expect || ((value: any) => ({
  toBe: (expected: any) => {
    if (value !== expected) {
      throw new Error(`Expected ${value} to be ${expected}`);
    }
  },
  toContain: (expected: any) => {
    if (!value.includes(expected)) {
      throw new Error(`Expected ${value} to contain ${expected}`);
    }
  }
}));
