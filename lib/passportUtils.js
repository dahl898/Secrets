const crypto = require('crypto');

function genPassword(password){
  const salt = crypto.randomBytes(32).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, parseInt(process.env.ITER), parseInt(process.env.KEYLEN), 'sha256').toString('hex');
  return {
    hash: hash,
    salt: salt
  }
};

module.exports.genPassword = genPassword;
