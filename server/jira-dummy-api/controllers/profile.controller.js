const helpers = require('../helpers');

var api = {};

api.login = function (req, res) {
  helpers.delay(function () {
    res.status(200).send();
  });
}

api.logout = function (req, res) {
  helpers.delay(function () {
    res.status(204).send();
  });
}

api.checkSession = function (req, res) {
  helpers.delay(function () {
    res.status(403).send();
  });
}

module.exports = api;
