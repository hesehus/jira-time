import React from 'react';

import Home from './Home';
import Profile from './Profile';
import Summary from './Summary';

export const createRoutes = store => {
    return (
        <div>
            <Home />
            <Profile />
            <Summary />
        </div>
    );
};

export default createRoutes;
