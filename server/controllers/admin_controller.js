/**
 * @file 管理员操作
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const { log4js, config, errors } = require('../global');
const { passwordLib } = require('../lib');
const { adminModel, projectModel, projectRoleModel } = require('../models');
const logger = log4js.getLogger();

exports.login = function* (req, res) {
  const { username, password, remember } = req.$params;
  const admin = yield adminModel.getByName(username);
  logger.trace('admin_res: ', admin);
  if (!admin) return res.error('用户名或密码错误');
  const passwordVerified = yield passwordLib.comparePassword(password, admin.password);
  if(passwordVerified) {
    const query = {};
    let allProject;
    if(admin.role !== 'super') {
      query.admin_id = admin.id;
    } else {
      allProject = yield projectModel.list({}, [ 'id' ], 100);
    }
    const projectRole = yield projectRoleModel.list(query, [ 'project_id' ], 100);
    const projects = new Set(projectRole.map(pr => pr.project_id));
    if(allProject) {
      allProject.forEach(p => projects.add(p.id));
    }
    logger.trace(projectRole, projects);
    admin.projects = projects;
    if (remember) {
      req.session.cookie.maxAge = config.cookieMaxAge;
    } else {
      req.session.cookie.maxAge = 3600000 * 12;
    }
    req.session.user = admin;
    const projectsInfo = projectModel.getProjectInfo(projects);
    return res.success({
      msg: '登录成功',
      nickname: admin.nickname,
      user: admin.name,
      role: admin.role,
      projects: projectsInfo,
    });
  }
  res.error('用户名或密码错误');
};

exports.logout = (req, res) => {
  if(!req.session.user) return res.success('你还没有登录，先登录下再试试！');
  delete req.session.user;
  return res.success('退出成功');
};

exports.listAdmin = function* (req, res){
  logger.trace('listAdmin');
  const result = yield adminModel.page({},
    _.without(adminModel.fields, 'password'),
    req.$pages.limit,
    req.$pages.offset,
    req.$pages.order,
    req.$pages.asc
  );
  res.page(result);
};

exports.listAdminSimple = function* (req, res){
  logger.trace('listAdminSimple');
  const result = yield adminModel.list({}, [ 'id', 'name' ]);
  res.success(result);
};

exports.addAdmin = function* (req, res){
  const input = _.pick(req.$params, [ 'name', 'nickname', 'password', 'role', 'note' ]);
  logger.trace('addAdmin:', input, req.$admin.name);
  if (input.password.length < 6) return res.error('密码长度不足（最少6位）');
  input.password = yield passwordLib.getPassword(input.password);
  yield adminModel.insert(input);
  return res.success(config.message.success);
};

exports.editAdmin = function* (req, res){
  const admin_id = req.$params.id;
  const input = _.pick(req.$params, adminModel.fields);
  _.remove(input, [ 'id', 'created_at', 'updated_at' ]);
  logger.trace('editAdmin:', input, req.$admin.name);
  const admin = yield adminModel.getById(admin_id);
  if(!admin) throw errors.notFoundError('admin');
  if(input.password) {
    if (input.password.length < 6) return res.error('密码长度不足（最少6位）');
    input.password = yield passwordLib.getPassword(input.password);
  }
  
  yield adminModel.updateById(admin_id, input);
  return res.success(config.message.success);
};

exports.deleteAdmin = function* (req, res){
  const { admin_id } = req.$params;
  logger.trace('deleteAdmin:', admin_id, req.$admin.name);
  if(!admin_id === req.$admin.id) throw errors.invalidParameterError('不能删除自己');
  yield adminModel.deleteById(admin_id);
  return res.success(config.message.success);
};

module.exports.changePassword = function* (req, res) {
  const { password, old_password } = req.$params;
  logger.trace('updateInfo:', { password, old_password }, req.$admin.name);
  if (password.length < 6) return res.error('密码长度不足（最少6位）');
  const userInfo = yield adminModel.getById(req.$admin.id);
  if (!userInfo) throw errors.notFoundError('user');
  const passwordVerified = yield passwordLib.comparePassword(old_password, userInfo.password);
  if (!passwordVerified) return res.error('密码错误');
  const enPaass = yield passwordLib.getPassword(password);
  yield adminModel.updateById(req.$admin.id, { password: enPaass });
  return res.success(config.message.success);
};
