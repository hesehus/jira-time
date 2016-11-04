const helpers = require('../helpers');

var api = {};

api.session = function (req, res) {
  helpers.delay(function () {

   // ALL OK if nothing is provided
    if (!req.body || (!req.body.username && !req.body.password)) {
      res.status(200).send();
    }

    // Not ok if anything else is sent
    res.status(401).send();
  });
}

module.exports = api;
