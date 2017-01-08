import React from 'react';

import Theme from 'modules/theme';
import Header from 'modules/Header';
import Recorder from 'modules/Recorder';

import './CoreLayout.scss';
import 'styles/core.scss';

export const CoreLayout = ({ children }) => (
    <Theme>
        <div className='layout-container'>
            <Header />
            <div className='layout-container__viewport'>
                {children}
            </div>
            <Recorder />
        </div>
    </Theme>
);

CoreLayout.propTypes = {
    children : React.PropTypes.element.isRequired
};

export default CoreLayout;
