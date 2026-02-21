// configuraciones generales
const express = require('express');
const cors = require ('cors');
const morgan = require('morgan');
const app = express();
const {mongoose} = require('./database');
const {json} = require ('express');

// middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
