'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _performanceNow = require('performance-now');

var _performanceNow2 = _interopRequireDefault(_performanceNow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BcryptSalt = function () {
  /**
   * constructor
   * @param {Number}  args.maxHashTime - max allowed bcrypt hash time in milliseconds
   * @param {Boolean} args.logs        - show / hide logs in the console
   */
  function BcryptSalt(args) {
    _classCallCheck(this, BcryptSalt);

    this.maxHashTime = args && typeof args.maxHashTime === 'number' && args.maxHashTime > 0 ? args.maxHashTime : 500;
    this.logs = args && typeof args.logs === 'boolean' && args.logs === false ? false : true;
    if (this.maxHashTime > 10000) {
      console.warn('warning: maxHashTime greater than 10 seconds, this may take a long time');
    }
    this.hashTime = 0;
    this.saltRounds = 0;
    this.nextHashTime = 0;
    this.nextSaltRounds = 1;
    this.password = 'my plain text password';
    this.timeBefore = (0, _performanceNow2.default)();
    this.run();
  }

  _createClass(BcryptSalt, [{
    key: 'log',
    value: function log() {
      this.logs && console.log(`saltRounds: ${this.saltRounds < 10 ? ' ' : ''}${this.saltRounds}, hashTime: ${this.hashTime}ms`);
    }
  }, {
    key: 'nextLog',
    value: function nextLog() {
      this.logs && console.log(`saltRounds: ${this.nextSaltRounds < 10 ? ' ' : ''}${this.nextSaltRounds}, hashTime: ${this.nextHashTime}ms`);
    }
  }, {
    key: 'endLog',
    value: function endLog() {
      this.logs && console.log(`\nRecommended bcrypt saltRounds for this hardware is ${this.saltRounds} running in ${this.hashTime}ms.\n1 higher exceeds max hash time (${this.maxHashTime}ms)\n`);
    }
  }, {
    key: 'run',
    value: function run() {
      _bcrypt2.default.hashSync(this.password, this.nextSaltRounds);
      this.nextHashTime = (0, _performanceNow2.default)() - this.timeBefore;
      if (this.nextHashTime < this.maxHashTime) {
        this.hashTime = this.nextHashTime;
        this.saltRounds = this.nextSaltRounds;
        this.nextSaltRounds += 1;
        this.log();
        this.run();
      } else {
        this.nextLog();
        this.endLog();
      }
    }
  }]);

  return BcryptSalt;
}();

module.exports = BcryptSalt;