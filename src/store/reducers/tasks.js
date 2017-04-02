import DeepAssign from 'deep-assign';

import TaskModel from 'store/models/TaskModel';

// Defining the different types of sorting we have
export const TASKS_SORT_ORDERS = ['asc', 'desc'];
Object.freeze(TASKS_SORT_ORDERS);

const initialState = {
    tasks: [],
    sortOrder: null,
    search: ''
};

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_TASK = 'ADD_TASK';
export const REMOVE_TASK = 'REMOVE_TASK';
export const REFRESH_ISSUE = 'REFRESH_ISSUE';
export const SET_ISSUE_REMAINING_ESTIMATE = 'SET_ISSUE_REMAINING_ESTIMATE';
export const SET_ISSUE_REFRESHING = 'SET_ISSUE_REFRESHING';
export const SET_MANUAL_SORT_ORDER = 'SET_MANUAL_SORT_ORDER';
export const SET_TASK_MOVING = 'SET_TASK_MOVING';
export const SET_TASKS_SORT_ORDER = 'SET_TASKS_SORT_ORDER';
export const SET_SEARCH = 'SET_SEARCH';

// ------------------------------------
// Actions
// ------------------------------------
export function addTask ({ issue }) {
    return {
        type: ADD_TASK,
        issue
    }
};
export function removeTask ({ cuid }) {
    return {
        type: REMOVE_TASK,
        cuid
    }
};
export function refreshIssue ({ cuid, issue }) {
    return {
        type: REFRESH_ISSUE,
        cuid,
        issue
    }
};
export function setIssueRefreshing ({ cuid, refreshing }) {
    return {
        type: SET_ISSUE_REFRESHING,
        cuid,
        refreshing
    }
};
export function setIssueRemainingEstimate ({ cuid, remainingEstimate }) {
    return {
        type: SET_ISSUE_REMAINING_ESTIMATE,
        cuid,
        remainingEstimate
    }
};
export function setManualSortOrder ({ tasks }) {
    return {
        type: SET_MANUAL_SORT_ORDER,
        tasks
    }
};
export function setTaskMoving ({ cuid, moving }) {
    return {
        type: SET_TASK_MOVING,
        cuid,
        moving
    }
};
export function setTasksSortOrder ({ sortOrder }) {
    return {
        type: SET_TASKS_SORT_ORDER,
        sortOrder
    }
};
export function setTasksSearch ({ search }) {
    return {
        type: SET_SEARCH,
        search
    }
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [ADD_TASK] : (state, action) => {

        const { issue } = action;

        // Prevent adding tasks with issue keys that we have already
        if (state.tasks.find(task => task.issue.key.toLowerCase() === issue.key.toLowerCase())) {
            return state;
        }

        return {
            ...state,
            tasks: [...state.tasks, TaskModel({ issue })]
        }
    },
    [REMOVE_TASK] : (state, action) => {

        let taskIndex = state.tasks.findIndex(task => task.cuid === action.cuid);

        return {
            ...state,
            tasks: [...state.tasks.slice(0, taskIndex), ...state.tasks.slice(taskIndex + 1)]
        };
    },
    [SET_MANUAL_SORT_ORDER] : (state, { tasks }) => {
        return {
            ...state,
            tasks,
            sortOrder: initialState.sortOrder
        };
    },
    [REFRESH_ISSUE] : (state, action) => {
        let tasks = state.tasks.map(task => {
            if (task.cuid === action.cuid) {
                task = DeepAssign({}, task);
                task.issue = action.issue;
                task.issueRefreshing = false;
            }
            return task;
        });

        return {
            ...state,
            tasks
        };
    },
    [SET_ISSUE_REFRESHING] : (state, action) => {

        let tasks = state.tasks.map(task => {
            if (task.cuid === action.cuid) {

                const newTask = DeepAssign({}, task, {
                    issueRefreshing: action.refreshing
                });

                return newTask;
            }
            return task;
        });

        return {
            ...state,
            tasks
        };
    },
    [SET_ISSUE_REMAINING_ESTIMATE] : (state, action) => {

        let tasks = state.tasks.map(task => {
            if (task.cuid === action.cuid) {
                const newTask = DeepAssign({}, task);

                if (newTask.issue && action.remainingEstimate) {
                    newTask.issue.fields.timetracking.remainingEstimate = action.remainingEstimate;
                }

                return newTask;
            }
            return task;
        });

        return {
            ...state,
            tasks
        };
    },
    [SET_TASK_MOVING] : (state, { cuid, moving }) => {

        let tasks = state.tasks.map(task => {
            if (task.cuid === cuid) {
                const newTask = DeepAssign({}, task);
                newTask.moving = moving;
                return newTask;
            }
            return task;
        });

        return {
            ...state,
            tasks
        };
    },
    [SET_TASKS_SORT_ORDER]: (state, { sortOrder }) => {
        const tasks = [...state.tasks];

        if (sortOrder === 'asc') {
            tasks.sort(naturalCompare);
        } else {
            tasks.sort(naturalCompare).reverse();
        }

        return {
            ...state,
            sortOrder,
            tasks
        };
    },
    [SET_SEARCH]: (state, { search }) => {
        return {
            ...state,
            search
        };
    },
    'SERVER_STATE_PUSH' : (state, { tasks }) => tasks
};

function naturalCompare (a, b) {
    let ax = [];
    let bx = [];

    a.issue.key.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { ax.push([$1 || Infinity, $2 || '']) });
    b.issue.key.replace(/(\d+)|(\D+)/g, (_, $1, $2) => { bx.push([$1 || Infinity, $2 || '']) });

    while (ax.length && bx.length) {
        let an = ax.shift();
        let bn = bx.shift();
        let nn = (an[0] - bn[0]) || an[1].localeCompare(bn[1]);
        if (nn) return nn;
    }
    return ax.length - bx.length;
}

// ------------------------------------
// Getters
// ------------------------------------
export const getTask = ({ state, taskCuid }) => state.tasks.tasks.find(task => task.cuid === taskCuid);
export const getMovingTask = ({ state }) => state.tasks.tasks.find(task => task.moving);
export const getTasksSortOrder = state => state.tasks.sortOrder;
export const getTasksFilteredBySearch = ({ state }) => {
    const search = state.tasks.search.toLowerCase();
    return state.tasks.tasks.filter((task) => {
        return task.issue.key.toLowerCase().includes(search) ||
               task.issue.fields.summary.toLowerCase().includes(search);
    });
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function tasksReducer (state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
