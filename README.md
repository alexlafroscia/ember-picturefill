# `ember-picturefill`

[![Ember Versions](https://embadge.io/v1/badge.svg?start=2.4.0)](#compatibility-note)

A small Ember library to better integrate with [Picturefill][picturefill]

## Why?

Picturefill automatically runs when the page loads, looking for image tags that have the attributes that it polyfills.  However, what happens if you soft-transition to a page, or have an image that is only shown under some circumstances?  Chances are, Picturefill will be unable to find the image to polyfill the behavior correctly.  This addon fixes the problem by providing a tiny wrapper around the `img` tag that triggers the Picturefill polyfill after the image enters the DOM, so that the polyfill is always applied.

## What does it do?

- Provides a component that can be used in place of `<img>` that ensures that Picturefill knows when the element is made visible
- Provides a service that can be used to manually check the page for new `<img>` elements
- Provides an optional `HTMLBars` transformation that can change `<img>` tags into the wrapper component automatically, if the `srcset` or `sizes` attributes are present

## Installation

Standard Ember addon stuff:

```bash
ember install ember-picturefill
```

## Usage

### Using the wrapper component directly

```hbs
{{pf-img srcset="examples/images/image-384.jpg 1x, examples/images/image-768.jpg 2x"}}
```

### Using the `HTMLBars` transformation (enabled by default)

Turns this:

```hbs
<img srcset="examples/images/image-384.jpg 1x, examples/images/image-768.jpg 2x" />
```

Into the above example automatically

### Invoking the polyfill directly

The `picturefill` service can invoke the polyfill with the `refresh` method, which is called with the same arguments as the `picturefill()` function that the polyfill provides.

```javascript
import Ember from 'ember';

const {
  Component,
  inject: { service }
} = Ember;

export default Component.extend({
  picturefill: service(),

  actions: {
    onSomeAction() {
      this.get('picturefill').refresh();
    }
  }
});
```

## Configuration

You can configure `ember-picturefill` in your `ember-cli-build.js` file like so. Values displayed are the defaults.

```javascript
var EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  var app = new EmberApp(defaults, {
    picturefill: {
      disableTransform: false // Disable the HTMLBars transformation
    }
  });

  return app.toTree();
};
```

## Good Stuff to Know

There are a few other nice things about this wrapper that I wanted to highlight:

- It pulls in the Picturefill library from NPM instead of Bower and automatically imports it into your app.  The minified version is automatically used for production builds.
- The polyfill will only be run against the DOM at most one time per `render` cycle to cut down on unnecessary work

## Todo

- [ ] Provide a list of plugins that you also want to import
- [ ] Proper Fastboot support
    - [ ] Exclude the library in the Fastboot build
    - [ ] No-op the `refresh` function in the Fastboot environment

## Compatibility Note

Officially, this addon supports Ember 2.4 and up.  The `{{pf-img}}` component should work on things lower than that, but there were issues with the HTMLBars transform.  If you need support below 2.4, try disabling the transform and you should be fine.

[picturefill]: https://github.com/scottjehl/picturefill
