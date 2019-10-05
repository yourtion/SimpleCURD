const apiService = require('../api');
const { errors } = require('../global');

exports.schemaCheaker = (input, schema, exclude = [], isUpdate = false) => {
  if(typeof input !== 'object') throw errors.internalError('Schema');
  const result = {};
  for(const name in schema) {
    let value = input[name];
    const options = schema[name];
    if(exclude.indexOf(name) !== -1) {
      result[name] = value;
      continue;
    }

    if(typeof value === 'undefined' || value === '' || value === null) {
      if(!isUpdate && options.nullable !== true && (options.default === null || options.default === '')){
        throw errors.missingParameterError(name);
      } else {
        // 其他情况忽略
        continue;
      }
    }

    const type = apiService.type.get(options.type);

    // 如果类型有 parser 则先执行
    if (type.parser) {
      // debug(`param ${ name } run parser`);
      value = type.parser(value);
    }

    // 如果类型有 checker 则检查
    if (!type.options.checker(value, options.params)) {
      // debug(`param ${ name } run checker`);
      let msg = `'${ name }' should be valid ${ options.type }`;
      if (options.params) {
        msg = `${ msg } with additional restrictions: ${ options._paramsJSON }`;
      }
      throw errors.invalidParameterError(msg);
    }
    result[name] = value;
  }
  return result;
};
