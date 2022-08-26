const express = require('express');
const vhost = require('vhost');
const nec_app = require('./src_nec/app')

const PORT = process.env.PORT || 3000;

const app = express();
app.set("subdomain offset", 1);

app.use(vhost( "sub1.mysite.local", nec_app ));

app.listen(PORT, () => {
  console.log(`App listening at http://mysite.local:${PORT}`)
})
