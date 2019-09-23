'use strict';

/**
 * @file 获取数据库 schema
 * @author Yourtion Guo <yourtion@gmail.com>
 */

const { mysql, TYPES } = require('../global');

const SKIP = [];

function tableInfo(name) {
  const exec1 = mysql.queryAsync('show full columns from `' + name + '`');
  const exec2 = mysql.queryAsync(`SELECT table_comment FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = '${ name }'`);
  const exec3 = mysql.queryAsync(`SHOW KEYS FROM \`${ name }\` WHERE Key_name = 'PRIMARY'`);
  return Promise.all([ exec1, exec2, exec3 ]).then(([ table, comment, primary ]) => {
    const primaryKey = primary && primary[0] && primary[0].Column_name;
    return { table, name: comment[0].table_comment, primary: primaryKey };
  });
}

function tableToScheam(tableName){
  return tableInfo(tableName).then(({ table, name, primary }) => {
    const schema = convertTable(table);
    return { name, schema, primary };
  });
}

function convertFiled(field) {
  if (field.indexOf('char') > -1) {
    return TYPES.String;
  }
  if (field.indexOf('int') > -1) {
    return TYPES.Integer;
  }
  if (field === 'timestamp') {
    return TYPES.Integer;
  }
  if(field.indexOf('enum') > -1){
    return TYPES.ENUM;
  }
  if (field === 'tinytext' || field === 'mediumtext') {
    return TYPES.String;
  }
  if (field === 'text') {
    return TYPES.String;
  }
  if(field === 'date' || field === 'datetime') {
    return TYPES.Date;
  }
  // eslint-disable-next-line no-console
  console.log(field);
  return TYPES.Any;
}

function enumToArray(e) {
  return e.replace('enum(', '').replace(')', '').replace(/'/g, '').split(',');
}

function convertTable(table) {
  const res = {};
  for(const row of table){
    if (SKIP.indexOf(row.Field) > -1) continue;
    res[row.Field] = {
      name: row.Field,
      type: convertFiled(row.Type),
      comment: row.Comment,
      nullable: row.Null === 'YES',
      default: row.Default,
    };
    if(res[row.Field].type === TYPES.ENUM) {
      res[row.Field].params = enumToArray(row.Type);
    }
  }
  return res;
}

exports.genTableSchema = tableToScheam;
