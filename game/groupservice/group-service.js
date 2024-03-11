const express = require('express');
const mongoose = require('mongoose');
const Group = require('./group-model');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const User = require('../../users/userservice/user-service')

const app = express();
const port = 8004; 

const maxNumUsers = 30;



app.use(express.json());

// Connect to MongoDB 
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
mongoose.connect(mongoUri);

// Function to validate required fields in the request body
function validateRequiredFields(req, requiredFields) {
  for (const field of requiredFields) {
    if (!(field in req.body)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

/*
  PETICIONES:
  - unirse: recibe el user y se añade a members, manejar tamaño maximo de grupo y si es publico/privado contraseña
  - salir: recibe el user y se elimina de members (tambien sirve para que el admin expulse expulsar)
  - crear: recibe el user (lo asigna admin), todos los campos de grupo, y se crea el grupo
*/


/**
 * Finds a User in the database by username
 * It check if the user exist
 * @param {username of the user we want to find} name 
 * @returns 
 */
async function getUserByName(name){
  try {
    const user = await User.findOne({username: name});

    if (!group) {
      throw new Error('This user does not exist');
    }

    return group;
  } catch (error) {
    throw new Error(error.message); 
  }
}

/**
 * Finds a Group in the database from the database
 * It check if the group exist
 * @param {groupName of group we want to find} name 
 * @returns 
 */
async function getGroupByName(name) {
  try {
    const group = await Group.findOne({ groupName: name });

    if (!group) {
      throw new Error('This group does not exist');
    }

    return group;
  } catch (error) {
    // Handle the error here
    throw new Error(error.message); 
  }
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});


app.post('/join', async (req,res) => {
  try{
    res.json({ message: 'Joining Group' });
    requiredFields = ['username','groupName','joinCode']
    validateRequiredFields(req, requiredFields);

    try {
      const group = await getGroupByName(req.body.groupName);
      // Use the found group here
      console.log(group);
    } catch (error) {
      // Handle the error here
      console.error(error);
    }

    //checks for telling if the operacion can  be performed

    if(group.members.length == maxNuberUsers){
      res.json({ message2: 'This group is full' });
      return;
    }

    if(!group.isPublic){
      if(group.joinCode != req.body.joinCode){
        res.json({ message2: 'The code for joining this private group' +
         ' is incorrect action has been cancelled' });
        return;
      }
    }

    //User.findOne returns a promise
    const user = getUserByName(req.body.username);

    group.members.push(user.username);
    user.groupName = groupName;

    res.json({ message2: 'User' + userName + ' joined group: '+ groupName });
    
    
    await group.save()  
    await user.save()

    res.json(user);

  }catch(error){
    res.status(400).json({error: error.message})
  }

});

app.post('/leave', async (req,res) => {
  try{
    res.json({ message: 'Leaving Group' });

    requiredFields = ['username','groupName']
    validateRequiredFields(req, requiredFields);
  
    try {
      const group = await getGroupByName(req.body.groupName);
      // Use the found group here
      console.log(group);
    } catch (error) {
      // Handle the error here
      console.error(error);
    }

    if(!group){
      res.status(401).json({ error: 'This group does not exist' });
    }

    try {
      const user = await getGroupByName(req.body.userName);
      // Use the found group here
      console.log(group);
    } catch (error) {
      // Handle the error here
      console.error(error);
    }

    if(!user){
      res.status(401).json({ error: 'This user does not exist' });
    }

    user.groupName = null;
    var index = group.members.at(user.username);
    group.members[index] = null;

    //if the admin leaves the group it must name a new admin
    //before leaving
    if(group.admin == user.name){

      if(index > group.members.length){
        group.admin = group.members[0];

      }else{
        group.admin = group.members[index+1];
      }
      
      
    }
    await group.save()  
    await user.save() 

    res.json({ message2: 'User' + userName + ' left group: '
    + groupName });

    res.json(user);
  }catch(error){
    res.status(400).json({error: error.message})
  }
});

app.post(' /kickUser', async (req,res) =>{
  try{
    res.json({ message: 'Leaving Group' });
    requieredFields = ['username','groupName','adminName']
    validateRequiredFields(req, requiredFields);

    const group = getGroupByName(req.groupName);

    if(group.admin != adminName ){
      res.json({ message2: 'Acion cancelled, only the admin' +
      'is allowed to kick other users'});
      return;
    }
    if(group.admin == username){
      res.json({ message2: 'Acion cancelled, you can not kick the admin'});
      return;
    }

    const user = getUserByName(req.username);

    var index = group.members.at(user.username);
    group.members[index] = null;emoveUserFromGroup(user,group);
    
    res.json({ message2: 'User' + userName + ' has been kicked from group: '
    + groupName });

    res.json(user);
  }catch(error){
    res.status(400).json({error: error.message})
  }
});

app.post('/create', async (req,res) =>{
  try{

    requiredFields =['groupName','adminUserName','description','isPublic']
    validateRequiredFields(req,requiredFields);

    res.json({ message: 'Creating Group' });

    const joinCode = crypto.randomUUID;
    const dateNow = Date();

    var foundingMember = [req.body.adminUserName]; 

    const newGroup = new Group({
      groupName: req.body.groupName,
      admin: req.body.adminUserName,
      members: foundingMember,
      maxNumUsers: maxNumUsers,
      description: req.body.description,
      isPublic: req.body.isPublic,
      joinCode: joinCode,
      creationDate: dateNow,
    });
    
    await newGroup.save();
    res.json(newGroup);

  } catch(error){
    res.status(400).json({error: error.message})
  }

});

const server = app.listen(port, () => {
  console.log(`Group Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
