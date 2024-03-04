const express = require('express');
const mongoose = require('mongoose');
const Group = require('./group-model');
const bodyParser = require('body-parser');

const app = express();
const port = 8004; 

const maxNuberUsers = 30;


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
async function getUserByName(res,name){
  const user = await User.findOne({username: name})

  if(!user){
    res.status(401).json({ error: 'This user does not exist' });
  }
  return user;
}

/**
 * Finds a Group in the database from the database
 * It check if the group exist
 * @param {groupName of group we want to find} name 
 * @returns 
 */
async function getGroupByName(name){
  const group = await Group.findOne({groupName: name})
  
  if(!group){
    res.status(401).json({ error: 'This group does not exist' });
  }
  return group;
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});


app.post('/join', async (req,res,requiredFields) => {
  try{
    res.json({ message: 'Joining Group' });
    //requieredFields = ['username','groupName','joinCode']
    validateRequiredFields(req, requiredFields);

    //Group.findOne returns a promise
    //To obtain a Group object we return it in a diferent
    const group = getGroupByName(req.groupName);


    //checks for telling if the operacion can  be performedWW

    if(group.numberOfUsers == maxNuberUsers){
      res.json({ message2: 'This group is full' });
      return;
    }

    if(!group.isPublic){
      if(group.joinCode != joinCode){
        res.json({ message2: 'The code for joining this private group' +
         ' is incorrect action has been cancelled' });
        return;
      }
    }

    //User.findOne returns a promise
    //To obtain a User object we return it in a diferent
    const user = getUserByName(req.username);

    group.numberOfUsers += 1;

    user.groupName = groupName;
    res.json({ message2: 'User' + userName + ' joined group: '+ groupName });
    
    await group.save()  
    await user.save()

  }catch(error){
    res.status(400).json({error: error.message})
  }

});

app.post('/leave', async (req,res,requiredFields) => {
  try{
    res.json({ message: 'Leaving Group' });

    //requieredFields = ['username','groupName']
    validateRequiredFields(req, requiredFields);
  
    const group = getGroupByName(req.groupName);

    if(!group){
      res.status(401).json({ error: 'This group does not exist' });
    }

    const user = getUserByName(req.username);

    if(!user){
      res.status(401).json({ error: 'This user does not exist' });
    }

    //if the admin leaves the group it must name a new admin
    //before leaving
    if(group.admin == user.name){
      validateRequiredFields(['newAdmin'], requiredFields);
      group.numberOfUsers -= 1;

      user.groupName = null;

      group.admin = req.newAdmin
      
      
    }else{
      group.numberOfUsers -= 1;

      user.groupName = null;
    }
    
    await group.save()  
    await user.save() 

    res.json({ message2: 'User' + userName + ' left group: '
    + groupName });
  }catch(error){
    res.status(400).json({error: error.message})
  }
});

app.post(' /kickUser', async (req,res,requiredFields) =>{
  try{
    res.json({ message: 'Leaving Group' });
    //requieredFields = ['username','groupName','adminName']
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

    removeUserFromGroup(user,group);
    res.json({ message2: 'User' + userName + ' has been kicked from group: '
    + groupName });
  }catch(error){
    res.status(400).json({error: error.message})
  }
});

app.post

app.post('/create', async (req,requiredFields) =>{
  try{

    //required fields =['groupName','adminUserName','description','isPublic']
    validateRequiredFields(req,requiredFields);

    res.json({ message: 'Creating Group' });

    const joinCode = crypto.randomUUID;
    const dateNow = Date();

    const newGroup = new Group({
      groupName: req.body.groupName,
      admin: req.body.adminUserName,
      maxNuberUsers: maxNuberUsers,
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

app.put('/')

const server = app.listen(port, () => {
  console.log(`Group Service listening at http://localhost:${port}`);
});

server.on('close', () => {
    // Close the Mongoose connection
    mongoose.connection.close();
  });

module.exports = server
