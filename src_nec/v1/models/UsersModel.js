const { getClient } = require('../../../config/clusterConnect');
const { ObjectId } = require('mongodb')

// collection name here, it is same for all methods in the model
const dbName = 'nec';
const collectionName =  'Users';

module.exports = function(){

  function createFirstUserAsAdmin(user) {
    return new Promise(async (resolve, reject) => {

      const collection = getClient().db(dbName).collection(collectionName);

      try {
        let documentCount = await collection.estimatedDocumentCount({})
        if(documentCount === 0){
          await collection.insertOne({ ...user, isAdmin: true })
          resolve({ message: 'Admin User Created Successfully'})
        }else{
          let admin = await collection.findOne({ isAdmin: true })
          await collection.updateOne({_id: ObjectId(admin._id)}, { $push: { pending_members_nec: { ...user, isAdmin: false} }})
          resolve({message: 'User Successfully Added, Awaiting verification'})
        }

      }catch(error){
        reject(error)
      }
    })
  };

  function findUser(query) {
    return new Promise(async (resolve, reject) => {

      const collection = getClient().db(dbName).collection(collectionName);

      try {
       let user = await collection.findOne(query)
       resolve(user)
      }catch(error) {
        reject(error)
      }
    })
  }

  function findUserbyId(id){
    return new Promise(async (resolve, reject) => {

      const collection = getClient().db(dbName).collection(collectionName)
      try {
        let user = await collection.findOne({ _id: ObjectId(id)})
        resolve(user)
      } catch(error) {
        reject(error)
      }
    })
  }

  return{
    createFirstUserAsAdmin,
    findUser,
    findUserbyId
  }
}

