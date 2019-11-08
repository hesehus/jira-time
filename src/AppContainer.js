import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider, connect } from 'react-redux';

import KeyAndPasteEventsHandler from 'modules/KeyAndPasteEventsHandler';
import DragAndDropHandler from 'modules/DragAndDropHandler';

class AppContainer extends Component {
    static propTypes = {
        routes: PropTypes.object.isRequired,
        store: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        KeyAndPasteEventsHandler.init();
        DragAndDropHandler.init();
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {
        const { routes, store } = this.props;

        return (
            <Provider store={store}>
                <HashRouter>
                    {routes}
                </HashRouter>
            </Provider>
        );
    }
}

export default connect()(AppContainer);
