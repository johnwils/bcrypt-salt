'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('test return values', function () {
  it('uses a default maxHashTime of 500', function () {
    var bs = new _index2.default();
    expect(bs.maxHashTime).toBe(500);
  });
});

describe('test return values', function () {
  var maxHashTime = 1000;
  var bs = new _index2.default({ maxHashTime });
  it('returns maxHashTime', function () {
    expect(bs.maxHashTime).toBeDefined();
  });
  it('returns saltRounds', function () {
    expect(bs.saltRounds).toBeDefined();
  });
  it('returns a lower hashTime than maxTime', function () {
    expect(bs.maxHashTime).toBeLessThanOrEqual(maxHashTime);
  });
  it('returns a higher nextHashTime than maxTime', function () {
    expect(bs.nextHashTime).toBeGreaterThanOrEqual(maxHashTime);
  });
});