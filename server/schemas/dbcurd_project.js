'use strict';

/**
* @file dbcurd_project schema 项目表
* @author Yourtion Guo <yourtion@gmail.com>
*/

module.exports = { id: { type: 'Integer', comment: '项目ID' },
  name: { type: 'String', comment: '项目名称' },
  note: { type: 'NullableString', comment: '项目备注' }};
