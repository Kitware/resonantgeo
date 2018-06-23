const defaults = {
  poll: 10,
  timeout: 1000,
};

export default function waitFor(func, message, options = {}) {
  const { poll, timeout } = Object.assign({}, defaults, options);
  const msg = message || 'something to happen';
  const startTime = new Date();

  return new Promise((resolve, reject) => {
    function pollFunction() {
      const result = func();
      if (result) {
        resolve(result);
      } else if (new Date() - startTime > timeout) {
        reject(new Error(`Timeout exceed waiting for ${msg}`));
      } else {
        window.setTimeout(pollFunction, poll);
      }
    }
    pollFunction();
  });
}
