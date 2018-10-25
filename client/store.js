import { createStore,applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import loggingMiddleware from 'redux-logger';
import getData from './redux/getData';


const store = createStore(
    getData,
    composeWithDevTools(applyMiddleware(
        thunkMiddleware,
        loggingMiddleware
    ))
);

export default store;