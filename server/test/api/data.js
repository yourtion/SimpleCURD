const TABLE_NAME = 'collect_test';
const TABLE_COMMENT = '测试数据表';

module.exports = {
  core: {
    name: 'yourtion',
    password: '123456',
  },
  admin: {},
  testTabele: {
    name: TABLE_NAME,
    comment: TABLE_COMMENT,
    create: `CREATE TABLE \`${ TABLE_NAME }\` (
      \`id\` int(11) unsigned NOT NULL AUTO_INCREMENT,
      \`article\` varchar(255) NOT NULL DEFAULT '',
      \`count\` tinyint(32) NOT NULL DEFAULT '0',
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`uni_article\` (\`article\`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='${ TABLE_COMMENT }';`,
    delete: `DROP TABLE IF EXISTS \`${ TABLE_NAME }\`;`,
    schema: {
      name: '测试数据表',
      schema: {
        id: {
          name: 'id',
          type: 'Integer',
          comment: '',
          nullable: false,
          default: null },
        article: {
          name: 'article',
          type: 'String',
          comment: '',
          nullable: false,
          default: '' },
        count: {
          name: 'count',
          type: 'Integer',
          comment: '',
          nullable: false,
          default: '0',
        },
      },
      primary: 'id',
      id: 0,
      table_name: TABLE_NAME,
    },
  },
};
