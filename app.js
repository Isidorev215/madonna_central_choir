const express = require('express');
const vhost = require('vhost');
const cors = require('cors');
const apiApp = require('./src/app');
const { connectToCluster } = require('./config/clusterConnect');

// loading env
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
  origin: process.env.CORS_ALLOWED_ORIGIN,
  credentials: true
}));

// dbClient connection
connectToCluster((err) => {
  if(!err){
    console.log(`Mongo native driver connected to cluster`)
    app.listen(PORT, () => {
      console.log(`App listening at http://${process.env.SERVER_DOMAIN}:${PORT}`)
    })
  }
})

app.set("subdomain offset", 1);

app.use(vhost( `${process.env.SUBDOMAIN_API}.${process.env.SERVER_DOMAIN}`, apiApp ));


