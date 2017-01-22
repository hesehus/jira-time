import { connect } from 'react-redux';

import { getRecordsWithNoIssue } from 'store/reducers/recorder';
import { setManualSortOrder, setTaskMoving, getTasksFilteredBySearch } from 'store/reducers/tasks';

import Tasks from '../components/Tasks';

const mapStateToProps = (state) => ({
    tasks: getTasksFilteredBySearch({ state }),
    tasksSearch: state.tasks.search,
    unfilteredTasksCount: state.tasks.tasks.length,
    recordsWithNoIssue: getRecordsWithNoIssue({ state })
});

const mapDispatchToProps = {
    setTaskMoving,
    setManualSortOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
