'use strict';

/**
* @file Scurd_table model
* @author Yourtion Guo <yourtion@gmail.com>
*/

const Base = require('./base');

class ScurdTable extends Base {

  constructor(options) {
    const opt = Object.assign({
      fields: [ 'id', 'name', 'project_id', 'is_offline', 'is_update', 'note', 'created_at', 'updated_at' ],
    }, options);
    super('Scurd_table', opt);
  }

}

module.exports = new ScurdTable();
