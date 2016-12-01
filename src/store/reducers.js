import { combineReducers } from 'redux';

// Import all reducers that are not async
import app from './reducers/app';
import location from './reducers/location';
import tasks from './reducers/tasks';
import recorder from './reducers/recorder';
import profile from './reducers/profile';
import tabs from './reducers/tabs';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    app,
    location,
    tasks,
    recorder,
    profile,
    tabs,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
