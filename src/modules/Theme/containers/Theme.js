import { connect } from 'react-redux';

import Theme from '../components/Theme';

const mapStateToProps = state => ({
    profile: state.profile
});

export default connect(mapStateToProps)(Theme);
