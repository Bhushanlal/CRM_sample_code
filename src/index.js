import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './app/store/store.factory'
import AllRoutes from './app/routing/route'
import history from './app/routing/history'
import { Router } from 'react-router-dom';
import './app/assets/css/bootstrap.min.css'
import './app/assets/css/style.css'
import { loadStripe } from '@stripe/stripe-js/pure';
import { Elements } from '@stripe/react-stripe-js';
import { constants } from './app/common/constants'

history.listen(_ => {
  if (history.location && history.location.pathname !== "/user/view-profile") {
    window.scrollTo(0, 0)
  }
})

const stripePromise = loadStripe(constants.STRIPE_CLIENT_ID);


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Elements stripe={stripePromise}>
        <AllRoutes />
      </Elements>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
