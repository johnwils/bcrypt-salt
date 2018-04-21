import BcryptSalt from './index';

describe('test return values', () => {
  it('uses a default maxHashTime of 500', () => {
    const bs = new BcryptSalt();
    expect(bs.maxHashTime).toBe(500);
  });
});

describe('test return values', () => {
  const maxHashTime = 1000;
  const bs = new BcryptSalt({ maxHashTime });
  it('returns maxHashTime', () => {
    expect(bs.maxHashTime).toBeDefined();
  });
  it('returns saltRounds', () => {
    expect(bs.saltRounds).toBeDefined();
  });
  it('returns a lower hashTime than maxTime', () => {
    expect(bs.maxHashTime).toBeLessThanOrEqual(maxHashTime);
  });
  it('returns a higher nextHashTime than maxTime', () => {
    expect(bs.nextHashTime).toBeGreaterThanOrEqual(maxHashTime);
  });
});
