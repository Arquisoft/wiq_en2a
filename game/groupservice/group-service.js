const express = require('express');
const mongoose = require('mongoose');
const Group = require('./group-model');
const bodyParser = require('body-parser');

const app = express();
const port = 8004; 

const maxNuberUsers = 30;


app.use(bodyParser.json());

// Connect to MongoDB 
// const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/userdb';
// mongoose.connect(mongoUri);

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
 * 
 * @param {nome of the user we want to find} name 
 * @returns 
 */
async function getUserByName(name){
  const user = await User.findOne({username: req.username})
  return user;
}

async function getGroupByName(groupName){
  const group = await Group.findOne({groupName: req.username})
  return group;
}

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});


app.post('/join', async (req,res,requiredFields) => {
  try{
    res.json({ message: 'Joining Group' });
    //requieredFields = ['username','groupName']
    validateRequiredFields(req, requiredFields);

    //Group.findOne returns a promise
    //To obtain a Group object we return it in a diferent
    const group = getGroupByName(req.groupName);

    if(group.numberOfUsers == maxNuberUsers){
      res.json({ message2: 'This group is full' });
      return;
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

    //Group.findOne returns a promise
    //To obtain a Group object we return it in a diferent
    const group = getGroupByName(req.groupName);

    group.numberOfUsers -= 1;

    //User.findOne returns a promise
    //To obtain a User object we return it in a diferent
    const user = getUserByName(req.username);

    user.groupName = null;
    res.json({ message2: 'User' + userName + ' left group: '
      + groupName });
    
    await group.save()  
    await user.save()

  }catch(error){
    res.status(400).json({error: error.message})
  }
});

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
