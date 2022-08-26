const { getDb } = require('../config/dbConnect');
const { ObjectId } = require('mongodb')

function UsersModel(){

  // collection name here, it is same for all methods in the model
  const collectionName = 'Users';

  function createFirstUserAsAdmin(user){
    return new Promise(async (resolve, reject) => {

      const collection = getDb().collection(collectionName);

      try {
        let documentCount = await collection.estimatedDocumentCount({})
        if(documentCount === 0){
          await collection.insertOne({ ...user, isAdmin: true })
          resolve({ message: 'Admin User Created Successfully'})
        }else{
          let admin = await collection.findOne({ isAdmin: true })
          await collection.updateOne({_id: ObjectId(admin._id)}, { $push: { pendingUsers: { ...user, isAdmin: false} }})
          resolve({message: 'User Successfully Added, Awaiting verification'})
        }

      }catch(error){
        reject(error)
      }
    })
  }

  function findUser(query){
    return new Promise(async (resolve, reject) => {

      const collection = getDb().collection(collectionName);

      try {
       let user = await collection.findOne(query)
       resolve(user)
      }catch(error) {
        reject(error)
      }
    })
  }

  return {
    createFirstUserAsAdmin,
    findUser
  }
}


module.exports = UsersModel;
