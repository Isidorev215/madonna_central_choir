const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info:
    { title: 'MCC API',
      version: "1.0.0",
      description: 'Nec app served on a subdomain',
      contact: {
        name: 'Highlord Isidore'
      },
      servers: [`http://${process.env.SUBDOMAIN_ONE}.${process.env.SERVER_DOMAIN}:${process.env.PORT || 3000}/api/v1`]
    }
  },
  apis: ['./src/nec/v1/routes/*.js', './src/nec/v1/models/UsersModel.js'],
}

const swaggerSpec = swaggerJSDoc(options);

const swaggerDocs = (app) => {
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  })
  console.log(`Version 1 Docs are available on http://${process.env.SUBDOMAIN_ONE}.${process.env.SERVER_DOMAIN}:${process.env.PORT || 3000}/api/v1/docs`)
}

module.exports = { swaggerDocs };
