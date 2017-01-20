import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {ProgressBarsContainer} from './src/components';
import axios from 'axios';

ReactDOM.render(<ProgressBarsContainer http={axios}/>, document.querySelector('#root'));
