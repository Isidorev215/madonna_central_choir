const { getClient } = require('../../../config/clusterConnect');
const { ObjectId } = require('mongodb');

const dbName = 'nec';

module.exports = function(){
  function findUserById(collectionName, id){
    return new Promise(async(resolve, reject) => {
      const collectionCursor = getClient().db(dbName).collection(collectionName);

      try {
        const user = await collectionCursor.findOne({ _id: ObjectId(id)})
        resolve(user);
      } catch (error) {
        reject(error);
      }
    })
  }

  return {
    findUserById
  }
}
