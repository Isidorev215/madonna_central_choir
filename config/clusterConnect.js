const { MongoClient } = require('mongodb');

let dbClient;

module.exports = {
  connectToCluster: (callback) => {
    MongoClient.connect(`${process.env.MONGO_CLUSTER}`)
    .then(client => {
      dbClient = client;
      return callback();
    })
    .catch(err => {
      console.log(err);
      return callback(err);
    })
  },
  getClient: () => dbClient,
}
