require('dotenv').config();
const express = require('express');
const { connectToClient } = require('./config/db');


// init app and middleware
const app = express();
app.use(express.json());


// db connection
connectToClient((err) => {
  if(!err){
    app.listen(process.env.PORT || 3000, () => {
      console.log('app Listening on port 3000')
    })
  }
})



// error handle middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  if(process.env.NODE_ENV === 'production'){
    delete err.stack;
  }
  res.status(err.code || 500).send({
    status: 'FAILED',
    data: {
      error: {
        error: err.message || 'Internal Server Error'
      }
    }

  })
})

// catch 404 error
app.use((req, res) => {
  res.status(404).send({
    status: 404,
    error: 'Not Found'
  })
})



