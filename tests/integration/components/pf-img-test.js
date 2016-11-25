import { expect } from 'chai';
import { it, describe } from 'mocha';
import { setupComponentTest } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import td from 'testdouble';

describe('Integration: PfImgComponent', function() {
  setupComponentTest('pf-img', {
    integration: true
  });

  it('passes attributes through to the `img` tag', function() {
    this.render(hbs`{{pf-img alt='foo' class='bar' src='baz' srcset='bop'}}`);

    const el = this.$('img')[0];
    expect(el.getAttribute('alt')).to.equal('foo');
    expect(el.getAttribute('src')).to.equal('baz');
    expect(el.getAttribute('srcset')).to.equal('bop');
  });

  it('registers the DOM element with the service', function() {
    td.replace(window, 'picturefill');

    this.render(hbs`{{pf-img}}`);

    const imageElement = this.$('img')[0];
    expect(window.picturefill).to.be.calledWith({ elements: [imageElement] });
  });
});
