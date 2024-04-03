const uuid = require('uuid');
const generateJoinCode = require('./util/GenerateJoinCode');
const Group = require('./group-model');

const maxNumUsers = 30;

let GroupController = {
    joinGroup: async (req,res) => {
        try{
          requiredFields = ['uuid','groupName']
          validateRequiredFields(req, requiredFields);
          const group = await getGroupByName(req.body.groupName);
      
          if(group.members.includes(req.body.uuid)){
            res.json({ message: 'User is already in this group' });
            return;
          }
      
          if(group.members.length == maxNumUsers){
            res.json({ message: 'This group is full' });
            return;
          }
      
          if(!group.isPublic){
            if(group.joinCode != req.body.joinCode){
              res.json({ message: 'Invalid join code' });
              return;
            }
          }
      
          group.members.push(req.body.uuid);
          
          const response = await group.save()  
      
          res.json(response);
      
        }catch(error){
          console.log(error)
          res.status(400).json({error: error.message})
        }
      
      },
      leaveGroup: async (req,res) => {
        try{
          console.log(req.body)
          requiredFields = ['expelledUUID','groupName', 'adminUUID']
          validateRequiredFields(req, requiredFields);
          const group = await getGroupByName(req.body.groupName);
          console.log(req.body.adminUUID +" - "+ req.body.expelledUUID)
          if(req.body.adminUUID != group.admin && req.body.adminUUID != req.body.expelledUUID){
            console.log("entra en la condicion")
            res.json({ message: 'User is unable to perform this operation' });
            return;
          }
      
          group.members = group.members.filter(member => member != req.body.expelledUUID)
          
          if(group.members.length == 0){
            await group.deleteOne()
            res.json({ message: 'Group deleted' });
            return;
          }

          if(group.admin == req.body.expelledUUID){
              group.admin = group.members.at(0);
          }
      
          const response = await group.save()
          res.json(response); 
      
        }catch(error){
          console.log(error)
          res.status(500).json({error: error.message})
        }
      },
      createGroup: async (req,res) =>{
        try{
      
          requiredFields =['groupName','creatorUUID','description','isPublic']
          validateRequiredFields(req,requiredFields);

          let newGroup;
          if(req.body.isPublic){

            newGroup = new Group({
              admin: req.body.creatorUUID,
              members: [req.body.creatorUUID],
              maxNumUsers: maxNumUsers,
              description: req.body.description,
              isPublic: true,
              creationDate: Date(),
              groupName: req.body.groupName,
              uuid: uuid.v4(),
            })
            await newGroup.save();
      
          } else {
          const joinCode = generateJoinCode();
      
          newGroup = new Group({
            groupName: req.body.groupName,
            admin: req.body.creatorUUID,
            members: [req.body.creatorUUID],
            maxNumUsers: maxNumUsers,
            description: req.body.description,
            isPublic: false,
            joinCode: joinCode,
            creationDate: Date(),
            uuid: uuid.v4(),
          });
          await newGroup.save();
        }
          res.json(newGroup);
      
        } catch(error){
          res.status(500).json({error: error.message})
        }
      
      },
    getGroup: async (req, res) => {
      try{
        const uuid = req.params.uuid
        const group = await Group.findOne({uuid: uuid})
        if(!group){
          res.status(404).json({error: 'Group not found'})
          return;
        }
        res.json(group)
      } catch(error){
        res.status(500).json({error: error.message})
      }
    },
    getGroups: async (req, res) => {
      try{
        // get all the groups
        const groups = await Group.find()
        res.json(groups)
      } catch(error){
        res.status(500).json({error: error.message})
      }
    }
}

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

function validateRequiredFields(req, requiredFields) {
    for (const field of requiredFields) {
        if (!(field in req.body)) {
        throw new Error(`Missing required field: ${field}`);
        }
    }
}

module.exports = GroupController;