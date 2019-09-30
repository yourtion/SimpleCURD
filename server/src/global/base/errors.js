'use strict';

/**
 * @file 错误生成
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const assert = require('assert');

const errorInfo = {
  'InternalError': { code: -1000, desc: '内部错误', show: true, log: true },
  'MissingParameter': { code: -1001, desc: '缺少参数', show: true, log: false },
  'InvalidParameter': { code: -1002, desc: '参数不合法', show: true, log: false },
  'PermissionsError': { code: -1003, desc: '权限不足', show: true, log: true },
  'DataBaseError': { code: -1004, desc: '数据库错误', show: false, log: true },
  'NotFoundError': { code: -1005, desc: '找不到内容', show: true, log: false },
  'LoginError': { code: -1006, desc: '用户未登录', show: true, log: false },
  'RepeatError': { code: -1007, desc: '该记录已经存在', show: true, log: false },
  'CartFullError': { code: -1008, desc: '购物车已经满了', show: true, log: false },
  'ExceInvalidError': { code: -1009, desc: '不合法执行', show: true, log: false },
  'DependError': { code: -1010, desc: '数据存在依赖', show: true, log: false },
};

assert(new Set(Object.keys(errorInfo).map(k => errorInfo[k].code)).size === Object.keys(errorInfo).length, 'Error code 必须唯一');

exports.ERROR_INFO = errorInfo;

function error(name, value) {
  const e = errorInfo[name];
  const error = new Error();
  error.code = e.code || -1000;
  error.message = value ? `${ name } : ${ value }` : name;
  error.msg = value ? `${ e.desc } : ${ value }` : e.desc;
  error.show = e.show || false;
  error.log = e.log || false;
  return error;
}

exports.internalError = (value) => {
  return error('InternalError', value);
};

exports.missingParameterError = (value) => {
  return error('MissingParameter', value);
};

exports.invalidParameterError = (value) => {
  return error('InvalidParameter', value);
};

exports.permissionsError = (value) => {
  return error('PermissionsError', value);
};

exports.dataBaseError = (value) => {
  return error('DataBaseError', value);
};

exports.notFoundError = (value) => {
  return error('NotFoundError', value);
};

exports.loginError = (value) => {
  return error('LoginError', value);
};

exports.repeatError = (value) => {
  return error('RepeatError', value);
};
exports.cartFullError = (value) => {
  return error('CartFullError', value);
};
exports.exceInvalidError = (value) => {
  return error('ExceInvalidError', value);
};
exports.dependError = (value) => {
  return error('DependError', value);
};
