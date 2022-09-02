const { getClient } = require('../../../config/clusterConnect');
const { ObjectId } = require('mongodb');

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 61dbae02-c147-4e28-863c-db7bd402b2d6
 *         email:
 *           type: string
 *           example: abc@gmail.com
 *
 */


// collection name here, it is same for all methods in the model
const dbName = 'nec';
const collectionName =  'Admins';

module.exports = function(){
  function getCollectionCursor(){
    return getClient().db(dbName).collection(collectionName);
  }

  function createAdminUser(user){
    return new Promise(async (resolve, reject) => {
      try {
        await getCollectionCursor().insertOne({ ...user, isAdmin: true })
        resolve({ message: 'Admin User Created Successfully'})
      }catch(error){
        reject(error);
      }
    })
  }

  function addPendingMember(member_id){
    return new Promise(async (resolve, reject) => {
      try {
        await getCollectionCursor().updateMany({}, { $push: { pending_nec_members: member_id } })
        resolve({message: 'Member Added, Awaiting Verification'})
      }catch(error){
       reject(error);
      }
    })
  }

  function findAdmin(query) {
    return new Promise(async (resolve, reject) => {
      try {
       let user = await getCollectionCursor().findOne(query)
       resolve(user)
      }catch(error) {
        reject(error)
      }
    })
  }

  function findAdminById(id){
    return new Promise(async (resolve, reject) => {
      try {
        let user = await getCollectionCursor().findOne({ _id: ObjectId(id)})
        resolve(user)
      } catch(error) {
        reject(error)
      }
    })
  }

  return{
    getCollectionCursor,
    createAdminUser,
    findAdmin,
    findAdminById,
    addPendingMember
  }
}

