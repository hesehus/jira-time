var helpers = {};

// Sets a delay from 100 to 2000 ms for all requests
helpers.delay = function (fn) {
  setTimeout(fn, Math.floor(Math.random() * 1900) + 100);
}

module.exports = helpers;
