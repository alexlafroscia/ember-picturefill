import { expect } from 'chai';
import { describe } from 'mocha';
import { describeComponent, it } from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';
import td from 'testdouble';

describeComponent(
  'pf-img',
  'Integration: image tag transformation',
  {
    integration: true
  },
  function() {
    it('passes attributes through to the `img` tag', function() {
      this.render(hbs`<img alt='foo' class='bar' src='baz' srcset='bop' />`);

      const el = this.$('img')[0];
      expect(el.getAttribute('alt')).to.equal('foo');
      expect(el.getAttribute('src')).to.equal('baz');
      expect(el.getAttribute('srcset')).to.equal('bop');
    });

    describe('transforming only the necessary elements', function() {
      it('changes an <img> into a {{pf-img}} when `srcset` is present', function() {
        td.replace(window, 'picturefill');

        this.render(hbs`<img srcset='foo' />`);

        const imageElement = this.$('img')[0];
        expect(window.picturefill).to.be.calledWith({ elements: [imageElement] });
      });

      it('changes an <img> into a {{pf-img}} when `sizes` is present', function() {
        td.replace(window, 'picturefill');

        this.render(hbs`<img sizes='foo' />`);

        const imageElement = this.$('img')[0];
        expect(window.picturefill).to.be.calledWith({ elements: [imageElement] });
      });

      it('does not change an <img> when only `src` is present', function() {
        td.replace(window, 'picturefill');

        this.render(hbs`<img src='foo' />`);

        expect(window.picturefill).not.to.be.called;
      });
    });
  }
);
