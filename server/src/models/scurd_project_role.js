'use strict';

/**
* @file Scurd_project_role model
* @author Yourtion Guo <yourtion@gmail.com>
*/

const Base = require('./base');

class ScurdProjectRole extends Base {

  constructor(options) {
    const opt = Object.assign({
      fields: [ 'project_id', 'admin_id' ],
    }, options);
    super('Scurd_project_role', opt);
  }
}

module.exports = new ScurdProjectRole();
