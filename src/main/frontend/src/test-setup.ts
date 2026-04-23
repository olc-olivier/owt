// Jasmine compatibility shims and global browser API stubs for Vitest/jsdom

import { expect, vi } from 'vitest';

// Add toBeTrue / toBeFalse matchers missing from Vitest
expect.extend({
  toBeTrue(received: unknown) {
    return {
      pass: received === true,
      message: () => `expected ${received} to be true`,
    };
  },
  toBeFalse(received: unknown) {
    return {
      pass: received === false,
      message: () => `expected ${received} to be false`,
    };
  },
});

// Jasmine-style spyOn shim: spyOn(obj, 'method').and.returnValue(val)
(globalThis as Record<string, unknown>)['spyOn'] = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  obj: any,
  method: string,
) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spy = vi.spyOn(obj as any, method as any) as any;
  return {
    and: {
      returnValue: (val: unknown) => spy.mockReturnValue(val),
    },
  };
};

// jsdom doesn't implement window.matchMedia — stub it globally
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: vi.fn().mockReturnValue({ matches: false } as MediaQueryList),
});
