/* eslint-env node */
'use strict';

var path = require('path');
var Funnel = require('broccoli-funnel');
var map = require('broccoli-stew').map;
var readdirSync = require('fs').readdirSync;
var mergeTrees = require('broccoli-merge-trees');
var log = require('debug')('ember-picturefill:addon');
var UnwatchedDir = require('broccoli-source').UnwatchedDir;
var ImgTagTransform = require('./lib/htmlbars-plugins/img-tag-transform');

var pictureFillDirectory = path.dirname(require.resolve('picturefill'));
var pictureFillPluginDirectory = path.resolve(pictureFillDirectory, './plugins');
var pluginWhitelist = readdirSync(pictureFillPluginDirectory);

module.exports = {
  name: 'ember-picturefill',

  treeForVendor(defaultTree) {
    log(`Using package directory: ${pictureFillDirectory}`);
    log(`Using plugin directory: ${pictureFillPluginDirectory}`);

    var browserVendorLib = new Funnel(new UnwatchedDir(pictureFillDirectory));
    browserVendorLib = map(browserVendorLib, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    if (defaultTree) {
      return new mergeTrees([defaultTree, browserVendorLib]);
    } else {
      return browserVendorLib;
    }
  },

  included(app) {
    var vendor = this.treePaths.vendor;

    app.import({
      development: `${vendor}/picturefill.js`,
      production: `${vendor}/picturefill.min.js`
    });

    this.pictureFillOptions.plugins.forEach(function(pluginName) {
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

    if (this.pictureFillOptions.imgTagTransform) {
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
    if (this.options && this.options.picturefill) {
      this.pictureFillOptions = this.pictureFillOptions.picturefill;
    }

    if (!this.pictureFillOptions) {
      this.pictureFillOptions = app.options && app.options.picturefill || {};

      // Default `imgTagTransform` to `false`
      this.pictureFillOptions.imgTagTransform = this.pictureFillOptions.imgTagTransform || false;

      // Ensure that the `plugins` array exists, and that all are valid
      this.pictureFillOptions.plugins = (this.pictureFillOptions.plugins || [])
        .filter(function(pluginName) {
          return pluginWhitelist.indexOf(pluginName) > -1;
        });

      log('Using options:', this.pictureFillOptions);
    }
  }
};
