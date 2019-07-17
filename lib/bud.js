'use strict';

const path = require('path');
const pkgInfo = require('../package.json');

const egg = require('egg');
const originStartCluster = egg.startCluster;
const argv = require('yargs').argv;
const frameworkDir = path.dirname(__dirname);

module.exports = exports = egg;

class BudApplication extends egg.Application {
  constructor(options) {
    super(options);

    // 关键信息打日志
    process.nextTick(() => {
      const env = process.env;
      this.logger.info('[bud] bud version: %s, node version: %s, env: %s', pkgInfo.version, process.version, this.config.env);
      this.logger.info('[bud] EGG_SERVER_ENV: %s, NODE_ENV: %s', env.EGG_SERVER_ENV, env.NODE_ENV);
    });

    this.httpclient.on('request', info => {
      const args = info.args;
      // 开启 timing 探测，方便发现 http 请求问题
      args.timing = true;
    });

  }

  get [Symbol.for('egg#eggPath')]() {
    return frameworkDir;
  }
}

class BudAgent extends egg.Agent {
  get [Symbol.for('egg#eggPath')]() {
    return frameworkDir;
  }

}

exports.Application = BudApplication;
exports.Agent = BudAgent;

/**
 * 启动 egg app
 *
 * @param {Object} opts
 *  - {String} [framework] - 自定义 egg 插件集合层
 *  - {String} [baseDir] 代码路径, 默认为进程当前目录
 *  - {Object} [plugins] - 自定义插件配置，一般只用于单元测试
 *  - {Number} [workers] worker 数目, 默认按 cpu 数目启动
 *  - {Number} [port] 监听端口号, 默认 http:7001, https:8443
 *  - {Boolean} [https] 是否以 https 协议启动
 *  - {String} [key] ssl key 密钥
 *  - {String} [cert] ssl cert 公钥
 * @param {Function} callback 启动成功回调函数
 * @return {void}
 */
exports.startCluster = (opts, callback) => {
  const env = process.env;



  const defOptions = {
    framework: frameworkDir,
    port: env.PORT || 7001
  };

  if (env.EGG_SERVER_ENV) {
    env.EGG_SERVER_ENV = env.EGG_SERVER_ENV.toLowerCase();
  }

  const isLocal = !env.EGG_SERVER_ENV;

  if( isLocal ){
    defOptions.workers = 1;
  }

  if( argv.workers ){
    defOptions.workers = parseInt(argv.workers);
  }

  const options = Object.assign( defOptions, opts);

  // start app
  /* istanbul ignore next */
  originStartCluster(options, callback);
};
