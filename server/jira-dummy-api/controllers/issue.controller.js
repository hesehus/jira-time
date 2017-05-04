const moment = require('moment');

const ips = require('lorem-ipsum');
const helpers = require('../helpers');

const api = {};

api.getIssue = function (req, res) {
    helpers.delay(function () {
        res.json(api.createDummyIssue(req.params.id));
    });
}

api.addWorklog = function (req, res) {
    helpers.delay(function () {
        res.status(201).json({
            id: 123,
            created: new Date()
        });
    });
}

api.updateWorklog = function (req, res) {
    helpers.delay(function () {
        res.status(200).send();
    });
}

api.updateIssue = function (req, res) {
    helpers.delay(function () {
        res.status(204).send();
    });
}

api.watchIssue = function (req, res) {
    helpers.delay(function () {
        res.status(204).send();
    });
}

api.getWorklogs = function (req, res) {
    helpers.delay(function () {
        res.json({
            maxResults: 28,
            startAt: 0,
            total: 28,
            worklogs: [
                api.createDummyWorklog(req.params.key),
                api.createDummyWorklog(req.params.key)
            ]
        });
    });
}

api.createDummyIssue = function (key) {
    return {
        id: 123,
        key: key.toUpperCase(),
        fields: {
            summary: ips({ count: 2, units: 'sentences' }),
            timetracking: {
                remainingEstimate: '2d 14h 51m',
                remainingEstimateSeconds: 500,
                originalEstimate: '3d',
                originalEstimateSeconds: 600,
                timeSpent: 'A while',
                timeSpentSeconds: 500
            },
            status: {
                name: 'Forespørgsel',
                description: 'Forespørgsel',
                statusCategory: {
                    key: 'done'
                }
            }
        }
    };
}

api.createDummyWorklog = function (key) {
    return {
        id: 123,
        author: {
            key: '',
            name: ''
        },
        comment: ips({ count: 1, units: 'sentences' }),
        started: moment().subtract(Math.floor(Math.random() * 9999), 'seconds').toISOString(),
        created: moment().toISOString(),
        timeSpentSeconds: Math.floor(Math.random() * 9999)
    };
}

module.exports = api;
