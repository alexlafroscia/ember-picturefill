/* eslint-env node */

const path = require('path');
const semver = require('semver');

const bowerDirectory = path.resolve(__dirname, '../bower_components');
let templateCompiler;

try {
  templateCompiler = require(`${bowerDirectory}/ember/ember-template-compiler.js`);
} catch (e) {
  templateCompiler = require('ember-source/dist/ember-template-compiler.js');
}

const hasGlimmer2 = semver.gte(templateCompiler._Ember.VERSION, '2.9.0');

module.exports.compileWithPlugins = function compileWithPlugins(plugins) {
  plugins.forEach(function(plugin) {
    templateCompiler.registerPlugin('ast', plugin);
  });

  return function(template) {
    if (!hasGlimmer2) {
      const functionString = templateCompiler.precompile(template).split('\n').slice(1, -1).join('');
      const fn = new Function(functionString);

      return (fn()['statements'][0] || []);
    }

    return templateCompiler.precompile(template);
  }
}
