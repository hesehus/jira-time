import { connect } from 'react-redux';

import TasksHeader from '../components/TasksHeader';

import { getTasksSortOrder, setTasksSortOrder, setTasksSearch } from 'store/reducers/tasks';

const mapStateToProps = state => {
    return {
        tasksSortOrder: getTasksSortOrder(state),
        tasksSearch: state.tasks.search
    };
};

const mapDispatchToProps = {
    setTasksSortOrder,
    setTasksSearch
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TasksHeader);
