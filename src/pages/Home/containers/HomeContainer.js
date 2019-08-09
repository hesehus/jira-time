import { connect } from 'react-redux';

import Home from '../components/Home';

function mapStateToProps(state) {
    return {
        app: state.app,
        loggedIn: state.profile.loggedIn
    };
}

export default connect(mapStateToProps)(Home);
