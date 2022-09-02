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
const collectionName =  'Members';

module.exports = function(){
  function getCollectionCursor(){
    return getClient().db(dbName).collection(collectionName);
  }

  function createMember(user){
    return new Promise(async (resolve, reject) => {
      try {
        const createdMember = await getCollectionCursor().insertOne({ ...user, isApproved: false })
        resolve(createdMember)
      }catch(error){
        reject(error);
      }
    })
  }

  function findMember(query) {
    return new Promise(async (resolve, reject) => {

      try {
       let user = await getCollectionCursor().findOne(query)
       resolve(user)
      }catch(error) {
        reject(error)
      }
    })
  }

  function findMemberById(id){
    return new Promise(async (resolve, reject) => {
      try {
        let user = await getCollectionCursor().findOne({ _id: ObjectId(id)})
        resolve(user)
      } catch(error) {
        reject(error)
      }
    })
  }

  return {
    getCollectionCursor,
    createMember,
    findMember,
    findMemberById
  }
}
