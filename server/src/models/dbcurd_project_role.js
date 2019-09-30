'use strict';

/**
* @file dbcurd_project_role model
* @author Yourtion Guo <yourtion@gmail.com>
*/

const Base = require('./base');

class DbcurdProjectRole extends Base {

  constructor(options) {
    const opt = Object.assign({
      fields: [ 'project_id', 'admin_id' ],
    }, options);
    super('dbcurd_project_role', opt);
  }
}

module.exports = new DbcurdProjectRole();
