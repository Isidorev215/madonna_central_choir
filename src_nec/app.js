const express = require('express');
const passport = require('passport');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { swaggerDocs: v1SwaggerDocs } = require('./v1/swagger');

// loading env
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

// init app and middleware
const app = express();
// Middlewares
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser());

// mongoose connection (default)
mongoose.connect(process.env.MONGO_CLUSTER, { dbName: 'nec' })
.then(result => console.log('Mongoose default connected'))
.catch(err => console.log(err));

// Swagger documentation
v1SwaggerDocs(app)

// Passport stuff...
require('./v1/config/passportJwtConfig')(passport);
app.use(passport.initialize());


// Routes
app.use('/api/v1', require('./v1/routes/authRoutes'));
app.use('/api/v1', require('./v1/routes/baseRoutes'));

// error handle middleware
app.use((err, req, res, next) => {
  if(process.env.NODE_ENV === 'production'){
    delete err.stack;
  }else{
    console.log(err.stack);
  }
  res.status(err.code || 500).send({
    status: 'FAILED',
    data: {
      error: err.message || 'Internal Server Error',
      details: err.details || []
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

