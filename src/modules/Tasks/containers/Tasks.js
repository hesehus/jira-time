import { connect } from 'react-redux';

import { setManualSortOrder, setTaskMoving, getTasksFilteredBySearch } from 'store/reducers/tasks';

import Tasks from '../components/Tasks';

const mapStateToProps = (state) => ({
    profile: state.profile,
    tasks: getTasksFilteredBySearch({ state }),
    tasksSearch: state.tasks.search,
    unfilteredTasks: state.tasks.tasks
});

const mapDispatchToProps = {
    setTaskMoving,
    setManualSortOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(Tasks);
