import { connect } from 'react-redux';

import Profile from '../components/Profile';

import { setLoggedIn } from '../modules/profile';

const mapStateToProps = (state) => ({
  profile : state.profile
});

const mapDispatchToProps = {
    setLoggedIn
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
