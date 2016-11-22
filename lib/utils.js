/* eslint-env node */

const path = require('path');

const bowerDirectory = path.resolve(__dirname, '../bower_components');

module.exports.compileWithPlugins = function compileWithPlugins(plugins) {
  const templateCompiler = require(`${bowerDirectory}/ember/ember-template-compiler.js`);
  plugins.forEach(function(plugin) {
    templateCompiler.registerPlugin('ast', plugin);
  });

  return function(template) {
    const functionString = templateCompiler.precompile(template).split('\n').slice(1, -1).join('');
    const fn = new Function(functionString);

    return (fn()['statements'][0] || []);
  }
}
