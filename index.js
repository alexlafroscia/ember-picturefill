/* eslint-env node */
'use strict';

var path = require('path');
var readdirSync = require('fs').readdirSync;

var log = require('debug')('ember-picturefill:addon');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var ImgTagTransform = require('./lib/htmlbars-plugins/img-tag-transform');

var pictureFillDirectory = path.dirname(require.resolve('picturefill'));
var pictureFillPluginDirectory = path.resolve(pictureFillDirectory, './plugins');
var pluginWhitelist = readdirSync(pictureFillPluginDirectory);

module.exports = {
  name: 'ember-picturefill',

  treeForVendor(tree) {
    log(`Using package directory: ${pictureFillDirectory}`);
    log(`Using plugin directory: ${pictureFillPluginDirectory}`);

    var trees = [];

    if (tree) {
      trees.push(tree);
    }

    var pictureFillTree = new Funnel(pictureFillDirectory);
    trees.push(pictureFillTree);

    return mergeTrees(trees);
  },

  included(app) {
    var vendor = this.treePaths.vendor;

    // Don't import any packages in the Fastboot build
    // `picturefill` requires the `window.navigator` object
    if (process.env.EMBER_CLI_FASTBOOT) {
      return;
    }

    app.import({
      development: `${vendor}/picturefill.js`,
      production: `${vendor}/picturefill.min.js`
    });

    this.options.plugins.forEach(function(pluginName) {
      app.import({
        development: `${vendor}/plugins/${pluginName}/pf.${pluginName}.js`,
        production: `${vendor}/plugins/${pluginName}/pf.${pluginName}.min.js`
      });
    });
  },

  setupPreprocessorRegistry(type, registry) {
    if (type !== 'parent') {
      return;
    }

    this._setupOptions(registry.app);

    if (this.options.imgTagTransform) {
      log('Registering `img` tag transform');
      registry.add('htmlbars-ast-plugin', {
        name: 'ember-picturefill:img-tag-transform',
        plugin: ImgTagTransform,
        baseDir: function() {
          return __dirname;
        }
      });
    } else {
      log('`img` tag transform disabled');
    }
  },

  _setupOptions(app) {
    if (!this.options) {
      this.options = app.options && app.options.picturefill || {};

      // Default `imgTagTransform` to `false`
      this.options.imgTagTransform = this.options.imgTagTransform || false;

      // Ensure that the `plugins` array exists, and that all are valid
      this.options.plugins = (this.options.plugins || [])
        .filter(function(pluginName) {
          return pluginWhitelist.indexOf(pluginName) > -1;
        });

      log('Using options:', this.options);
    }
  }
};
