import Elapsed from 'elapsed';

import RecordModel from './RecordModel';

import TaskModel from '../../Tasks/modules/TaskModel';
import { REMOVE_TASK } from '../../Tasks/modules/tasks';

import { SET_LOGGED_IN } from 'routes/Profile/modules/profile';

const initialState = {
  record: null,
  records: [],
  task: null
};

// ------------------------------------
// Constants
// ------------------------------------
export const ADD_RECORDING = 'ADD_RECORDING';
export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const PAUSE_RECORDING = 'PAUSE_RECORDING';
export const SET_RECORD_SYNC = 'SET_RECORD_SYNC';
export const SET_RECORD_DATE = 'SET_RECORD_DATE';
export const SET_RECORD_COMMENT = 'SET_RECORD_COMMENT';
export const UPDATE_RECORD_ELAPSED = 'UPDATE_RECORD_ELAPSED';
export const REMOVE_RECORD = 'REMOVE_RECORD';

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
export function pauseRecording () {
  return {
    type: PAUSE_RECORDING
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
      record: state.record,
      task: state.task,
      records
    }
  },
  [START_RECORDING] : (state, action) => {

    const records = [...state.records];

    // Stop ongoing record
    if (state.record) {
      records[records.length - 1] = Object.assign({}, records[records.length - 1], {
        endTime: Date.now(),
        elapsedTime: new Elapsed(records[records.length - 1].startTime, Date.now()).optimal
      });
    }

    // Determine which task to log to
    const task = action.task || state.task || TaskModel();
    const record = action.record || RecordModel({ task });

    records.push(record);

    return {
      record,
      task,
      records
    }
  },
  [STOP_RECORDING] : (state) => {

    const records = [...state.records];

    if (state.record) {
      records[records.length - 1] = Object.assign({}, records[records.length - 1], {
        endTime: Date.now(),
        elapsedTime: new Elapsed(records[records.length - 1].startTime, Date.now()).optimal
      });
    }

    return {
      record: initialState.record,
      task: initialState.task,
      records
    }
  },
  [PAUSE_RECORDING] : (state) => {

    if (!state.record) {
      return state;
    }

    const records = [...state.records];

    records[records.length - 1] = Object.assign({}, records[records.length - 1], {
      endTime: Date.now(),
      elapsedTime: new Elapsed(records[records.length - 1].startTime, Date.now()).optimal
    });

    return {
      record: initialState.record,
      task: state.task,
      records
    }
  },
  [REMOVE_TASK] : (state, action) => {

    const records = [];
    state.records.forEach((record) => {
      if (record.taskCuid !== action.cuid) {
        records.push(record);
      }
    });

    let record = state.record;
    if (record && record.taskCuid === action.cuid) {
      record = initialState.record;
    }

    let task = state.task;
    if (task && task.cuid === action.cuid) {
      task = initialState.task;
    }

    return {
      record,
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

    let record = state.record;
    if (record && record.cuid === action.cuid) {
      record = Object.assign({}, record, {
        syncing: action.syncing
      });
    }

    return {
      record,
      task: state.task,
      records
    };
  },
  [SET_RECORD_DATE] : (state, action) => {

    const records = state.records.map((record) => {

      if (record.cuid === action.cuid) {
        return Object.assign({}, record, {
          startTime: action.startTime,
          endTime: action.endTime,
          elapsedTime: new Elapsed(action.startTime, action.endTime || Date.now()).optimal
        });
      }

      return record;
    });

    let record = state.record;
    if (record && record.cuid === action.cuid) {
      record = Object.assign({}, record, {
        startTime: action.startTime,
        endTime: action.endTime,
        elapsedTime: new Elapsed(action.startTime, action.endTime || Date.now()).optimal
      });
    }

    return {
      record,
      task: state.task,
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

    let record = state.record;
    if (record && record.cuid === action.cuid) {
      record = Object.assign({}, record, {
        comment: action.comment
      });
    }

    return {
      record,
      task: state.task,
      records
    };
  },
  [UPDATE_RECORD_ELAPSED] : (state, action) => {

    const records = state.records.map((record) => {

      if (record.cuid === action.cuid) {
        return Object.assign({}, record, {
          elapsedTime: new Elapsed(record.startTime, record.endTime || Date.now()).optimal
        });
      }

      return record;
    });

    let record = state.record;
    if (record && record.cuid === action.cuid) {
      record = Object.assign({}, record, {
        elapsedTime: new Elapsed(record.startTime, record.endTime || Date.now()).optimal
      });
    }

    return {
      record,
      task: state.task,
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

    let record = state.record;
    if (record && record.cuid === action.cuid) {
      record = initialState.record;
    }

    return {
      record,
      task: state.task,
      records
    };
  }
};

// Listen for logout. Clear everything if we log out
ACTION_HANDLERS[SET_LOGGED_IN] = (state, action) => {
  const records = [...state.records];

  if (state.record) {
    records[records.length - 1] = Object.assign({}, records[records.length - 1], {
      endTime: Date.now(),
      elapsedTime: new Elapsed(records[records.length - 1].startTime, Date.now()).optimal
    });
  }

  return {
    record: initialState.record,
    task: initialState.task,
    records
  }
};

// ------------------------------------
// Getters
// ------------------------------------
export function getRecordsForTask ({ state, taskCuid }) {
  const records = [];

  state.recorder.records.forEach((record) => {
    if (record.taskCuid === taskCuid) {
      records.push(record);
    }
  });

  return records;
}

export const getRecords = state => state.recorder.records;

export const getRecord = ({ state, recordCuid }) => state.recorder.records.find(r => r.cuid === recordCuid);

export const getActiveRecord = state => state.recorder.record;

// ------------------------------------
// Reducer
// ------------------------------------
export default function recorderReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
