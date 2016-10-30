import { connect } from 'react-redux';
import { setAuthenticationHash } from '../../../store/app';

import Login from '../components/Login';

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setAuthenticationHash
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
