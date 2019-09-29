/**
 * @file 管理员路由
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const adminController = require('../controllers/admin_controller');
const { adminSchema } = require('../schemas');
const { helper, TYPES } = require('../global');
const { middlewares } = require('../lib');

module.exports = (api) => {

  api.post('/admin/login')
    .group('Admin')
    .title('管理员登录')
    .body({
      username: helper.build(TYPES.String, '管理员用户名', true),
      password: helper.build(TYPES.String, '管理员密码', true),
      remember: helper.build(TYPES.Boolean, '记住我（对Web有效，生成cookie）'),
    })
    .register(adminController.login);

  api.post('/admin/change_password')
    .group('Admin')
    .title('更改管理员密码')
    .body({
      old_password: helper.build(TYPES.String, '原密码', true),
      password: helper.build(TYPES.String, '新密码', true),
    })
    .middlewares(middlewares.checkAdminRole())
    .register(adminController.changePassword);

  api.get('/admin/logout')
    .group('Admin')
    .title('管理员退出登录')
    .register(adminController.logout);

  api.get('/admins')
    .group('Admin')
    .title('管理员列表')
    .query(helper.PAGEING)
    .middlewares(
      middlewares.checkAdminRole('super'),
      middlewares.parsePages
    )
    .register(adminController.listAdmin);

  api.get('/admins/simple')
    .group('Admin')
    .title('管理员简化列表')
    .middlewares(
      middlewares.checkAdminRole('super')
    )
    .register(adminController.listAdminSimple);

  api.post('/admin/add')
    .group('Admin')
    .title('添加管理员')
    .body(adminSchema)
    .middlewares(middlewares.checkAdminRole('super'))
    .required([ 'name', 'password', 'role' ])
    .register(adminController.addAdmin);

  api.put('/admin/edit')
    .group('Admin')
    .title('修改管理员信息')
    .body(adminSchema)
    .required([ 'id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(adminController.editAdmin);

  api.delete('/admin/delete')
    .group('Admin')
    .title('删除管理员')
    .query({
      admin_id: adminSchema.id,
    })
    .required([ 'admin_id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(adminController.deleteAdmin);

};
