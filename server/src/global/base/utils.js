'use strict';

const CHARTS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const CHARTSL = CHARTS.length;

/**
 * @file 辅助函数
 * @author Yourtion Guo <yourtion@gmail.com>
 */

function leftPad(n, c) {
  let res = String(n);
  while (res.length < c) {
    res = '0' + res;
  }
  return res;
}
exports.leftPad = leftPad;

/**
 * 获取客户端IP
 *
 * @param {Object} req 请求
 * @returns {String} ip
 */
exports.getClientIP = function (req) {
  const ip = req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.ip;
  return ip.match(/\d+\.\d+\.\d+\.\d+/)[0];
};

/**
 * 转换 Unix 时间戳到 MySQL
 * @param {Number} unixtime Unix 时间戳
 * @return {String}
 */
exports.unixTime = unixtime => {
  const u = new Date(unixtime * 1000);
  return (
    u.getUTCFullYear() +
    '-' +
    ('0' + u.getUTCMonth()).slice(-2) +
    '-' +
    ('0' + u.getUTCDate()).slice(-2) +
    ' ' +
    ('0' + u.getUTCHours()).slice(-2) +
    ':' +
    ('0' + u.getUTCMinutes()).slice(-2) +
    ':' +
    ('0' + u.getUTCSeconds()).slice(-2) +
    '.' +
    (u.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5)
  );
};

/**
 * 获取 timestamp
 *
 * @param {Number} [after=0] 当前时间之后的秒数
 * @returns {Number}
 */
exports.genTimestamp = (after = 0) => {
  const now = new Date();
  return parseInt((now.getTime() + after * 1000) / 1000, 10);
};

/**
 * 格式化请求中的 Boolean 类型
 *
 * @param {any} query 请求参数
 * @param {Boolean} b 默认值
 * @returns {Boolean}
 */
exports.parseQueryBoolean = (query, b) => {
  const str = String(query);
  if (str === '1' || str === 'true' || str === 'yes' || str === 'on') {
    return true;
  } else if (str === '0' || str === 'false' || str === 'no' || str === 'off') {
    return false;
  }
  return b;
};

/**
 * 删除对象中的 undefined
 */
exports.removeUndefined = object => {
  Object.keys(object).forEach(key => object[key] === undefined && delete object[key]);
  return object;
};

/**
 * 将对象 object 合并到对象数组 array 元素中
 *
 * @param {Array} array 对象数组
 * @param {Object} object 待合并对象
 * @param {String} k1 array 中对象的key
 * @param {String} k2 对应 object 中的 key
 * @param {String} prefix 合并的前缀
 * @returns {Array}
 */
exports.mergeInfo = (array, object, k1, k2, prefix) => {
  array.map(a => {
    if (a[k1] === object[a[k1]][k2]) {
      const obj = object[a[k1]];
      Object.keys(obj).forEach(k => {
        a[prefix + '_' + k] = obj[k];
        if (k === 'thumbnail') a[k] = obj[k];
      });
    }
    return a[k1];
  });
  return array;
};

/**
 * 获取 coroutine 中错误堆栈
 * @param {Error} err 错误
 * @param {String} base 默认文件路径
 * @return {Array}
 */
exports.getErrorSourceFromCo = (err, base = '/src/') => {
  const reaseon = [];
  if (err.stack) {
    for (const line of err.stack.split('\n')) {
      if (line.indexOf(base) !== -1) {
        reaseon.push(line.trim().replace('at ', ''));
      }
    }
  }
  return reaseon;
};

/**
 * CSV 字符串生成
 */
exports.csvStringParser = (str, sep = ',') => {
  const c = new RegExp(sep, 'g');
  const q = new RegExp('"', 'g');
  const n = new RegExp(/\n|\r/, 'g');
  let item = str;

  if (str === 0) {
    return '0';
  } else if (str === undefined || str === null) {
    return '';
  }

  if (typeof item !== 'string') {
    const s = item.toString();
    if (s === '[object Object]') {
      item = JSON.stringify(item);
      if (item === '{}') {
        return '';
      }
    } else {
      item = s;
    }
  }

  if (item.search(c) >= 0 || item.search(q) >= 0 || item.search(n) >= 0) {
    return '"' + item.replace(q, '""') + '"';
  }
  return item + '';
};

/** 返回随机字符串 */
exports.createNonceStr = length => {
  const str = [];
  for (let i = 0; i < length; i++) {
    str.push(CHARTS.charAt(Math.floor(Math.random() * CHARTSL)));
  }
  return str.join('');
};

exports.getDateString = (pad = '', time = new Date()) => {
  return `${time.getFullYear()}${pad}${leftPad(time.getMonth() + 1, 2)}${pad}${leftPad(time.getDate(), 2)}`;
};
