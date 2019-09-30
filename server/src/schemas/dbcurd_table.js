'use strict';

/**
* @file dbcurd_table schema 数据表
* @author Yourtion Guo <yourtion@gmail.com>
*/

module.exports = { id: { type: 'Integer', comment: '数据表ID' },
  name: { type: 'String', comment: '表名' },
  project_id: { type: 'Integer', comment: '项目ID' },
  database_id: { type: 'NullableInteger', comment: '数据库' },
  is_offline: { type: 'Integer', comment: '是否下线' },
  note: { type: 'NullableString', comment: '备注' }};
