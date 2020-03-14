const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); 
require('dotenv/config');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

//imports routes
const authRoute = require('./api/routes/authRoute');
const jobsRoute = require('./api/routes/jobsRoute');
const jobTypesRoute = require('./api/routes/jobTypesRoute');
const jobFavRoute = require('./api/routes/favJobsRoute');
const fcmRoute = require('./api/routes/fcmRoute');

//routes middleware
app.use('/api/user',authRoute);
app.use('/api/jobs',jobsRoute);
app.use('/api/jobtypes',jobTypesRoute);
app.use('/api/favjobs', jobFavRoute);
app.use('/api/fcm', fcmRoute);

//ROUTES
app.get('/',(req, res)=>{
    res.send('we are about to begin');
})


//connect to db
mongoose.connect(process.env.DB_CONNECTION, 
{ useNewUrlParser: true,
    useUnifiedTopology: true },
 ()=>{
    console.log('connected to db')
});

//listen
app.listen(process.env.PORT ||3000, ()=> console.log("server is up"));
