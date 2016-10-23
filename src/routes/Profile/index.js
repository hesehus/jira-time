import { injectReducer } from '../../store/reducers';

export default (store) => ({
  path : 'profile',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use require callback to define
        dependencies for bundling   */
    const Profile = require('./containers/ProfileContainer').default;
    const reducer = require('./modules/profile').default;

    /*  Add the reducer to the store on key 'profile'  */
    injectReducer(store, { key: 'profile', reducer });

    /*  Return getComponent   */
    cb(null, Profile);
  }
});
