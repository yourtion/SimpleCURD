/**
 * @file 模型路由
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const schemaController = require('../controllers/schema_controller');
const { helper, TYPES } = require('../global');
const { middlewares } = require('../lib');

module.exports = (api) => {

  api.get('/scheams')
    .group('Schema')
    .title('获取模型')
    .middlewares(middlewares.checkAdminRole())
    .register(schemaController.getSchemas);

  api.get('/schema/list')
    .group('Schema')
    .title('获取模型数据列表')
    .query(Object.assign({
      table: helper.build(TYPES.String, '表名', true),
      field: helper.build(TYPES.String, '查询字段'),
      operate: helper.build(TYPES.ENUM, '查询操作符', false, undefined, [ '=', '>', '>=', '<>', '<', '<=', 'like' ]),
      value: helper.build(TYPES.String, '查询条件'),
    }, helper.PAGEING))
    .middlewares(
      middlewares.parsePages,
      middlewares.checkAdminRole()
    )
    .register(schemaController.pageTable);

  api.post('/scheam/:table')
    .group('Schema')
    .title('添加表格数据')
    .param({
      table: helper.build(TYPES.String, '表名', true),
    })
    .body({
      data: helper.build(TYPES.Object, '需要创建的对象', true),
    })
    .middlewares(middlewares.checkAdminRole('editor'))
    .register(schemaController.tableRowAdd);

  api.put('/scheam/:table')
    .group('Schema')
    .title('修改表格数据')
    .param({
      table: helper.build(TYPES.String, '表名', true),
    })
    .body({
      primary: helper.build(TYPES.String, '主键名', true, 'id'),
      data: helper.build(TYPES.Object, '修改后的对象', true),
    })
    .middlewares(middlewares.checkAdminRole('editor'))
    .register(schemaController.tableRowEdit);

  api.delete('/scheam/:table')
    .group('Schema')
    .title('删除表格数据')
    .param({
      table: helper.build(TYPES.String, '表名', true),
    })
    .query({
      primary: helper.build(TYPES.String, '主键名', true),
      id: helper.build(TYPES.String, '主键值', true),
    })
    .middlewares(middlewares.checkAdminRole('editor'))
    .register(schemaController.tableRowDelete);

  api.get('/schema/export/excel')
    .group('Schema')
    .title('导出Excel')
    .query({
      table: helper.build(TYPES.String, '表名', true),
    })
    .middlewares(
      middlewares.checkAdminRole()
    )
    .register(schemaController.exportExcel);

  api.get('/schema/export/csv')
    .group('Schema')
    .title('导出CSV')
    .query({
      table: helper.build(TYPES.String, '表名', true),
    })
    .middlewares(
      middlewares.checkAdminRole()
    )
    .register(schemaController.exportCSV);

};
