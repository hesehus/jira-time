const helpers = require('../helpers');

const IssueController = require('./issue.controller');

const api = {};

api.search = function(req, res) {
    helpers.delay(function() {
        res.json({
            expand: 'schema,names',
            issues: [
                IssueController.createDummyIssue('test-1'),
                IssueController.createDummyIssue('test-4'),
                IssueController.createDummyIssue('test-22'),
                IssueController.createDummyIssue('test-12')
            ],
            maxResults: 50,
            startAt: 0,
            total: 5
        });
    });
};

module.exports = api;
