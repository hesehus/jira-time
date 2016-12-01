import { connect } from 'react-redux';

import Profile from '../components/Profile';

import { setLoggedIn, setUserInfo } from 'store/reducers/profile';

const mapStateToProps = (state) => ({
  profile : state.profile
});

const mapDispatchToProps = {
  setLoggedIn,
  setUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
