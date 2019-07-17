'use strict';

const path = require('path');
const pkgInfo = require('../package.json');

module.exports = appInfo => {
  const config = {};

  /**
   * 框架信息
   * @member Config#framework
   * @property {String} name 框架名称
   * @property {String} version 框架版本
   * @property {Object} pkg 框架信息
   */
  config.framework = {
    name: 'bud',
    version: pkgInfo.version,
    pkg: pkgInfo,
  };

  // 默认关闭 alinode
  config.alinode = {
    enable: false,
  };

  return config;
};
