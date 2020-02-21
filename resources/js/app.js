
require('./bootstrap');


import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';
import '../css/react_vis.css';

import App from './containers/App';
import Login from './containers/Login';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from './store';
import { Router, Route,Switch } from "react-router-dom";
import history from "./history";


ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/app" component={App} />            
            </Switch>    
        </Router>
        
    </Provider>, document.getElementById('root'));


serviceWorker.unregister();

window.store = store;
