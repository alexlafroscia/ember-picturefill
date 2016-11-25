import Ember from 'ember';
import { expect } from 'chai';
import { setupTest } from 'ember-mocha';
import { beforeEach, describe, it } from 'mocha';
import td from 'testdouble';

const { run } = Ember;

describe('PicturefillService', function() {
  setupTest('service:picturefill', {
    // Specify the other units that are required for this test.
    // needs: ['service:foo']
  });

  it('has a reference to the global library', function() {
    const service = this.subject();
    expect(service.get('lib')).to.equal(window.picturefill);
  });

  it('can invoke the `picturefill` function', function() {
    td.replace(window, 'picturefill');

    const service = this.subject();
    service.reload('foo');

    expect(window.picturefill).to.be.calledWith('foo');
  });

  describe('queuing element evaluations', function() {
    beforeEach(function() {
      td.replace(window, 'picturefill');
      this.service = this.subject();
    });

    it('can evaluate a series of elements', function() {
      run(() => {
        this.service.enqueue('foo');
        this.service.enqueue('bar');
      });

      expect(window.picturefill).to.be.calledWith({ elements: [ 'foo', 'bar' ] });
      expect(td.explain(window.picturefill)).to.have.property('callCount', 1, '`picturefill` called once for both elements');
      expect(this.service.get('elements')).to.be.empty;
    });
  });
});
