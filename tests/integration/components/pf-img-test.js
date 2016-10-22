import { expect } from 'chai';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import td from 'testdouble';

describeComponent(
  'pf-img',
  'Integration: PfImgComponent',
  {
    integration: true
  },
  function() {
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
  }
);
