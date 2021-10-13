import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { rootReducer } from './root.reducer'
import { rootSaga } from './root.saga'
import logger from 'redux-logger';

// create the saga middleware
export const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

// mount it on the Store
if(process.env.REACT_APP_SERVE!=='PROD'){
    middlewares.push(logger);
}
export const store = createStore(rootReducer, applyMiddleware(...middlewares));

// Begin our Index Saga
sagaMiddleware.run(rootSaga);