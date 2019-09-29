/**
 * @file 项目管理路由
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const projectController = require('../controllers/project_controller');
const { projectSchema } = require('../schemas');
const { helper, TYPES } = require('../global');
const { middlewares } = require('../lib');

module.exports = (api) => {

  api.get('/projects')
    .group('Project')
    .title('项目列表')
    .query(helper.PAGEING)
    .middlewares(
      middlewares.parsePages,
      middlewares.checkAdminRole('super')
    )
    .register(projectController.listProject);

  api.post('/project')
    .group('Project')
    .title('创建项目')
    .body(_.omit(projectSchema, [ 'id' ]))
    .middlewares(middlewares.checkAdminRole('super'))
    .register(projectController.addProject);

  api.get('/project')
    .group('Project')
    .title('获取项目信息')
    .query({
      project_id: projectSchema.id,
    })
    .required([ 'project_id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(projectController.getProject);

  api.put('/project')
    .group('Project')
    .title('修改项目信息')
    .body(projectSchema)
    .required([ 'id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(projectController.updateProject);

  api.delete('/project')
    .group('Project')
    .title('删除项目')
    .query({
      project_id: projectSchema.id,
    })
    .required([ 'project_id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(projectController.deleteProject);

  api.post('/project/role')
    .group('Project')
    .title('更新项目授权')
    .body({
      project_id: projectSchema.id,
      deleted: helper.build(TYPES.Array, '删除授权管理员IDs', true),
      added: helper.build(TYPES.Array, '添加授权管理员IDs', true),
    })
    .required([ 'project_id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(projectController.updateProjectRole);

};
