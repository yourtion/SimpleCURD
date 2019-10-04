const app = require('../../src/app');
const apiService = require('../../src/api');

const util = require('util');
const debug = require('debug')('api:test');

let testData = {};

try {
  testData = require(process.TEST_DATA || './data');
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(err);
}

apiService.initTest(app);

function format(data) {
  debug(util.inspect(data, false, 5, true));
  if(data.success && data.result) {
    return [ null, data.result ];
  }
  return [ data.msg || data.message, null];
}

apiService.setFormatOutput(format);

apiService.shareTestData = {
  data: testData,
  login(agent, data) {
    return agent.post('/api/admin/login')
      .input({
        username: data.name,
        password: data.password,
      }).success();
  },
  truncate(table) {
    return 'TRUNCATE TABLE `' + table + '`';
  },
};

module.exports = apiService;
