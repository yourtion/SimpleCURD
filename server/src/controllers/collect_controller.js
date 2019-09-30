/**
 * @file 管理员操作
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { log4js, errors, config } = require('../global');
const { schemaUtils } = require('../lib');
const logger = log4js.getLogger();

exports.info = (req, res) => {
  logger.trace('collectInfo', req.$params);
  const { table } = req.$params;
  const schema = $.tables[table];
  if (!schema) throw errors.notFoundError('schema');
  res.success(schema);
};

exports.add = function* (req, res) {
  logger.trace('collectAdd', req.$params);
  const { table, data, update, info } = req.$params;
  if (!$.models) throw errors.internalError('initing');
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if (!model || !tableInfo) throw errors.notFoundError('table');
  delete data[tableInfo.primary];
  const out = schemaUtils.schemaCheaker(data, tableInfo.schema, [tableInfo.primary]);
  try {
    if (update && tableInfo.is_update) {
      const rest = yield model.createOrUpdate(out, _.without(Object.keys(out), tableInfo.primary));
      if (info) return res.success(rest);
    } else {
      const rest = yield model.insert(out);
      if (info) return res.success(rest);
    }
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.edit = function* (req, res) {
  logger.trace('collectEdit', req.$params);
  const { table, field, data } = req.$params;
  if (!$.models) throw errors.internalError('initing');
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if (!model || !tableInfo) throw errors.notFoundError('table');
  if (!tableInfo.is_update) throw errors.exceInvalidError('can not update');
  const out = schemaUtils.schemaCheaker(data, tableInfo.schema, [], true);
  if (Object.keys(out) === 0) throw errors.invalidParameterError('data empty');
  const query = {};
  query[field] = out[field];
  delete out[field];
  if (query[field] === undefined) throw errors.invalidParameterError('field');
  try {
    yield model.updateByField(query, out);
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.get = function* (req, res) {
  logger.trace('collectGet', req.$params);
  const { table, field, data, rank, count } = req.$params;
  if (!$.models) throw errors.internalError('initing');
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if (!model || !tableInfo) throw errors.notFoundError('table');
  const query = {};
  query[field] = data;
  if (query[field] === undefined) throw errors.invalidParameterError('field');
  try {
    const result = yield model.getOneByField(query);
    if (!result) throw errors.notFoundError('query');
    if (rank && model.fields.indexOf(rank) !== -1) {
      const count = yield model.count({ $rank: [rank + '>?', result[rank]]});
      result.rank = count + 1;
    }
    if (count) {
      const count = yield model.count() || 1;
      result.count = count;
    }
    res.success(result);
  } catch (error) {
    res.error(error);
  }
};

exports.page = function* (req, res) {
  logger.trace('collectPage', req.$params);
  const { table } = req.$params;
  const { $count = true, $fields } = req.query;
  const c = $count === true || $count === 'true';
  if (!$.models) throw errors.internalError('initing');
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if (!model || !tableInfo) throw errors.notFoundError('table');
  try {
    const query = {};
    const keys = Object.keys(tableInfo.schema);
    for (const key in req.query) {
      if (keys.indexOf(key) !== -1) {
        query[key] = req.query[key];
      }
    }
    const fields = $fields ? [] : model.fields;
    if ($fields) {
      $fields.split(',').forEach(f => {
        if (model.fields.indexOf(f) !== -1) {
          fields.push(f);
        }
      });
    }
    const method = c ? 'page' : 'list';
    const result = yield model[method](
      query,
      fields,
      req.$pages.limit,
      req.$pages.offset,
      req.$pages.order,
      req.$pages.asc
    );
    if (c) return res.page(result);
    res.page({
      page_data: {
        page: req.$pages.page,
        page_count: req.$pages.limit,
        count: 0,
      },
      list: result || [],
    });
  } catch (error) {
    res.error(error);
  }
};

exports.incr = function* (req, res) {
  logger.trace('collectIncr', req.$params);
  const { table, primaryName, primary, field, count } = req.$params;
  if (!$.models) throw errors.internalError('initing');
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if (!model || !tableInfo) throw errors.notFoundError('table');
  if (!tableInfo.is_update) throw errors.exceInvalidError('can not update');
  try {
    const primaryN = primaryName || tableInfo.primary;
    yield model.updateByField({ [primaryN]: primary }, { $f: `${field} = ${field} + ${count}` }, true);
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};
