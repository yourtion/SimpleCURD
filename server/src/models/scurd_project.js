'use strict';

/**
* @file Scurd_project model
* @author Yourtion Guo <yourtion@gmail.com>
*/
const { squel } = require('../global');
const Base = require('./base');

class ScurdProject extends Base {

  constructor(options) {
    const opt = Object.assign({
      fields: [ 'id', 'name', 'note', 'created_at', 'updated_at' ],
    }, options);
    super('Scurd_project', opt);
  }

  getProjectInfo(projects) {
    const projectsInfo = [];
    for(const pid of projects) {
      const project = $.projects[pid];
      const pInfo = { name: project.name, id: pid, tables: []};
      for(const table of project.tables) {
        pInfo.tables.push($.tables[table.name]);
      }
      projectsInfo.push(pInfo);
    }
    return projectsInfo;
  }

  userPage(conditions = {}, fields = this.fields, limit = 999, offset = 0, order = this.order, asc = true) {
    const selectList = squel.select().from(this.table, 'p').offset(offset).limit(limit);
    fields.forEach(f => selectList.field('p.' + f, f));
    selectList.field('GROUP_CONCAT(a.name )', 'admin');
    selectList.left_join('Scurd_project_role', 'r', 'p.id = r.project_id');
    selectList.left_join('Scurd_admin', 'a', 'a.id = r.admin_id');
    selectList.group('p.id');
    const selectCount = this._count(conditions, fields, limit, offset, order, asc);
    const $list = this.query(selectList.toString());
    const $count = this.query(selectCount.toString());
    return Promise.all([ $list, $count ]);
  }
}

module.exports = new ScurdProject();
