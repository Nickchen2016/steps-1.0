const express = require('express');
// const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('../secret');

const data = require('./api/data');
const record = require('./api/record');


const app = express();
const port = process.env.PORT || 5000;

mongoose.connect(
    'mongodb+srv://nick:'+process.env.PASS+'@steps-2svp6.mongodb.net/test?retryWrites=true'
    ,{
    useMongoClient: true
})

app.use(volleyball);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/data', data);
app.use('/record', record);

app.get('/', (req,res)=>{
    res.send('Hello from express');
});

app.listen(port, ()=> console.log(`Listening on port ${port}`));