'use strict';

/**
* @file Scurd_admin model
* @author Yourtion Guo <yourtion@gmail.com>
*/

const Base = require('./base');

class ScurdAdmin extends Base {

  constructor(options) {
    const opt = Object.assign({
      fields: [ 'id', 'name', 'nickname', 'password', 'role', 'note', 'created_at', 'updated_at' ],
    }, options);
    super('Scurd_admin', opt);
  }

  getByName(name) {
    return this.getOneByField({ name }, [ 'id', 'name', 'nickname', 'password', 'role', 'note' ]);
  }

}

module.exports = new ScurdAdmin();
