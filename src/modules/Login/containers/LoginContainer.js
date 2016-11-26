import { connect } from 'react-redux';
import { setAuthenticationHash } from 'store/reducers/app';
import { setLoggedIn } from 'store/reducers/profile';

import Login from '../components/Login';

const mapStateToProps = (state) => ({
  username: state.profile.username
});

const mapDispatchToProps = {
  setLoggedIn,
  setAuthenticationHash
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
