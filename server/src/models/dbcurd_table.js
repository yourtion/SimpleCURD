'use strict';

/**
* @file dbcurd_table model
* @author Yourtion Guo <yourtion@gmail.com>
*/

const Base = require('./base');

class DbcurdTable extends Base {

  constructor(options) {
    const opt = Object.assign({
      fields: [ 'id', 'name', 'project_id', 'is_offline', 'is_update', 'note', 'created_at', 'updated_at' ],
    }, options);
    super('dbcurd_table', opt);
  }

}

module.exports = new DbcurdTable();
