/**
 * @file 数据收集路由
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const collectController = require('../controllers/collect_controller');
const { middlewares } = require('../lib');
const { helper, TYPES } = require('../global');

module.exports = (api) => {

  api.get('/collect/:table')
    .group('Collect')
    .title('数据表信息')
    .params({
      table: helper.build(TYPES.String, '表名', true),
    })
    .before(middlewares.cros)
    .register(collectController.info);

  api.post('/collect/:table')
    .group('Collect')
    .title('创建收集数据')
    .params({
      table: helper.build(TYPES.String, '表名', true),
    })
    .body({
      data: helper.build(TYPES.Object, '收集的数据', true),
      update: helper.build(TYPES.Boolean, '插入冲突是否更新数据'),
      info: helper.build(TYPES.Boolean, '是否需要插入后详情'),
    })
    .before(middlewares.cros)
    .register(collectController.add);

  api.put('/collect/:table')
    .group('Collect')
    .title('修改收集数据')
    .params({
      table: helper.build(TYPES.String, '表名', true),
    })
    .body({
      field: helper.build(TYPES.String, '唯一键名', true),
      data: helper.build(TYPES.Object, '需要修改的对象', true),
    })
    .before(middlewares.cros)
    .register(collectController.edit);

  api.get('/collect/:table/list')
    .group('Collect')
    .title('获取收集数据列表')
    .params({
      table: helper.build(TYPES.String, '表名', true),
    })
    .query(helper.PAGEING)
    .before(middlewares.cros)
    .middlewares(middlewares.parsePages)
    .register(collectController.page);

  api.get('/collect/:table/item')
    .group('Collect')
    .title('获取收集数据条目')
    .params({
      table: helper.build(TYPES.String, '表名', true),
    })
    .query({
      field: helper.build(TYPES.String, '键名', true),
      data: helper.build(TYPES.String, '键值', true),
      rank: helper.build(TYPES.String, '排名字段', false),
      count: helper.build(TYPES.Boolean, '是否获取总数', false),
    })
    .before(middlewares.cros)
    .register(collectController.get);

  api.post('/collect/:table/incr')
    .group('Collect')
    .title('获取收集数据列自增')
    .params({
      table: helper.build(TYPES.String, '表名', true),
    })
    .body({
      primary: helper.build(TYPES.String, '主键值', true),
      primaryName: helper.build(TYPES.String, '主键名'),
      field: helper.build(TYPES.String, '增加键', true),
      count: helper.build(TYPES.Integer, '增加数量(默认1)', false, 1),
    })
    .before(middlewares.cros)
    .register(collectController.incr);

};
