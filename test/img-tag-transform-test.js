/* eslint-env node, mocha */

const expect = require('chai').expect;

const ImgTagTransform = require('../lib/htmlbars-plugins/img-tag-transform');
const compile = require('../lib/utils').compileWithPlugins([ImgTagTransform]);

describe('<img> tag transformation', function() {
  it('can transform an <img> into a {{pf-img}}', function() {
    const target = compile(`
      {{pf-img src="foo.png" srcset="foo.png 1x, foo@2x.png 2x" }}
    `);
    const source = compile(`
      <img src="foo.png" srcset="foo.png 1x, foo@2x.png 2x" />
    `);

    expect(source).to.deep.equal(target);
  });

  it('can pass attributes down to the <img> tag', function() {
    const target = compile(`
      {{pf-img alt="some-alt-text" src="foo.png" srcset="foo.png 1x, foo@2x.png 2x" }}
    `);
    const source = compile(`
      <img alt="some-alt-text" src="foo.png" srcset="foo.png 1x, foo@2x.png 2x" />
    `);

    expect(source).to.deep.equal(target);
  });

  it('can pass a class down to the <img> tag', function() {
    const target = compile(`
      {{pf-img class="some-class" src="foo.png" srcset="foo.png 1x, foo@2x.png 2x" }}
    `);
    const source = compile(`
      <img class="some-class" src="foo.png" srcset="foo.png 1x, foo@2x.png 2x" />
    `);

    expect(source).to.deep.equal(target);
  });

  it('does not transform an <img> without `srcset`', function() {
    const source = compile(`
      <img src="foo.png" />
    `);

    expect(source).to.be.empty;
  });
});
