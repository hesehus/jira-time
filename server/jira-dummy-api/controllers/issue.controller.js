const ips = require('lorem-ipsum');
const helpers = require('../helpers');

var api = {};

api.getIssue = function (req, res) {
  helpers.delay(function () {
    res.json(createDummyIssue(req.params.id));
  });
}

api.addWorklog = function (req, res) {
  helpers.delay(function () {
    res.status(200).send();
  });
}

function createDummyIssue (key) {
  var issue = {
    key: key,
    fields: {
      summary: ips({ count: 2, units: 'sentences' }),
      timetracking: {
        remainingEstimate: '2d 14h 51m'
      }
    }
  };

  return issue;
}

module.exports = api;
