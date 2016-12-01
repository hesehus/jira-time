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
    res.status(200).send();
  });
}

api.getUserInfo = function (req, res) {
  helpers.delay(function () {
    res.json({
	    self: 'http://www.example.com/jira/rest/api/2/user?username=fred',
	    key: 'fred',
	    accountId: '99:27935d01-92a7-4687-8272-a9b8d3b2ae2e',
	    name: 'fred',
	    emailAddress: 'fred@example.com',
	    avatarUrls: {
	        '48x48': 'http://lorempixel.com/48/48/cats/', // eslint-disable-line
	        '24x24': 'http://lorempixel.com/24/24/cats/', // eslint-disable-line
	        '16x16': 'http://lorempixel.com/16/16/cats/', // eslint-disable-line
	        '32x32': 'http://lorempixel.com/32/32/cats/' // eslint-disable-line
	    },
	    displayName: 'Fred F. User',
	    active: true,
	    timeZone: 'Australia/Sydney',
	    groups: {
	        size: 3,
	        items: [
	            {
	                name: 'jira-user',
	                self: 'http://www.example.com/jira/rest/api/2/group?groupname=jira-user'
	            },
	            {
	                name: 'jira-admin',
	                self: 'http://www.example.com/jira/rest/api/2/group?groupname=jira-admin'
	            },
	            {
	                name: 'important',
	                self: 'http://www.example.com/jira/rest/api/2/group?groupname=important'
	            }
	        ]
	    },
	    applicationRoles: {
	        size: 1,
	        items: []
	    },
	    expand: 'groups,applicationRoles'
	});
  });
}

module.exports = api;
