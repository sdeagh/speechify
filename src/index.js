import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css'
import './assets/scss/now-ui-dashboard.css'
import './index.css';
import App from './App';

// import 'paper-kit-2/assets/css/paper-kit.css'

import { BrowserRouter as Router } from 'react-router-dom'


ReactDOM.render(
    <Router>
        <App />
    </Router>, document.getElementById('root'));
