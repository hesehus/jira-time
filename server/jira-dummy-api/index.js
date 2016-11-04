var Express = require('express');
var ProfileController = require('./controllers/profile.controller');
var IssueController = require('./controllers/issue.controller');

const router = new Express.Router();

router.route('/auth/1/session').post(ProfileController.session);

router.route('/api/2/issue/:id').get(IssueController.getIssue);

router.route('/api/2/issue/:id/worklog').post(IssueController.addWorklog);

module.exports = router;
