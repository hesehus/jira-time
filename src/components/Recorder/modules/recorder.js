import RecordModel from './RecordModel';

import TaskModel from '../../Tasks/modules/TaskModel';
import { REMOVE_TASK } from '../../Tasks/modules/tasks';

const initialState = {
  record: null,
  records: [],
  task: null
};

// ------------------------------------
// Constants
// ------------------------------------
export const START_RECORDING = 'START_RECORDING';
export const STOP_RECORDING = 'STOP_RECORDING';
export const PAUSE_RECORDING = 'PAUSE_RECORDING';

// ------------------------------------
// Actions
// ------------------------------------
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

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
  [START_RECORDING] : (state, action) => {

    const records = [...state.records];

    // Stop ongoing record
    if (state.record) {
      const record = state.record;
      record.endTime = Date.now();
      records.push(record);
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

    if (!state.record) {
      return state;
    }

    const records = [...state.records];
    records[records.length - 1].endTime = Date.now();

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
    records[records.length - 1].endTime = Date.now();

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

export const thereAreRecords = state => !!state.recorder.records.length;

// ------------------------------------
// Reducer
// ------------------------------------
export default function recorderReducer (state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type];

  return handler ? handler(state, action) : state;
}
