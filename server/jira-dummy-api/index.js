var Express = require('express');
var ProfileController = require('./controllers/profile.controller');
var IssueController = require('./controllers/issue.controller');
var SearchController = require('./controllers/search.controller');

const router = new Express.Router();

router.route('/auth/1/session').post(ProfileController.login);
router.route('/auth/1/session').delete(ProfileController.logout);
router.route('/auth/1/session').get(ProfileController.checkSession);

router.route('/api/2/user').get(ProfileController.getUserInfo);

router.route('/api/2/issue/:id').get(IssueController.getIssue);
router.route('/api/2/issue/:id').put(IssueController.updateIssue);
router.route('/api/2/issue/:id/watchers').post(IssueController.watchIssue);

router.route('/api/2/issue/:id/worklog').get(IssueController.getWorklogs);
router.route('/api/2/issue/:id/worklog').post(IssueController.addWorklog);
router.route('/api/2/issue/:id/worklog/:id').put(IssueController.updateWorklog);

router.route('/api/2/search').get(SearchController.search);

module.exports = router;
