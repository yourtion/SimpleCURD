'use strict';

/**
* @file Scurd_admin schema 管理员表
* @author Yourtion Guo <yourtion@gmail.com>
*/

module.exports = { id: { type: 'Integer', comment: '管理员ID' },
  name: { type: 'String', comment: '管理员用户名' },
  nickname: { type: 'String', comment: '管理员昵称' },
  password: { type: 'String', comment: '密码' },
  role:
 { type: 'ENUM',
   comment: '权限（super 超级管理员、editor 编辑、viewer 查看）',
   params: [ 'super', 'editor', 'viewer' ]},
  note: { type: 'NullableString', comment: '备注' }};
