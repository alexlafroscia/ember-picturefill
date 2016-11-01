/* eslint-env node */

'use strict';

const PICTUREFILL_ATTRIBUTE_WHITELIST = ['srcset', 'sizes'];

const log = require('debug')('ember-picturefill:htmlbars-plugin');

function isImgTag(node) {
  return node.type === 'ElementNode' && node.tag === 'img';
}

// Source: Flexi
// https://github.com/html-next/flexi/blob/8ebe1c1f5eea7857f0522e7e645fd3c40029f5ef/dsl/component-conversion.js#L22
function replaceReference(a, b) {
  Object.keys(a).forEach(function (key) {
    delete a[key];
  });
  Object.keys(b).forEach(function (key) {
    a[key] = b[key];
  });
}

function EmberPicturefill() {
  this.syntax = null;
  this.builders = null;
}

EmberPicturefill.prototype.constructor = EmberPicturefill;
EmberPicturefill.prototype.transform = function(ast) {
  log('Starting HTMLBars transform');

  this.builders = this.syntax.builders;
  var walker = new this.syntax.Walker();
  var plugin = this;

  walker.visit(ast, function(node) {
    if (!isImgTag(node)) {
      return;
    }

    // Only swap if the element includes an attribute in the whitelist
    if (!node.attributes.find((attr) => PICTUREFILL_ATTRIBUTE_WHITELIST.includes(attr.name))) {
      return;
    }

    const hash = plugin.buildHashFromAttributes(node.attributes);
    const loc = plugin.transformElementLoc(node.loc);
    const component = plugin.builders.mustache('pf-img', null, hash, null, loc);

    log('Upgrading `<img> to `{{pf-img}}`');
    replaceReference(node, component);
  });

  return ast;
};

EmberPicturefill.prototype.buildHashFromAttributes = function(attributes) {
  const pairs = attributes.map((attr) => {
    return this.transformAttrToHashPair(attr.name, attr.value);
  });

  return this.builders.hash(pairs);
};

EmberPicturefill.prototype.transformElementLoc = function(loc) {
  const startLine = loc.start.line;
  const startColumn = loc.start.column;
  const endLine = loc.end.line;
  const endColumn = loc.end.column + 5; // I _think_ 5 is the right difference. Not sure it matters that much.

  return this.builders.loc(startLine, startColumn, endLine, endColumn, loc.source);
};

EmberPicturefill.prototype.transformAttrToHashPair = function(key, value) {
  if (value.type === 'TextNode') {
    value = this.builders.string(value.chars);
  }

  return this.builders.pair(key, value);
};

module.exports = EmberPicturefill;
