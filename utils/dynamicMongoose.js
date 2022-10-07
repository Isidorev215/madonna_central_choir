const mongoose = require('mongoose');
const { getClient } = require('../config/clusterConnect');

let client;
let clientName;
let activeDb;

module.exports = {
  // clientListener is used to identify the client (nec vs chapters)
  clientConnect: async function(req, res, next){
    const dbName = req.params.dbName;

    if(!dbName){
      const error = new Error("Missing route parameter 'dbName'")
      error.code = 403;
      return next(error);
    }
    // check to make sure dbName is on database
    try {
      const res = await getClient().db().admin().listDatabases({nameOnly: true})
      let databases = res.databases;

      // chapter has its own db
      if(databases.find(db => db.name === dbName)){

        // make a new db connection
        console.log(`setting db for client - ${dbName}`)
        client = mongoose.createConnection(process.env.MONGO_CLUSTER, { dbName: dbName })
        client.on('connected', function(){
          // if(global.connections)

          /*
            fill in these parts later one...
            We may even change the dynamics of this file
          */
        })

      }else{
        const error = new Error(`${dbName} is not a registered chapter`);
        error.code = 403;
        throw error;
      }
    }catch(error){
      return next(error);
    }
  }
}
