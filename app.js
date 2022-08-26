const express = require('express');
const vhost = require('vhost');
const nec_app = require('./src_nec/app');
const { connectToCluster } = require('./config/clusterConnect');

const PORT = process.env.PORT || 3000;

const app = express();

// dbClient connection
connectToCluster((err) => {
  if(!err){
    app.listen(PORT, () => {
      console.log(`App listening at http://mysite.local:${PORT}`)
    })
  }
})

app.set("subdomain offset", 1);

app.use(vhost( "sub1.mysite.local", nec_app ));


