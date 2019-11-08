import React from 'react';
import CoreLayout from 'layouts/CoreLayout/CoreLayout';
import Home from './containers/HomeContainer';

export default () => <CoreLayout exact path="/" component={Home} />;
