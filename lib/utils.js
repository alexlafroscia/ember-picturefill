/* eslint-env node */

var path = require('path');
var fs = require('fs');

var Builder = require('broccoli').Builder;
var HtmlbarsCompiler = require('ember-cli-htmlbars');

var bowerDirectory = path.resolve(__dirname, '../bower_components');

module.exports.compile = function compile(fixturePath, plugins) {
  const fullPath = path.resolve(__dirname, '../test/fixtures', fixturePath);
  const transform = new HtmlbarsCompiler(fullPath, {
    isHTMLBars: true,
    templateCompiler: require(`${bowerDirectory}/ember/ember-template-compiler.js`),
    plugins: {
      ast: plugins
    }
  });

  return new Builder(transform).build()
    .then((results) => {
      const directory = results.directory;

      return new Promise((resolve) => {
        fs.readdir(directory, (err, files) => {
          resolve(files.map((fileName) => `${directory}/${fileName}`))
        })
      });
    })
    .then((filePaths) => {
      return Promise.all(filePaths.map((filePath) => {
        return new Promise((resolve, reject) => {
          fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) reject(err);
            resolve(data);
          });
        });
      }));
    })
    .then((fileContents) => {
      return fileContents.map((file) => {
        const lines = file.split('\n');
        return lines.filter((line) => line.indexOf('inline') > -1)[0];
      });
    })
    .then((templateLines) => {
      return templateLines.map((templateLine) => {
        try {
          return JSON.parse(templateLine).slice(0, 4);
        } catch(error) {
          return [];
        }
      });
    });
}
