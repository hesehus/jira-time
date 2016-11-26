export default (store) => ({
  path : 'profile',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    const Profile = require('./containers/ProfileContainer').default;
    cb(null, Profile);
  }
});
