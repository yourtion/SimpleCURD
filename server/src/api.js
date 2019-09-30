'use strict';

/**
 * @file API文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { errors, API } = require('./global');

const INFO = {
  title: 'SimpleCURD',
  description: '数据库管理系统API文档',
  version: new Date(),
  host: 'http://127.0.0.1:4000',
  basePath: '/api',
};

const GROUPS = {
  Index: '首页',
  Admin: '管理员',
  Schema: '模型',
  Collect: '数据收集',
  Project: '项目',
  Table: '表格',
};

const apiService = new API({
  info: INFO,
  groups: GROUPS,
  path: require('path').resolve(__dirname, 'routers'),
  missingParameterError: errors.missingParameterError,
  invalidParameterError: errors.invalidParameterError,
  internalError: errors.internalError,
  errors: errors.ERROR_INFO,
});

module.exports = apiService;
