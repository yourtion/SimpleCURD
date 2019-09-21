'use strict';
  
/**
* @file dbcurd_admin model
* @author Yourtion Guo <yourtion@gmail.com>
*/

const Base = require('./base');

class DbcurdAdmin extends Base {
  
  constructor(options) {
    const opt = Object.assign({
      fields: [ 'id', 'name', 'nickname', 'password', 'role', 'note', 'created_at', 'updated_at' ],
    }, options);
    super('dbcurd_admin', opt);
  }

  getByName(name) {
    return this.getOneByField({ name }, [ 'id', 'name', 'nickname', 'password', 'role', 'note' ]);
  }
  
}

module.exports = new DbcurdAdmin();
