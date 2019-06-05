"use strict";

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _performanceNow = _interopRequireDefault(require("performance-now"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BcryptSalt {
  /**
   * constructor
   * @param {Number}  args.maxHashTime - max allowed bcrypt hash time in milliseconds
   * @param {Boolean} args.logs        - show / hide logs in the console
   */
  constructor(args) {
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
    this.timeBefore = (0, _performanceNow.default)();
    this.run();
  }

  log() {
    this.logs && console.log(`saltRounds: ${this.saltRounds < 10 ? ' ' : ''}${this.saltRounds}, hashTime: ${this.hashTime}ms`);
  }

  nextLog() {
    this.logs && console.log(`saltRounds: ${this.nextSaltRounds < 10 ? ' ' : ''}${this.nextSaltRounds}, hashTime: ${this.nextHashTime}ms`);
  }

  endLog() {
    this.logs && console.log(`\nRecommended bcrypt saltRounds for this hardware is ${this.saltRounds} running in ${this.hashTime}ms.\n1 higher exceeds max hash time (${this.maxHashTime}ms)\n`);
  }

  run() {
    _bcrypt.default.hashSync(this.password, this.nextSaltRounds);

    this.nextHashTime = (0, _performanceNow.default)() - this.timeBefore;

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

}

module.exports = BcryptSalt;