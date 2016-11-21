/* eslint-env node */
'use strict';

var log = require('debug')('ember-picturefill:addon');
var path = require('path');
var mergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');
var ImgTagTransform = require('./lib/htmlbars-plugins/img-tag-transform');

var pictureFillDirectory = path.dirname(require.resolve('picturefill'));

module.exports = {
  name: 'ember-picturefill',

  treeForVendor(tree) {
    log(`Using package directory: ${pictureFillDirectory}`);

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
    app.import({
      development: `${vendor}/picturefill.js`,
      production: `${vendor}/picturefill.min.js`
    });
  },

  setupPreprocessorRegistry(type, registry) {
    if (type !== 'parent') {
      return;
    }

    const options = registry.app.options && registry.app.options.picturefill || {};
    log('Using options:', options);

    const imgTagTransform = options.imgTagTransform || false;

    if (imgTagTransform) {
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
  }
};
