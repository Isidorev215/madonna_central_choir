const express = require('express');
const vhost = require('vhost');
const cors = require('cors');
const nec_app = require('./src_nec/app');
const { connectToCluster } = require('./config/clusterConnect');

// loading env
if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true
}));

// dbClient connection
connectToCluster((err) => {
  if(!err){
    app.listen(PORT, () => {
      console.log(`App listening at http://${process.env.SERVER_DOMAIN}:${PORT}`)
    })
  }
})

app.set("subdomain offset", 1);

app.use(vhost( `${process.env.SUBDOMAIN_ONE}.${process.env.SERVER_DOMAIN}`, nec_app ));


