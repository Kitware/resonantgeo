# ResonantGeo Geospatial Vue components for [Resonant](http://resonant.kitware.com/)

[![CircleCI](https://img.shields.io/circleci/project/github/Kitware/resonantgeo.svg)](https://circleci.com/gh/Kitware/resonantgeo)
[![Codecov](https://img.shields.io/codecov/c/github/Kitware/resonantgeo.svg)](https://codecov.io/gh/Kitware/resonantgeo)
[![Dependencies Status](https://david-dm.org/kitware/resonantgeo/status.svg)](https://david-dm.org/kitware/resonantgeo)

ResonantGeo is a set of Vue components built on top of [Vuetify](https://vuetifyjs.com) for quickly
prototyping geospatial applications.  Each component is self-contained and does not rely on any
global state or server infrastructure.  Component inputs are props and outputs are events.  For
props requiring [two-way data binding](https://vuejs.org/v2/guide/forms.html), the `.sync` modifier
is supported following the Vue
[documentation](https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier).  To
summarize, these props emit `update:<prop name>` events to request that the parent component update
the value rather than doing so directly.

To include a component into an existing application, just install the npm package
```
npm install resonantgeo
```
and register the plugin with Vue.
```javascript
import Resonantgeo from 'resonantgeo';
import Vue from 'vue';

Vue.use(Resonantgeo);
```
ResonantGeo will then be ready to use in your applications components.
```html
<template>
  <side-panel :expanded.sync="expanded">
  </side-panel>
</template>

<script>
export default {
  data() {
    return {
      expanded: true,
    };
  }
};
</script>
```


Getting started from Vue cli
============================

To start a new project from scratch, you can use one of the
[Vue cli](https://vuejs.org/v2/guide/installation.html#CLI) templates to initialize a new application
using the same development environment used by the library itself.  Two templates exist,
[jbeezley/resonantgeo-webpack-simple](https://github.com/jbeezley/resonantgeo-webpack-simple) is a
basic example of an application with no testing and a simple webpack configuration, while
[jbeezley/resonantgeo-webpack](https://github.com/jbeezley/resonantgeo-webpack) is a full featured
example with unit and end-to-end testing and a webpack configuration suitable for production builds.

To get started, just invoke the vue cli as follows
```
npm install -g vue-cli
vue init jbeezley/resonantgeo-webpack-simple
```

Examples
========

There are example applications using ResonantGeo inside the [examples](examples) directory.
Individual examples can be built and served locally by running `yarn && yarn dev` inside each
subdirectory.

Component documentation
=======================

Component documentation is in progress...

Contributing
============

See [CONTRIBUTING.md](Contributing.md) for instructions on how to develop and contribute to
ResonantGeo.
