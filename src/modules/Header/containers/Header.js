import { connect } from 'react-redux';

import { getCurrentPath } from 'store/reducers/location';
import { getRecords } from 'store/reducers/recorder';
import { refreshIssue, setIssueRefreshing } from 'store/reducers/tasks';

import Header from '../components/Header';

const mapDispatchToProps = {
    refreshIssue,
    setIssueRefreshing
};

const mapStateToProps = state => ({
    profile: state.profile,
    records: getRecords({ state }),
    currentPath: getCurrentPath(state),
    loggedIn: state.profile.loggedIn
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
