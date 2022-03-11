# bcrypt-salt

Profile hardware performance to calculate the most secure `saltRounds` to use in bcrypt.

**How does it work?**

1. Run this before configuring bcrypt
2. Use the `saltRounds` value returned from `bcrypt-salt` as bcrypt's `saltRounds` value

## usage with bcrypt

Install:

```
npm install bcrypt-salt --save
```

Before:

```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

const hash = bcrypt.hashSync('my plain text password', saltRounds);
```

After:

```javascript
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');

const bs = new BcryptSalt();
const hash = bcrypt.hashSync('my plain text password', bs.saltRounds);
```

Benefits over setting manually:

- remove the guess work of how high to set `saltRounds`
- calculate the highest `saltRounds` your hardware can use, given a max allowed hash time (defaults to 500ms)
- generate more secure hashes automaticaly when running on faster hardware

**Custom settings:**

```javascript
const BcryptSalt = require('bcrypt-salt');

// runs synchronously
const bs = new BcryptSalt({
  maxHashTime: 500,   // default: 500ms
  logs: true,         // default: true
});

/**
 * stats below now available for your hardware
 * bs.saltRounds // type: Number
 * bs.hashTime   // type: Number
 */

// max number of salt rounds without going over maxHashTime
console.log(bs.saltRounds);
// ex: 11

// number of milliseconds taken to calculate the hash
console.log(bs.hashTime);
// ex: 316ms
```

For reference, here are the results of the above example (running on a MBP 2015 laptop):

```bash
saltRounds:  1, hashTime: 1.5116290000000845ms
saltRounds:  2, hashTime: 2.9353470000000925ms
saltRounds:  3, hashTime: 4.262208999999984ms
saltRounds:  4, hashTime: 5.647235000000137ms
saltRounds:  5, hashTime: 8.489819000000125ms
saltRounds:  6, hashTime: 13.52793900000006ms
saltRounds:  7, hashTime: 23.719949000000042ms
saltRounds:  8, hashTime: 43.463322999999946ms
saltRounds:  9, hashTime: 84.93861500000003ms
saltRounds: 10, hashTime: 159.71765900000014ms
saltRounds: 11, hashTime: 316.371854ms
saltRounds: 12, hashTime: 614.3531209999999ms

Recommended bcrypt saltRounds for this hardware is 11 running in 316.371854ms.

1 higher exceeds max hash time (500ms)
```

## Examples:

Ensure a minimum `saltRounds` value of 10:

```javascript
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');

const bs = new BcryptSalt();

const saltRounds = bs.saltRounds >= 10 ? bs.saltRounds : 10;
const hash = bcrypt.hashSync("my plain text password", saltRounds);
```

---

Ensure a minimum `saltRounds` value of 10 and the highest `saltRounds` possible under 100ms hash time:

```javascript
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');

const bs = new BcryptSalt({
  maxHashTime: 100
});

const saltRounds = bs.saltRounds >= 10 ? bs.saltRounds : 10;
const hash = bcrypt.hashSync("my plain text password", saltRounds);
```

---

Usage with Meteor (version 1.6.1 or higher):

```javascript
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import BcryptSalt from 'bcrypt-salt';

Meteor.startup(() => {
  const bs = new BcryptSalt({ maxHashTime: 500, logs: true });
  Accounts._options.bcryptRounds = bs.saltRounds;
});
```

### More about bcrypt saltRounds

The calculation time of the hash is directly related to the `saltRounds`. A higher `saltRounds` ensures more complex and secure hashes are used. However, setting this too high can take a really long time resulting in a bad user experience (i.e. when creating accounts based on a hashed password). Every subsequent login will take the same amount of time as when creating the account.

Checkout the [brypt npm documentation](https://www.npmjs.com/package/bcrypt#a-note-on-rounds)

### maxHashTime, why default to 500ms?

500ms is provided as a default value. A time that is acceptable for each use case is subjective, so not meant as a recommendation. Each developer can set this to what works best for them. A value of 1000ms might work for you, or 250ms. Note: anything higher then 10000ms currently generates a warning.
