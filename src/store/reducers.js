import { combineReducers } from 'redux';

// Import all reducers that are not async
import location from './location';
import tasks from '../routes/Tasks/modules/tasks';

export const makeRootReducer = (asyncReducers) => {
  return combineReducers({
    location,
    tasks,
    ...asyncReducers
  });
};

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
