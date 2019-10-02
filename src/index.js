import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import tablePlanReducer from './store/reducers';

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

const previousState = JSON.parse(window.localStorage.getItem('table-plan-ai'));
const store = createStore(tablePlanReducer, previousState ? previousState : undefined, applyMiddleware(thunkMiddleware));

store.subscribe(() => {
    window.localStorage.setItem('table-plan-ai', JSON.stringify(store.getState()));
});

ReactDOM.render(
    <Provider store={store}><App /></Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
