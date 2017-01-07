import { connect } from 'react-redux';

import { getRecordsWithNoIssue } from 'store/reducers/recorder';
import { setManualSortOrder, setTaskMoving } from 'store/reducers/tasks';

import Tasks from '../components/Tasks';

const mapStateToProps = (state) => ({
    tasks: state.tasks.tasks,
    recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

const mapDispatchToProps = {
    setTaskMoving,
    setManualSortOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
