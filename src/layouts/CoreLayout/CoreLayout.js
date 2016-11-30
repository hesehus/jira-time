import React from 'react';

import Header from 'modules/Header';
import Tabs from 'modules/Tabs';
import Recorder from 'modules/Recorder';

import './CoreLayout.scss';
import 'styles/core.scss';

export const CoreLayout = ({ children }) => (
  <div className='layout-container'>
    <Header />
    <Tabs />
    <div className='layout-container__viewport'>
      {children}
    </div>
    <Recorder />
  </div>
);

CoreLayout.propTypes = {
  children : React.PropTypes.element.isRequired
};

export default CoreLayout;
