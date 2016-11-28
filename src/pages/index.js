import CoreLayout from 'layouts/CoreLayout/CoreLayout';

import Home from './Home';
import ProfileRoute from './Profile';

export const createRoutes = (store) => {
  return {
    path        : '/',
    component   : CoreLayout,
    indexRoute  : Home,
    childRoutes : [
      ProfileRoute(store)
    ]
  };
};

export default createRoutes;
