import moment from 'moment';

import RecordModel from 'store/models/RecordModel';
import TaskModel from 'store/models/TaskModel';

import { REMOVE_TASK } from 'store/reducers/tasks';

const initialState = {
    records: [],
    task: null
};

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_RECORDING = 'ADD_RECORDING';
export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const SET_RECORD_SYNC = 'SET_RECORD_SYNC';
export const SET_RECORD_DATE = 'SET_RECORD_DATE';
export const SET_RECORD_COMMENT = 'SET_RECORD_COMMENT';
export const SET_RECORD_MOVING = 'SET_RECORD_MOVING';
export const SET_RECORD_MOVE_TARGET = 'SET_RECORD_MOVE_TARGET';
export const SET_RECORD_TASK = 'SET_RECORD_TASK';
export const UPDATE_RECORD_ELAPSED = 'UPDATE_RECORD_ELAPSED';
export const REMOVE_RECORD = 'REMOVE_RECORD';

export function getElapsedTime ({ startTime, endTime }) {

    startTime = moment(startTime);
    endTime = moment(endTime || Date.now());

    const diff = endTime.unix() - startTime.unix();

    if (diff < 0) {
        return 'Dude, negative time?';
    }

    if (diff < 60) {
        return '< 1m';
    }

    const d = moment.duration(diff, 'seconds');

    let outputString = '';

    if (d.minutes() !== 0) {
        outputString = `${d.minutes()}m` + outputString;
    }
    if (d.hours() !== 0) {
        outputString = `${d.hours()}h ` + outputString;
    }
    if (d.days() !== 0) {
        outputString = `${d.days()}d ` + outputString;
    }

    return outputString;
}

// ------------------------------------
// Actions
// ------------------------------------
export function addRecord ({ task, record } = {}) {
    return {
        type: ADD_RECORDING,
        task,
        record
    };
};
export function startRecording ({ task, record } = {}) {
    return {
        type: START_RECORDING,
        task,
        record
    };
};
export function stopRecording () {
    return {
        type: STOP_RECORDING
    };
};
export function setRecordSync ({ cuid, syncing }) {
    return {
        type: SET_RECORD_SYNC,
        cuid,
        syncing
    };
};
export function setRecordDate ({ cuid, startTime, endTime }) {
    return {
        type: SET_RECORD_DATE,
        cuid,
        startTime,
        endTime
    };
};
export function setRecordComment ({ cuid, comment }) {
    return {
        type: SET_RECORD_COMMENT,
        cuid,
        comment
    };
};
export function setRecordTask ({ cuid, taskCuid, taskIssueKey }) {
    return {
        type: SET_RECORD_TASK,
        cuid,
        taskCuid,
        taskIssueKey
    };
};
export function setRecordMoving ({ cuid, moving }) {
    return {
        type: SET_RECORD_MOVING,
        cuid,
        moving
    };
};
export function setRecordMoveTarget ({ cuid, taskCuid }) {
    return {
        type: SET_RECORD_MOVE_TARGET,
        cuid,
        taskCuid
    };
};
export function updateRecordElapsed ({ cuid }) {
    return {
        type: UPDATE_RECORD_ELAPSED,
        cuid
    };
};
export function removeRecord ({ cuid }) {
    return {
        type: REMOVE_RECORD,
        cuid
    };
};

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [ADD_RECORDING] : (state, action) => {

        const records = [...state.records];

        // Determine which task to log to
        const task = action.task || TaskModel();
        const record = action.record || RecordModel({ task });

        records.push(record);

        return {
            ...state,
            records
        }
    },
    [START_RECORDING] : (state, action) => {

        const records = stopRecordingInState({ state });

        // Determine which task to start recording
        const task = action.task || TaskModel();

        // Start new recording
        const record = action.record || RecordModel({ task });
        record.elapsedTime = getElapsedTime({ startTime: new Date() });
        records.push(record);

        return {
            ...state,
            task,
            records
        }
    },
    [STOP_RECORDING] : (state) => {
        return {
            ...initialState,
            records: stopRecordingInState({ state })
        }
    },
    [REMOVE_TASK] : (state, action) => {

        const records = [];
        state.records.forEach((record) => {
            if (record.taskCuid !== action.cuid) {
                records.push(record);
            }
        });

        let task = state.task;
        if (task && task.cuid === action.cuid) {
            task = initialState.task;
        }

        return {
            ...state,
            task,
            records
        };
    },
    [SET_RECORD_SYNC] : (state, action) => {

        const records = state.records.map((record) => {

            if (record.cuid === action.cuid) {
                return Object.assign({}, record, {
                    syncing: action.syncing
                });
            }

            return record;
        });

        return {
            ...state,
            records
        };
    },
    [SET_RECORD_DATE] : (state, action) => {

        const { startTime, endTime } = action;

        const records = state.records.map((record) => {

            if (record.cuid === action.cuid) {
                return {
                    ...record,
                    startTime,
                    endTime,
                    elapsedTime: getElapsedTime({ startTime, endTime })
                };
            }

            return record;
        });

        return {
            ...state,
            records
        };
    },
    [SET_RECORD_COMMENT] : (state, action) => {

        const records = state.records.map((record) => {

            if (record.cuid === action.cuid) {
                return Object.assign({}, record, {
                    comment: action.comment
                });
            }

            return record;
        });

        return {
            ...state,
            records
        };
    },
    [SET_RECORD_TASK] : (state, action) => {

        const { taskCuid, taskIssueKey } = action;

        const records = state.records.map((record) => {

            if (record.cuid === action.cuid) {
                return Object.assign({}, record, {
                    taskCuid,
                    taskIssueKey,
                    moving: false,
                    taskDroppableCuid: null
                });
            }

            return record;
        });

        return {
            ...state,
            records
        };
    },
    [SET_RECORD_MOVING] : (state, action) => {

        const records = state.records.map((record) => {
            if (record.cuid === action.cuid) {
                return Object.assign({}, record, {
                    moving: action.moving
                });
            }

            return record;
        });

        return {
            ...state,
            records
        };
    },
    [SET_RECORD_MOVE_TARGET] : (state, action) => {

        const records = state.records.map((record) => {
            if (record.cuid === action.cuid) {
                return Object.assign({}, record, {
                    taskDroppableCuid: action.taskCuid
                });
            }

            return record;
        });

        return {
            ...state,
            records
        };
    },
    [UPDATE_RECORD_ELAPSED] : (state, action) => {

        const records = state.records.map((record) => {
            if (record.cuid === action.cuid) {
                const { startTime, endTime } = record;
                return Object.assign({}, record, {
                    elapsedTime: getElapsedTime({ startTime, endTime })
                });
            }
            return record;
        });

        return {
            ...state,
            records
        };
    },
    [REMOVE_RECORD] : (state, action) => {

        const records = [];
        state.records.forEach((record) => {
            if (record.cuid !== action.cuid) {
                records.push(record);
            }
        });

        return {
            ...state,
            records
        };
    },
    'SERVER_STATE_PUSH' : (state, { recorder }) => recorder
};

