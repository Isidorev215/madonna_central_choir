const express = require('express');
const { connectToDb } = require('./v1/config/dbConnect');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');


// loading env
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}


// init app and middleware
const app = express();

// db connection
connectToDb((err) => {
  if(!err){
    console.log('Nec App Connected')
    // app.listen(process.env.PORT || 3000, () => {
    //   console.log('app Listening on port 3000')
    // })
  }
})

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.PASSPORT_SECRET,
  resave: true,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/api/v1', require('./v1/routes/userRoutes'));

// error handle middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  if(process.env.NODE_ENV === 'production'){
    delete err.stack;
  }
  res.status(err.code || 500).send({
    status: 'FAILED',
    data: {
      message: err.message || 'Internal Server Error',
      details: err.details || ''
    }

  })
})

// catch 404 error
app.use((req, res) => {
  res.status(404).send({
    status: 'FAILED',
    data: {
      error: 'Not Found'
    }
  })
})

module.exports = app;

