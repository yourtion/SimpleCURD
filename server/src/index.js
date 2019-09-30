'use strict';
/**
 * @file 入口文件
 * @author Yourtion Guo <yourtion@gmail.com>
 */
const http = require('http');
const { mysql, redis, log4js, config } = require('./global');
const app = require('./app');
const { reGenData } = require('./init');

const server = http.createServer(app);

const PORT = config.port || process.env.PORT || 4000;
const HOST = config.host || process.env.HOST || '127.0.0.1';

reGenData().then(() => {
  return server.listen(PORT, HOST, function () {
    pm2.initMetric([ 'tables', 'projects' ]);
    // eslint-disable-next-line no-console
    console.log(`API Server is listening on ${ HOST }:${ PORT }`);
    process.send && process.send('ready');
  });
// eslint-disable-next-line no-console
}).catch(console.error);

process.on('uncaughtException', function (err) {
  console.error(err);
});

process.on('unhandledRejection', function (err) {
  console.error(err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  // Clean up other resources like DB connections
  const cleanUp = (cb) => {
    mysql.end();
    redis.end();
    log4js.shutdown(cb);
  };

  server.close(() => {
    cleanUp(() => {
      process.exit();
    });
  });

  // Force close server after 5secs
  setTimeout((e) => {
    // eslint-disable-next-line no-console
    console.log('Forcing server close !!!', e);
    cleanUp();
    process.exit(1);
  }, 5000);
});
