import { connect } from 'react-redux';

import Summary from '../components/Summary';

const mapStateToProps = (state) => ({
  profile : state.profile
});

export default connect(mapStateToProps)(Summary);
