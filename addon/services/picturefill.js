import Ember from 'ember';

const { Service, computed } = Ember;

export default Service.extend({
  lib: computed(function() {
    return window.picturefill;
  })
});
