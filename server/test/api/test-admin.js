'use strict';

const assert = require('chai').assert;

const apiService = require('./init');
const shareData = apiService.shareTestData.data;
const agent = apiService.test.session();

const { reGenData } = require('../../src/init');
const { adminModel } = require('../../src/models');
const { passwordLib } = require('../../src/lib');

const share = Object.assign({
  nickname: 'Yourtion',
  newUser: {
    name: new Date().toLocaleTimeString(),
    password: '123456789',
    role: 'editor',
    nickname: 'Yourtion',
  },
}, shareData.core, shareData.tools);

describe('API - Admin', () => {

  before(async function () {
    await reGenData();
    const password = await passwordLib.getPassword(share.password);
    const admin = await adminModel.getByName(share.name);
    if (!admin) {
      await adminModel.insert({ name: share.name, nickname: share.nickname, password, role: 'super' });
    } else {
      await adminModel.updateById(admin.id, { password });
    }
  });

  after(async function (){
    const password = await passwordLib.getPassword(share.password);
    await adminModel.updateByField({ name: share.name }, { password });
  });

  it('管理员退出登录 - 失败', async function () {
    const ret = await agent.get('/api/admin/logout')
      .takeExample('管理员退出登录 - 失败')
      .success();
    assert.equal(ret, '你还没有登录，先登录下再试试！');
  });

  it('管理员登录 - 成功', async function () {
    const ret = await agent.post('/api/admin/login')
      .input({
        username: share.name,
        password: share.password,
      })
      .takeExample('管理员登录 - 成功')
      .success();
    assert.equal(ret.msg, '登录成功');
    assert.equal(ret.user, share.name);
    assert.equal(ret.nickname, share.nickname);
  });

  it('管理员列表', async function () {
    const ret = await agent.get('/api/admins')
      .takeExample('管理员列表')
      .success();
    assert.isArray(ret.list);
    assert.isObject(ret.page_data);
    assert.deepEqual(Object.keys(ret.page_data), ['page', 'page_count', 'count']);
    assert.isNumber(ret.list[0].id);
    assert.isString(ret.list[0].name);
    assert.isAbove(ret.page_data.count, 0);
    share.adminCount = ret.page_data.count;
  });

  it('添加管理员', async function () {
    const ret = await agent.post('/api/admin/add')
      .input(share.newUser)
      .takeExample('添加管理员')
      .success();
    assert.equal(ret, '操作成功');
    const user = await adminModel.getOneByField({
      name: share.newUser.name,
    });
    assert.isNumber(user.id);
    share.newUserId = user.id;
    share.newUserPassword = user.password;
    assert.equal(share.newUser.name, user.name);
    assert.equal(share.newUser.nickname, user.nickname);
  });


  it('修改管理员信息', async function () {
    const newName = new Date().toString();
    const ret = await agent.put('/api/admin/edit')
      .input({
        id: share.newUserId,
        nickname: newName,
        password: newName,
      })
      .takeExample('修改管理员信息')
      .success();
    assert.equal(ret, '操作成功');
    const user = await adminModel.getById(share.newUserId);
    assert.isNumber(user.id);
    assert.equal(share.newUser.name, user.name);
    assert.equal(user.nickname, newName);
    assert.notEqual(user.password, share.newUserPassword);
    share.newUserNewPasword = newName;
  });


  it('删除管理员', async function () {
    const ret = await agent.delete('/api/admin/delete')
      .input({ admin_id: share.newUserId })
      .takeExample('删除管理员')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('管理员列表 - 简化', async function () {
    const ret = await agent.get('/api/admins/simple')
      .takeExample('管理员简化列表')
      .success();
    assert.isArray(ret);
    assert.isNumber(ret[0].id);
    assert.isString(ret[0].name);
    assert.equal(ret.length, share.adminCount);
  });

  it('更改管理员密码', async function () {
    const ret = await agent.post('/api/admin/change_password')
      .input({
        old_password: share.password,
        password: share.newUserNewPasword,
      })
      .takeExample('更改管理员密码')
      .success();
    assert.equal(ret, '操作成功');
  });


  it('管理员退出登录 - 成功', async function () {
    const ret = await agent.get('/api/admin/logout')
      .takeExample('管理员登录 - 成功')
      .success();
    assert.equal(ret, '退出成功');
  });

  it('管理员登录 - 失败', async function () {
    const ret = await agent.post('/api/admin/login')
      .input({
        username: share.name,
        password: share.password,
      })
      .takeExample('管理员登录 - 失败')
      .error();
    assert.equal(ret, '用户名或密码错误');
  });

});
