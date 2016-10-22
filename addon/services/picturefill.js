import Ember from 'ember';

const { Service, computed, get, run, set } = Ember;
const { scheduleOnce } = run;

export default Service.extend({

  lib: computed(function() {
    return window.picturefill;
  }),

  init() {
    this._super(...arguments);

    this._setupElementArray();
  },

  reload() {
    const lib = get(this, 'lib');

    if (lib) {
      lib(...arguments);
    }
  },

  enqueue(element) {
    get(this, 'elements').push(element);

    scheduleOnce('afterRender', this, '_flush');
  },

  _flush() {
    const elements = get(this, 'elements');

    this.reload({ elements });
    this._setupElementArray();
  },

  _setupElementArray() {
    set(this, 'elements', []);
  }
});
