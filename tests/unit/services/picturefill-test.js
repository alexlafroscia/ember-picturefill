import { expect } from 'chai';
import { describeModule, it } from 'ember-mocha';

describeModule(
  'service:picturefill',
  'PicturefillService',
  {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  },
  function() {
    it('has a reference to the global library', function() {
      const service = this.subject();
      expect(service.get('lib')).to.equal(window.picturefill);
    });
  }
);
