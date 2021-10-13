import React from 'react';
import { hydrate } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from './src/app/store/store.factory'
import AllRoutes from './src/app/routing/route'
import history from './src/app/routing/history'
import { BrowserRouter, Router } from 'react-router-dom';
import './src/app/assets/css/bootstrap.min.css'
import './src/app/assets/css/style.css'

hydrate(
    <Provider store={store}>
        <BrowserRouter>
            <AllRoutes />
        </BrowserRouter>
    </Provider>,
    document.querySelector('#root')
);
