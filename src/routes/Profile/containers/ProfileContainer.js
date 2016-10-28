import { connect } from 'react-redux';
import { setLoggedIn } from '../modules/profile';

import Profile from '../components/Profile';

const mapDispatchToProps = {
  setLoggedIn
};

const mapStateToProps = (state) => ({
  profile : state.profile
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
