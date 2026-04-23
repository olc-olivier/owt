// Type augmentations so TypeScript accepts Jasmine-style matchers and spyOn with Vitest
import 'vitest';

interface JasmineSpy {
  and: { returnValue(val: unknown): void };
}

declare module 'vitest' {
  interface Assertion<R = unknown> {
    toBeTrue(): void;
    toBeFalse(): void;
    toContain(expected: unknown): void;
  }
  interface AsymmetricMatchersContaining {
    toBeTrue(): void;
    toBeFalse(): void;
  }
}

declare global {
  function spyOn(obj: object, method: string): JasmineSpy;
}
