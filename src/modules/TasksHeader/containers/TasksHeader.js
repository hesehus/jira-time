import { connect } from 'react-redux';

import TasksHeader from '../components/TasksHeader';

import { getTasksSortOrder, setTasksSortOrder } from 'store/reducers/tasks';

const mapStateToProps = (state) => {
    return {
        tasksSortOrder: getTasksSortOrder(state)
    };
};

const mapDispatchToProps = {
    setTasksSortOrder
};

export default connect(mapStateToProps, mapDispatchToProps)(TasksHeader);
