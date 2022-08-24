const { MongoClient } = require('mongodb');

let mongoClient;

module.exports = {
  connectToClient: (callback) => {
    MongoClient.connect(process.env.MONGO_CLUSTER)
    .then(client => {
      mongoClient = client;
      return callback();
    })
    .catch(err => {
      console.log(err);
      return callback(err);
    })
  },
  getClient: () => mongoClient
}
