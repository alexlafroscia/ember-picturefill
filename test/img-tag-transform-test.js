/* eslint-env node, mocha */

const expect = require('chai').expect;

const compile = require('../lib/utils').compile;
const ImgTagTransform = require('../lib/htmlbars-plugins/img-tag-transform');

describe('<img> tag transformation', function() {
  it('can transform an <img> into a {{pf-img}}', function() {
    return compile('img-tag-transform', [ImgTagTransform]).then((results) => {
      const after = results[0];
      const before = results[1];

      expect(before).to.deep.equal(after);
    });
  });
});
