// Core
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Route } from 'react-router-dom';

// Instruments
import { store } from './bus/init/store';
import './theme/init';

// Intro
import App from './navigation/App';

render(
    <Provider store = { store }>
        <Route>
            <App />
        </Route>
    </Provider>, document.getElementById('app'));
