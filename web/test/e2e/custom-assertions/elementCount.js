// A custom Nightwatch assertion.
// The assertion name is the filename.
// Example usage:
//
//   browser.assert.elementCount(selector, count)
//
// For more information on custom assertions see:
// http://nightwatchjs.org/guide#writing-custom-assertions

exports.assertion = function assertion(selector, count) {
  this.message = `Testing if element <${selector}> has count: ${count}`;
  this.expected = count;
  this.pass = function pass(val) {
    return val === this.expected;
  };
  this.value = function value(res) {
    return res.value;
  };
  this.command = function command(cb) {
    const self = this;
    return this.api.execute(
      selector_ => document.querySelectorAll(selector_).length,
      [selector], (res) => {
        cb.call(self, res);
      });
  };
};
