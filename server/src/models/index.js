'use strict';

/**
 * @file models export
 * @author Yourtion Guo <yourtion@gmail.com>
 */

module.exports = {
  adminModel: require('./dbcurd_admin'),
  tableModel: require('./dbcurd_table'),
  projectModel: require('./dbcurd_project'),
  projectRoleModel: require('./dbcurd_project_role'),
};
