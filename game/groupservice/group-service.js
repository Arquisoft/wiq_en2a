const express = require('express');
const mongoose = require('mongoose');
const Group = require('./group-model');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const generateJoinCode = require('./util/GenerateJoinCode');

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

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to group service module' });
});


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


app.post('/join', async (req,res) => {
  try{
    requiredFields = ['uuid','groupName']
    validateRequiredFields(req, requiredFields);
    const group = await getGroupByName(req.body.groupName);

    if(group.members.length == maxNuberUsers){
      res.json({ message: 'This group is full' });
      return;
    }

    group.members.push(req.body.uuid);
    
    await group.save()  

    res.json(user);

  }catch(error){
    res.status(400).json({error: error.message})
  }

});

app.post('/leaveGroup', async (req,res) => {
  try{
    requiredFields = ['expelledUUID','groupName', 'adminUUID']
    validateRequiredFields(req, requiredFields);
    const group = await getGroupByName(req.body.groupName);
    if(req.body.adminUUID != group.admin){
      res.json({ message: 'User is unable to perform this operation' });
      return;
    }
    group.updateOne({ $pull: { members: req.body.uuid } });

    if(group.admin == req.body.uuid){
        group.admin = group.members[0];
    }

    await group.save()  

  }catch(error){
    res.status(400).json({error: error.message})
  }
});

app.post('/create', async (req,res) =>{
  try{

    requiredFields =['groupName','creatorUUID','description','isPublic']
    validateRequiredFields(req,requiredFields);

    res.json({ message: 'Creating Group' });
    let newGroup;
    if(!req.body.isPublic){
      newGroup = new Group({
        admin: req.body.creatorUUID,
        members: [req.body.creatorUUID],
        maxNumUsers: maxNumUsers,
        description: req.body.description,
        isPublic: false,
        creationDate: Date(),
        groupName: req.body.groupName,
        uuid: uuid.v4(),
      })
      await newGroup.save();

    } else {
    const joinCode = generateJoinCode();

    newGroup = new Group({
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
  }
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
