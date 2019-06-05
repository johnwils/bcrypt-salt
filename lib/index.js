"use strict";

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _performanceNow = _interopRequireDefault(require("performance-now"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BcryptSalt =
/*#__PURE__*/
function () {
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
    this.timeBefore = (0, _performanceNow.default)();
    this.run();
  }

  _createClass(BcryptSalt, [{
    key: "log",
    value: function log() {
      this.logs && console.log(`saltRounds: ${this.saltRounds < 10 ? ' ' : ''}${this.saltRounds}, hashTime: ${this.hashTime}ms`);
    }
  }, {
    key: "nextLog",
    value: function nextLog() {
      this.logs && console.log(`saltRounds: ${this.nextSaltRounds < 10 ? ' ' : ''}${this.nextSaltRounds}, hashTime: ${this.nextHashTime}ms`);
    }
  }, {
    key: "endLog",
    value: function endLog() {
      this.logs && console.log(`\nRecommended bcrypt saltRounds for this hardware is ${this.saltRounds} running in ${this.hashTime}ms.\n1 higher exceeds max hash time (${this.maxHashTime}ms)\n`);
    }
  }, {
    key: "run",
    value: function run() {
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
  }]);

  return BcryptSalt;
}();

module.exports = BcryptSalt;