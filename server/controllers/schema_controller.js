/**
 * @file 数据表操作
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { log4js, errors, config, utils } = require('../global');
const { projectModel, projectRoleModel } = require('../models');
const { schemaUtils } = require('../lib');
const logger = log4js.getLogger();
const xlsx = require('node-xlsx').default;

function getDate() {
  return new Date().toISOString().split('.')[0].replace(/-|:/g, '').replace('T', '-');
}

exports.getSchemas = function* (req, res) {
  logger.trace('getSchemas');
  const admin = req.$admin;
  const query = {};
  let projects;
  if(admin.role !== 'super') {
    query.admin_id = admin.id;
    const projectRole = yield projectRoleModel.list(query, [ 'project_id' ], 100);
    projects = new Set(projectRole.map(pr => pr.project_id));
  } else {
    projects = (yield projectModel.list({}, [ 'id' ])).map(p => p.id);
  }
  req.$admin.projects = projects;
  if(!projects) throw errors.permissionsError('project');
  const projectsInfo = projectModel.getProjectInfo(projects);
  return res.success(projectsInfo);
};

exports.pageTable = function* (req, res) {
  logger.trace('pageTable', req.$params);
  const { table, field, operate, value } = req.$params;
  const model = $.models[table];
  if(!model) throw errors.notFoundError('table');
  const query = {};
  if(operate && value !== undefined && field) {
    query.$query = [ `${ field } ${ operate } ?`, value ];
  }
  const result = yield model.page(query,
    model.fields,
    req.$pages.limit,
    req.$pages.offset,
    req.$pages.order,
    req.$pages.asc
  );
  res.page(result);
};

exports.tableRowAdd = function* (req, res) {
  logger.trace('tableRowAdd', req.$params);
  const { table, data } = req.$params;
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if(!model || !tableInfo) throw errors.notFoundError('table');
  delete data[tableInfo.primary];
  const out = schemaUtils.schemaCheaker(data, tableInfo.schema, [ tableInfo.primary ]);
  try {
    yield model.insert(out);
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.tableRowEdit = function* (req, res) {
  logger.trace('tableEditing', req.$params);
  const { table, primary, data } = req.$params;
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if(!model || !tableInfo) throw errors.notFoundError('table');
  const out = schemaUtils.schemaCheaker(data, tableInfo.schema);
  const query = {};
  query[primary] = out[primary];
  delete out[primary];
  if(query[primary] === undefined) throw errors.invalidParameterError('primary');
  try {
    yield model.updateByField(query, out);
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.tableRowDelete = function* (req, res) {
  logger.trace('tableRowDelete', req.$params);
  const { table, primary, id } = req.$params;
  const model = $.models[table];
  if(!model) throw errors.notFoundError('table');
  const query = {};
  query[primary] = id;
  try {
    yield model.deleteByField(query);
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

const exportExcel = function (connection, sql) {
  return new Promise((resolve, reject) => {
    const data = [];
    const query = connection.query(sql);
    query
      .on('error', (err) => { return reject(err); })
      .on('result', (row) => {
        data.push(_.values(row));
      })
      .on('end', () => {
        connection.release();
        resolve(data);
      });
  });
};

exports.exportExcel = function* (req, res) {
  logger.trace('exportExcel: ', req.$params);
  const { table } = req.$params;
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if(!model || !tableInfo) throw errors.notFoundError('table');
  const { connection, sql } = yield model.getAllData();
  const header = _.values(tableInfo.schema).map(it => it.comment || it.name);
  const data = yield exportExcel(connection, sql.toString());
  data.unshift(header);
  const buffer = xlsx.build([{ name: table, data }]);
  const filename = `${ table }-${ getDate() }`;
  res.type('xlsx');
  res.setHeader('Content-Description', 'File Transfer');
  res.setHeader('Content-Disposition', `attachment; filename=${ filename }.xlsx`);
  res.setHeader('Content-Length', buffer.length);
  res.end(buffer);
};

exports.exportCSV = (req, res) => {
  logger.trace('exportCSV: ', req.$params);
  const { table } = req.$params;
  const model = $.models[table];
  const tableInfo = $.tables[table];
  if(!model || !tableInfo) throw errors.notFoundError('table');
  const header = _.values(tableInfo.schema).map(it => `"${ it.comment || it.name }"`);
  const filename = `${ table }-${ getDate() }`;
  res.type('csv');
  res.setHeader('Content-Description', 'File Transfer');
  res.setHeader('Content-Disposition', `attachment; filename=${ filename }.csv`);
  res.write('\uFEFF');
  res.write(header.join(',') + '\n');
  model.getAllData().then(({ connection, sql }) => {
    const query = connection.query(sql.toString());
    query
      .on('error', (err) => { throw err; })
      .on('result', (row) => {
        res.write(_.values(row).map(it => utils.csvStringParser(it)).join(',') + '\n');
      })
      .on('end', () => {
        connection.release();
        res.end();
      });
    return;
  }).catch(err => res.error(err));
};
