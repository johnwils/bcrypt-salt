"use strict";

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('test return values', () => {
  it('uses a default maxHashTime of 500', () => {
    const bs = new _index.default();
    expect(bs.maxHashTime).toBe(500);
  });
});
describe('test return values', () => {
  const maxHashTime = 1000;
  const bs = new _index.default({
    maxHashTime
  });
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