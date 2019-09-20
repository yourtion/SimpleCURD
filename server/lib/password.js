'use strict';

/**
 * @file 密码辅助函数
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const bcrypt = require('bcrypt');
const { config } = require('../global');

exports.getPassword = (password) => {
  return bcrypt.hash(password, config.saltRounds);
};

exports.comparePassword = (input, stored) => {
  return bcrypt.compare(input, stored);
};

