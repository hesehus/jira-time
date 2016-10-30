import { combineReducers } from 'redux';

// Import all reducers that are not async
import app from './app';
import location from './location';
import tasks from '../components/Tasks/modules/tasks';
import recorder from '../components/Recorder/modules/recorder';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    app,
    location,
    tasks,
    recorder,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
