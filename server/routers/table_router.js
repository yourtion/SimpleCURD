/**
 * @file 表格管理路由
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const tableController = require('../controllers/table_controller');
const { tableSchema } = require('../schemas');
const { helper } = require('../global');
const { middlewares } = require('../lib');

module.exports = (api) => {

  api.get('/tables')
    .group('Table')
    .title('表格列表')
    .query(helper.PAGEING)
    .middlewares(
      middlewares.parsePages,
      middlewares.checkAdminRole('super')
    )
    .register(tableController.listTable);

  api.post('/table')
    .group('Table')
    .title('添加表格数据')
    .body(_.omit(tableSchema, [ 'id' ]))
    .middlewares(middlewares.checkAdminRole('super'))
    .register(tableController.addTable);

  api.get('/table')
    .group('Table')
    .title('获取表格信息')
    .query({
      table_id: tableSchema.id,
    })
    .middlewares(middlewares.checkAdminRole('super'))
    .register(tableController.getTable);

  api.put('/table')
    .group('Table')
    .title('修改表格信息')
    .body(tableSchema)
    .required([ 'id' ])
    .middlewares(middlewares.checkAdminRole('super'))
    .register(tableController.updateTable);

  api.delete('/table')
    .group('Table')
    .title('删除表格')
    .query({
      table_id: tableSchema.id,
    })
    .middlewares(middlewares.checkAdminRole('super'))
    .register(tableController.deleteTable);

};
