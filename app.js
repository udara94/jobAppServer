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
const postRoute = require('./routes/post');
const authRoute = require('./routes/auth');

//routes middleware
app.use('/api/posts', postRoute);
app.use('/api/user',authRoute);
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
