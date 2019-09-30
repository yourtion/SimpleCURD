/**
 * @file 项目操作
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { log4js, errors, config, mysql, squel } = require('../global');
const { tableModel } = require('../models');
const { reGenData } = require('../init');
const logger = log4js.getLogger();

const checkTable = (table) => {
  const sql = squel.select().from(table).limit(1).toString();
  return mysql.queryAsync(sql).catch(() => { throw errors.notFoundError('数据表 `' + table + '`'); });
};

exports.listTable = function* (req, res) {
  logger.trace('listTable');
  const result = yield tableModel.page({},
    tableModel.fields,
    req.$pages.limit,
    req.$pages.offset,
    req.$pages.order,
    req.$pages.asc
  );
  res.page(result);
};

exports.addTable = function* (req, res) {
  logger.trace('addTable', req.$params);
  const input = _.pick(req.$params, tableModel.fields);
  try {
    yield checkTable(input.name);
    yield tableModel.insert(input);
    res.success(config.message.success);
    yield reGenData();
  } catch (error) {
    res.error(error);
  }
};

exports.getTable = function* (req, res) {
  logger.trace('getTable', req.$params);
  const { table_id } = req.$params;
  const result = yield tableModel.getById(table_id);
  if(!result) throw errors.notFoundError('Table');
  res.success(result);
};

exports.updateTable = function* (req, res) {
  logger.trace('updateTable', req.$params);
  const input = _.pick(req.$params, tableModel.fields);
  const { id } = input;
  delete input.id;
  try {
    if(input.name) {
      yield checkTable(input.name);
    }
    yield tableModel.updateById(id, input);
    yield reGenData();
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.deleteTable = function* (req, res) {
  logger.trace('deleteTable', req.$params);
  const { table_id } = req.$params;
  try {
    yield tableModel.deleteById(table_id);
    yield reGenData();
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};
