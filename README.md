# bcrypt-salt

Profile hardware performance to calculate the most secure `saltRounds` to use in bcrypt.

**How does it work?**

1. Run this before configuring bcrypt
2. Use the `saltRounds` value returned from `bcrypt-salt` as bcrypt's `saltRounds` value

## usage with bcrypt

Before:
```javascript
const bcrypt = require('bcrypt');
const saltRounds = 10;

var hash = bcrypt.hashSync("my plain text password" saltRounds);
```

After:
```javascript
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');

const bs = new BcryptSalt();
const hash = bcrypt.hashSync("my plain text password" bs.saltRounds);
```

Benefits over setting manually:
- remove the guess work of how high to set `saltRounds`
- calculate the highest `saltRounds` your hardware can use, given a max allowed hash time (defaults to 1000ms)
- generate more secure hashes automaticaly when running on faster hardware

**Custom settings:**

```javascript
const BcryptSalt = require('bcrypt-salt');

// runs synchronously
const bs = new BcryptSalt({
   maxHashTime: 1000,   // default: 1000ms
   logs: true,          // default: true
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
// ex: 238ms
```

## Examples:

Ensure a minimum `saltRounds` value of 10:
```javascript
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');

const bs = new BcryptSalt();

const saltRounds = bs.saltRounds >= 10 ? bs.saltRounds : 10;
const hash = bcrypt.hashSync("my plain text password" bs.saltRounds);
```
---
Ensure a minimum `saltRounds` value of 10 and the highest `saltRounds` possible under 500ms hash time:
```javascript
const bcrypt = require('bcrypt');
const BcryptSalt = require('bcrypt-salt');

const bs = new BcryptSalt({
  maxHashTime: 500
});

const saltRounds = bs.saltRounds >= 10 ? bs.saltRounds : 10;
const hash = bcrypt.hashSync("my plain text password" bs.saltRounds);
```

### More about bcrypt and saltRounds

The complexity of the hash is directly related to the `saltRounds`. The higher the `saltRounds`, the more secure the hash. However, setting this too high can take a really long time resulting in a bad user experience (i.e. when creating accounts based on a hashed password or logging in).

Checkout the [brypt npm documentation](https://www.npmjs.com/package/bcrypt#a-note-on-rounds)