// Listen for logout. Clear everything if we do
/* ACTION_HANDLERS[SET_LOGGED_IN] = (state, action) => {
    const records = [...state.records];

    if (state.record) {
        records[records.length - 1] = Object.assign({}, records[records.length - 1], {
            endTime: Date.now(),
            elapsedTime: getElapsedTime({ startTime: records[records.length - 1].startTime })
        });
    }

    return {
        record: initialState.record,
        task: initialState.task,
        records
    }
}; */

function stopRecordingInState ({ state }) {
    let records = [...state.records];
    let recordIndex = records.findIndex(r => !r.endTime);
    if (recordIndex !== -1) {
        records[recordIndex] = {
            ...records[recordIndex],
            endTime: Date.now(),
            elapsedTime: getElapsedTime({ startTime: records[recordIndex].startTime })
        };
    }

    return records;
}

// ------------------------------------
// Getters
// ------------------------------------
export const getRecordsForTask = ({ state, taskCuid }) => state.recorder.records.filter(r => r.taskCuid === taskCuid);

export const getRecords = ({ state }) => state.recorder.records;

export const getRecordsWithNoIssue = ({ state }) => state.recorder.records.filter(r => !r.taskIssueKey);

export const getActiveRecord = ({ state }) => state.recorder.records.find(r => !r.endTime);

export const getNotSyncedRecords = ({ state }) => state.recorder.records.filter(r => !!r.endTime);

export const getMovingRecord = ({ state }) => state.recorder.records.find(r => r.moving);

export const getNumberOfRecords = ({ state, taskCuid }) => {
    return state.recorder.records.filter(r => r.taskCuid === taskCuid).length;
}

// ------------------------------------
// Reducer
// ------------------------------------
export default function recorderReducer (state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}
