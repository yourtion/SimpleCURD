'use strict';

const assert = require('chai').assert;

const apiService = require('./init');
const shareData = apiService.shareTestData.data;
const agent = apiService.test.session();
const agentCollect = apiService.test.session();

const { reGenData } = require('../../src/init');
const { adminModel, projectModel, projectRoleModel, tableModel } = require('../../src/models');

const tableInfo = shareData.testTabele;

const share = Object.assign({
  pName: 'P' + new Date().toString(),
  tName: tableInfo.name,
  sPrimary: 'id',
  sIncKey: 'count',
  sData: {
    article: 'A' + new Date().toString(),
  },
  cData: {
    article: 'C' + new Date().toString(),
  },
}, shareData.core, shareData.tools);

const truncate = apiService.shareTestData.truncate;


describe('API - Project + Table + Schema', () => {

  before(async () => {
    await adminModel.query(truncate(tableModel.table));
    await adminModel.query(tableInfo.delete);
    await adminModel.query(tableInfo.create);
    await reGenData();
    await apiService.shareTestData.login(agent, share);
    const admin = await adminModel.getByName(share.name);
    share.uId = admin.id;
  });

  it('Project - 创建项目', async () => {
    const ret = await agent.post('/api/project')
      .input({ name: share.pName })
      .takeExample('创建项目')
      .success();
    assert.equal(ret, '操作成功');
    const project = await projectModel.getOneByField({
      name: share.pName,
    });
    assert.isNumber(project.id);
    share.newProjectId = project.id;
    assert.equal(share.pName, project.name);
  });

  it('Project - 修改项目信息', async () => {
    share.pNote = new Date().toJSON();
    const ret = await agent.put('/api/project')
      .input({
        id: share.newProjectId,
        note: share.pNote })
      .takeExample('修改项目信息')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Project - 获取项目信息', async () => {
    const ret = await agent.get('/api/project')
      .input({
        project_id: share.newProjectId,
      })
      .takeExample('获取项目信息')
      .success();
    assert.equal(ret.name, share.pName);
    assert.equal(share.pNote, ret.note);
  });

  it('Project - 项目列表', async () => {
    const ret = await agent.get('/api/projects')
      .takeExample('项目列表')
      .success();
    assert.isArray(ret.list);
    assert.isObject(ret.page_data);
    assert.isAbove(ret.page_data.count, 0);
  });

  it('Project - 更新项目授权', async () => {
    const ret = await agent.post('/api/project/role')
      .input({
        project_id: share.newProjectId,
        deleted: [1],
        added: [share.uId],
      })
      .takeExample('更新项目授权')
      .success();
    assert.equal(ret, '操作成功');
    const role = await projectRoleModel.getOneByField({
      project_id: share.newProjectId,
      admin_id: share.uId,
    });
    assert.isObject(role);

    // 删除项目管理，否则存在外键关联
    await agent.post('/api/project/role')
      .input({
        project_id: share.newProjectId,
        deleted: [share.uId],
        added: [],
      }).success();
  });

  it('Table - 添加表格数据', async () => {
    const ret = await agent.post('/api/table')
      .input({
        name: share.tName,
        project_id: share.newProjectId,
      })
      .takeExample('添加表格数据')
      .success();
    assert.equal(ret, '操作成功');
    const table = await tableModel.getOneByField({
      name: share.tName,
    });
    assert.isNumber(table.id);
    share.newTableId = table.id;
    assert.equal(share.tName, table.name);
  });

  it('Table - 表格列表', async () => {
    const ret = await agent.get('/api/tables')
      .takeExample('表格列表')
      .success();
    assert.isArray(ret.list);
    assert.isObject(ret.page_data);
    assert.isAbove(ret.page_data.count, 0);
  });

  it('Table - 修改表格信息', async () => {
    share.tNote = new Date().toJSON();
    const ret = await agent.put('/api/table')
      .input({
        id: share.newTableId,
        note: share.tNote,
      })
      .takeExample('修改表格信息')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Table - 获取表格信息', async () => {
    const ret = await agent.get('/api/table')
      .input({ table_id: share.newTableId })
      .takeExample('获取表格信息')
      .success();
    assert.equal(ret.name, share.tName);
    assert.equal(ret.note, share.tNote);
  });

  it('Schema - 获取模型', async () => {
    const ret = await agent.get('/api/scheams')
      .input({})
      .takeExample('获取模型')
      .success();
    assert.isAbove(ret.length, 0);
    assert.isArray(ret);
    assert.isObject(ret[0]);
    assert.isArray(ret[0].tables);
  });

  it('Schema - 添加表格数据', async () => {
    const ret = await agent.post('/api/scheam/' + share.tName)
      .input({ data: share.sData })
      .takeExample('添加表格数据')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Schema - 获取模型数据列表', async () => {
    const ret = await agent.get('/api/schema/list')
      .input({
        table: share.tName,
      })
      .takeExample('获取模型数据列表')
      .success();
    assert.isArray(ret.list);
    assert.isObject(ret.page_data);
    assert.isAbove(ret.page_data.count, 0);
    assert.isNumber(ret.list[0].id);
    share.newItemId = ret.list[0].id;
  });

  it('Schema - 修改表格数据', async () => {
    const ret = await agent.put('/api/scheam/' + share.tName)
      .input({
        primary: share.sPrimary,
        data: Object.assign({ count: 10, id: share.newItemId }, share.sData),
      })
      .takeExample('修改表格数据')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Schema - 导出Excel', async () => {
    const { header } = await agent.get('/api/schema/export/excel')
      .input({ table: share.tName })
      .takeExample('导出Excel')
      .raw();
    assert.equal('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', header['content-type']);
  });

  it('Schema - 导出CSV', async () => {
    const { header } = await agent.get('/api/schema/export/csv')
      .input({ table: share.tName })
      .takeExample('导出CSV')
      .raw();
    assert.equal('text/csv; charset=utf-8', header['content-type']);
  });

  it('Collect - 数据表信息', async () => {
    const ret = await agentCollect.get(`/api/collect/${ share.tName }`)
      .takeExample('数据表信息')
      .success();
    const schema = Object.assign({ is_update: 1 }, tableInfo.schema, { id: share.newTableId });
    delete schema.name;
    assert.deepEqual(schema, ret);
  });

  it('Collect - 创建收集数据', async () => {
    const ret = await agentCollect.post(`/api/collect/${ share.tName }`)
      .input({ data: share.cData })
      .takeExample('创建收集数据')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Collect - 创建收集数据 - Update', async () => {
    const ret = await agentCollect.post(`/api/collect/${ share.tName }`)
      .input({ data: Object.assign({ count: 30, id: share.newItemId }, share.sData), update: true })
      .takeExample('创建收集数据')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Collect - 获取收集数据列表', async () => {
    const ret = await agentCollect.get(`/api/collect/${ share.tName }/list`)
      .takeExample('获取收集数据列表')
      .success();
    assert.isArray(ret.list);
    assert.isObject(ret.page_data);
    assert.equal(ret.page_data.count, 2);
    assert.isNumber(ret.list[1].id);
    share.newCollectId = ret.list[1].id;
  });

  it('Collect - 修改收集数据', async () => {
    const ret = await agentCollect.put(`/api/collect/${ share.tName }`)
      .input({
        field: share.sPrimary,
        data: { count: 20, id: share.newCollectId },
      })
      .takeExample('修改收集数据')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Collect - 获取收集数据列自增', async () => {
    const ret = await agentCollect.post(`/api/collect/${ share.tName }/incr`)
      .input({
        primary: share.newCollectId + '',
        field: share.sIncKey,
        count: 2,
      })
      .takeExample('获取收集数据列自增')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Collect - 获取收集数据条目', async () => {
    const ret = await agentCollect.get(`/api/collect/${ share.tName }/item`)
      .input({
        field: share.sPrimary,
        data: share.newCollectId,
        rank: true,
        count: true,
      })
      .takeExample('获取收集数据条目')
      .success();
    assert.equal(share.cData.article, ret.article);
    assert.equal(2, ret.count);
    assert.equal(1, ret.rank);
  });

  it('Schema - 删除表格数据', async () => {
    const ret = await agent.delete('/api/scheam/' + share.tName)
      .input({
        primary: share.sPrimary,
        id: share.newItemId,
      })
      .takeExample('删除表格数据')
      .success();
    assert.equal(ret, '操作成功');
  });

  it('Table - 删除表格', async () => {
    const ret = await agent.delete('/api/table')
      .input({ table_id: share.newTableId })
      .takeExample('删除表格')
      .success();
    assert.equal(ret, '操作成功');

    const ret2 = await agent.get('/api/table')
      .input({
        table_id: share.newTableId,
      })
      .error();
    assert.equal(ret2, '找不到内容 : Table');
  });

  it('Project - 删除项目', async () => {
    const ret = await agent.delete('/api/project')
      .input({ project_id: share.newProjectId })
      .takeExample('删除项目')
      .success();
    assert.equal(ret, '操作成功');
    const ret2 = await agent.get('/api/project')
      .input({
        project_id: share.newProjectId,
      })
      .error();
    assert.equal(ret2, '找不到内容 : project');
  });

});
