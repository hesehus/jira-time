import React from 'react';
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import Profile from './containers/Profile';

export default () => <CoreLayout exact path="/profile" component={Profile} />;
