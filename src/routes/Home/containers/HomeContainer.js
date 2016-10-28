import { connect } from 'react-redux';

import Home from '../components/Home';

function mapStateToProps (state) {
  return {
    app: state.app
  }
}

export default connect(mapStateToProps)(Home);
