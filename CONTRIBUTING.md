Contributing to ResonantGeo
===========================

ResonantGeo components are Vue files using [pug](https://pugjs.org/) for html templating and
[stylus](http://stylus-lang.com/) for CSS styling.  The code is linted according to airbnb's
[eslint configuration](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb).
Unit testing is handled by [karma](http://karma-runner.github.io/) which executes test specs present
in the `test/specs` directory.  These files are [mocha](https://mochajs.org/) specs using
[chai assertions](http://www.chaijs.com/) and [@vue/test-utils](https://vue-test-utils.vuejs.org/en/)
for mounting isolated components.  [Sinon](http://sinonjs.org/releases/v4.5.0/) is also globally
available in the test environment for mocking and stubbing.

Setting up the development environment
======================================

ResonantGeo requires at least node version 8 and uses [yarn](https://yarnpkg.com/en/) to manage
dependencies and development scripts.  Ensure you have a recent version of yarn installed by running
```
npm install -g yarn
```
then generate the `node_modules` directory
```
yarn
```

Running and debugging tests
===========================

Running `yarn test` will execute all tests (lint and unit) and generate code coverage information.
In case of test failures, you can run `yarn unit:debug` and open <http://localhost:9876/debug.html>
in a browser.  This will enable you to set break points and debug the test specs as the are run in a
live browser.  Note that on CI the tests are executed in phantomjs and do not have all the features
of a real browser (including webgl).

Adding a new component
======================

All components live in the `src/components` directory as `.vue` files.  New components should follow
the naming guidelines in the Vue [style guide](https://vuejs.org/v2/style-guide/).  The component
should be imported and exported from the `index.js` file in it's directory.  All components exported
in this way will be automatically registered when instantiating the plugin.

Components should not contain direct calls to vuex stores, routes, or make ajax requests.  All
inputs to the component should be through props that are treated as read-only.  Components should
communicate to it's parent via events.  Two-way data binding can be simulated, when necessary, by
emitting `update:<prop name>` events that the parent can bind to using the
[`.sync` modifier](https://vuejs.org/v2/guide/components-custom-events.html#sync-Modifier).

Committing changes
==================

ResonantGeo uses [semantic release](https://github.com/semantic-release/semantic-release) to
automatically generate releases on github and publish to npm.  This relies on commit messages following
a [special format](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).
To help users generate these messages correctly, we recommend installing
[commitizen](http://commitizen.github.io/cz-cli/) and making commits using the `git cz` command in
place of `git commit`.  ResonantGeo contains a commit message linter that runs as a post commit
hook.  This linter can be run manually with the command `yarn commitlint`.
