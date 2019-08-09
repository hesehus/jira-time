import { connect } from 'react-redux';

import { getMovingRecord, getRecordsWithNoIssue } from 'store/reducers/recorder';

import TasksinLimbo from '../components/TasksinLimbo';

const mapStateToProps = state => ({
    profile: state.profile,
    movingRecord: getMovingRecord({ state }),
    recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

export default connect(mapStateToProps)(TasksinLimbo);
