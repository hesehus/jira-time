import CoreLayout from 'layouts/CoreLayout/CoreLayout';

import Home from './Home';
import Profile from './Profile';
import Summary from './Summary';

export const createRoutes = (store) => {
    return {
        path        : '/',
        component   : CoreLayout,
        indexRoute  : Home,
        childRoutes : [
            Profile,
            Summary
        ]
    };
};

export default createRoutes;
