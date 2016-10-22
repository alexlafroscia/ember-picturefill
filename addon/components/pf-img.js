import Ember from 'ember';

const {
  A,
  Component,
  get,
  inject: { service },
  set
} = Ember;

export default Component.extend({
  tagName: 'img',

  picturefill: service(),

  init() {
    const attributes = A(Object.keys(this.attrs)).without('class');
    set(this, 'attributeBindings', attributes);

    this._super(...arguments);
  },

  didInsertElement() {
    const el = get(this, 'element');
    get(this, 'picturefill').enqueue(el);
  }
});
