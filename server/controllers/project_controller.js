/**
 * @file 项目操作
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { log4js, errors, config } = require('../global');
const { projectModel, projectRoleModel } = require('../models');
const { reGenData } = require('../init');
const logger = log4js.getLogger();

exports.listProject = function* (req, res) {
  logger.trace('listProject');
  const [ list, count ] = yield projectModel.userPage({},
    projectModel.fields,
    req.$pages.limit,
    req.$pages.offset,
    req.$pages.order,
    req.$pages.asc
  );
  res.page({ list, count: count[0].c });
};

exports.addProject = function* (req, res) {
  logger.trace('addProject', req.$params);
  const input = _.pick(req.$params, projectModel.fields);
  try {
    yield projectModel.insert(input);
    yield reGenData();
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.getProject = function* (req, res) {
  logger.trace('getProject', req.$params);
  const { project_id } = req.$params;
  const result = yield projectModel.getById(project_id);
  if(!result) throw errors.notFoundError('project');
  res.success(result);
};

exports.updateProject = function* (req, res) {
  logger.trace('updateProject', req.$params);
  const input = _.pick(req.$params, projectModel.fields);
  const { id } = input;
  delete input.id;
  try {
    yield projectModel.updateById(id, input);
    yield reGenData();
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.deleteProject = function* (req, res) {
  logger.trace('deleteProject', req.$params);
  const { project_id } = req.$params;
  try {
    yield projectModel.deleteById(project_id);
    yield reGenData();
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};

exports.updateProjectRole = function* (req, res) {
  logger.trace('updateProjectRole', req.$params);
  const { project_id, deleted, added } = req.$params;
  try {
    for(const id of deleted) {
      yield projectRoleModel.deleteByField({ project_id, admin_id: id });
    }
    for(const id of added) {
      yield projectRoleModel.insert({ project_id, admin_id: id });
    }
    res.success(config.message.success);
  } catch (error) {
    res.error(error);
  }
};
