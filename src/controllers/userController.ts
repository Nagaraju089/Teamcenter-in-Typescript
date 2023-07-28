import User from '../models/users'
import {  getKey } from '../databases/redisDB'
import { v4 as uuidv4 } from 'uuid'
import  { Request, Response, NextFunction } from "express";



export async function getUsers(req:Request, res:Response) {
    try {
      const users = await User.findAll({
          attributes: ['name', 'email', 'isActive', 'Role','Photo', 'userType']
          
      });
  
      res.send({
        status:1,
        users
      });
    } catch (error) {
      console.error('Failed to fetch users:', error);
      res.status(500).json({ 
        status: 0,
        message: 'Failed to fetch users.' });
    }
  }
  
export async function generateUuid(req:Request, res:Response, next:NextFunction) {
  try{

  const uuid = uuidv4();

  if(uuid) {

    req.headers['uuid'] = uuid;
    next();
  }
}catch(error) {
  res.send({
    message: "Cannot generate uuid"
  })
}

}


 export async function addUser(req:Request, res:Response) {
    const {  name, email,  Role, userType } = req.body;
    //console.log(req.file);
   const uuid =  req.headers['uuid'];
    try {

        

      if (!req.file) {
        return res.send({ 
          status: 0,
          error: 'No file uploaded from add user' });
      }
 
        const file = req.file.originalname;
        const photoPath = `/photos/${uuid+'_'  +file}`;
        
            
      const user = await User.create({

        user_id: uuid as string,
        name,
        email,
        Role,
        userType,
        photo: photoPath
      });

      res.send({

        message: "success",
        user
      })

    } catch (error) {
      console.error('Failed to add user:', error);
      res.status(500).json({ 
        status: 0,
        message: 'Failed to add user.' });
    }

  }


 export async function updatePhoto(req:Request, res:Response, next:NextFunction) {
    try {

       const token = req.headers.authorization?.split(' ')[1];
         let data = await getKey(token);
        let redisValue = JSON.parse(data as string);
        const userId = redisValue.userData.user_id;
        console.log(userId)
       // const uuid = req.headers['uuid'];

     // const uuid = req.headers['uuid'];


     if (!req.file) {
     return res.status(400).json({ 
      status: 0,
      error: 'No file uploaded' }); 
    }  
    
       const photoPath = `/photos/${userId+'_' +req.file.originalname}`;

       await User.update({photo: photoPath},
        {
          where :{
            user_id: userId
          }
      })   

      res.send({ 
        status: 1,
        message: "Success"})
    }
    catch(error) {
      console.error('Failed to upload photo:', error);
      res.status(500).json({ 
        status: 0,
        error: 'Failed to upload photo' });
    }
    next();
  }


 export async function userDetails(req:Request, res:Response, next:NextFunction) {

    
 
     let token = req.headers.authorization?.split(' ')[1];

      console.log(token);

      let data = await getKey(token);

      let redisValue = JSON.parse(data as string);
      
    const user_name = redisValue.userData.name;
    const role = redisValue.userData.Role;
    const email = redisValue.userData.email
    const photo = redisValue.userData.photo;

    
    res.send({
      status: 1,
      user_name,
      role,
      email,
      photo
    })
    

  
  }

//   module.exports = {
//     getUsers,
//     generateUuid,
//     addUser,  updatePhoto, userDetails
//   };
  