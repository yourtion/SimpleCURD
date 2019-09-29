'use strict';

/**
 * @file 配置加载
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const env = process.env.NODE_ENV || 'dev';

const base = {
  env,
  cookieMaxAge: 3600000 * 24 * 10, // 默认 cookies 时间
  sessionSecret: 'sajdlkasjdlakjdasljdlas', // session 密钥
  sessionPrefix: 'scurd:', // session 前缀
  redisKey: 'scurd',
  saltRounds: 10, // 密码加盐长度
  message: {
    success: '操作成功',
    error: '操作失败',
  },
  model: {
    offset: 0,
    limit: 30,
    asc: true,
  },
};

module.exports = Object.assign({}, base, require(`./${ env }.js`));
