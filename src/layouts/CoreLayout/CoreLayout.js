import React from 'react';
import Header from '../../components/Header';
import Recorder from '../../components/Recorder';
import './CoreLayout.scss';
import '../../styles/core.scss';

export const CoreLayout = ({ children }) => (
  <div className='layout-container'>
    <Header />
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
