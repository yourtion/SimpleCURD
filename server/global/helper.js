'use strict';

/**
 * @file API 扩展
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const { utils, config } = require('./base');
/**
 * 类型枚举
 */
exports.types = {
  Boolean: 'Boolean',
  Date: 'Date',
  String: 'String',
  TrimString: 'TrimString',
  Nufember: 'Nufember',
  Integer: 'Integer',
  Float: 'Float',
  Object: 'Object',
  Array: 'Array',
  JSON: 'JSON',
  JSONString: 'JSONString',
  Any: 'Any',
  MongoIdString: 'MongoIdString',
  Email: 'Email',
  Domain: 'Domain',
  Alpha: 'Alpha',
  AlphaNumeric: 'AlphaNumeric',
  Ascii: 'Ascii',
  Base64: 'Base64',
  URL: 'URL',
  ENUM: 'ENUM',
  IntArray: 'IntArray',
  NullableString: 'NullableString',
  NullableInteger: 'NullableInteger',
};

/**
 * 参数构造
 *
 * @param {String} type 参数类型
 * @param {any} comment 参数说明
 * @param {any} required 是否必填
 * @param {any} defaultValue 默认值
 * @return {Object}
 */
exports.build = function build(type, comment, required, defaultValue, params) {
  return utils.removeUndefined({ type, comment, required, default: defaultValue, params });
};

/**
 * 分页默认模版
 */
exports.PAGEING = {
  page: { type: 'Integer', comment: '第n页', default: 1 },
  page_count: { type: 'Integer', comment: '每页数量（默认30）', default: config.model.limit },
  order: { type: 'String', comment: '排序字段（默认id）' },
  asc: { type: 'Boolean', comment: '是否升序（默认false）' },
  limit: { type: 'Integer', comment: '限制n条数据（优先）' },
  offset: { type: 'Integer', comment: '跳过n条数据（优先）' },
};

exports.PINGPPWEBHOOK = {
  id: { type: 'String', comment: 'ID' },
  created: { type: 'Integer', comment: '创建时间戳' },
  livemode: { type: 'Boolean', comment: '是否发生在生产环境' },
  type: { type: 'String', comment: '事件类型' },
  data: { type: 'Object', comment: '绑定在事件上的数据对象' },
  object: { type: 'String', comment: '值为 "event"' },
  pending_webhooks: { type: 'Integer', comment: '推送未成功的 webhooks 数量' },
  request: { type: 'String', comment: 'API Request ID' },
};
