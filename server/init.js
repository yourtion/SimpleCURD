'use strict';

/**
 * @file app 入口文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { co, log4js } = require('./global');
const { tableInfoService } = require('./services');
const { projectModel, tableModel } = require('./models');
const logger = log4js.getLogger();
const Base = require('./models/base');

Base.create = Base.prototype.create = function () {
  return new this(...arguments);
};

const genData = function* () {
  const res = { projects: {}, tables: {}, models: {}};
  const tables = yield tableModel.list({ is_offline: 0 }, [ 'id', 'name', 'project_id', 'is_update' ], 100);
  logger.trace('$.tables', JSON.stringify(tables));
  const projects = yield projectModel.list({}, [ 'id', 'name' ], 100);
  for(const project of projects) {
    res.projects[project.id] = { name: project.name, tables: []};
  }
  for(const t of tables) {
    const project = res.projects[t.project_id];
    if(project && project.tables) {
      project.tables.push(t);
    }
    const table = yield tableInfoService.genTableSchema(t.name);
    logger.trace(`gen table: ${ t.name } => ${ table.name }`);
    const fields = Object.keys(table.schema);
    const model = Base.create(t.name, { primaryKey: table.primary, fields });
    table.id = t.id;
    table.table_name = t.name;
    table.is_update = t.is_update;
    res.tables[t.name] = table;
    res.models[t.name] = model;
  }
  logger.trace('res.projects', res.projects);
  return res;
};

exports.reGenData = co.wrap(function* () {
  const start = new Date();
  const { projects, tables, models } = yield* genData();
  $.tables = tables || {};
  $.models = models || {};
  $.projects = projects || {};
  const time = new Date().getTime() - start.getTime();
  logger.info(`reGenData done: ${ time } ms`);
});
