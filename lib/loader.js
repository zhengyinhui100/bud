'use strict';

const fs = require('fs');
const path = require('path');
const extend = require('extend');
const yaml = require('js-yaml');

module.exports = Loader => {
  class BudLoader extends Loader {
    loadConfig() {
      super.loadConfig();

      // 加载额外配置, 用于特殊线上情况，比如，多个vpc部署
      const config = this.app.config;
      const logger = this.app.coreLogger;
      const extConfPath = config.extConfPath;

      /* istanbul ignore else */
      if (fs.existsSync(extConfPath)) {
        try {
          logger.info(`[bud] reading extend config: ${extConfPath}`);

          let extConf;
          const extName = path.extname(extConfPath);
          if (extName === '.yml' || extName === '.yaml') {
            extConf = yaml.safeLoad(fs.readFileSync(extConfPath, { encoding: 'utf-8' }));
          } else {
            extConf = require(extConfPath);
          }

          extend(true, config, extConf);
        } catch (err) { /* istanbul ignore next */
          logger.error(`[bud] read extend config got error: ${err.message}`);
        }
      } else {
        logger.warn(`[bud] extend config not found: ${extConfPath}`);
      }
    }
  }
  return BudLoader;
};
