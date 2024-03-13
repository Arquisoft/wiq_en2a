const User = require('./user-model')
const validateRequiredFields = require('./util/ValidateAddUser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const isValidUuidV4 = require('./util/ValidateUUID');

let UserController = {
    updateLastGame: async (req, res) => {
      const { gameUUID, players } = req.body;
    
      for (const p of players) {
        try {
          const isValid = isValidUuidV4(p.uuid);
          if (!isValid) {
            throw new Error(`Invalid UUID provided`);
          }

          const requiredFields = ['uuid'];
          const missingFields = requiredFields.filter(field => !p.hasOwnProperty(field));
          if (missingFields.length > 0) {
            throw new Error(`Missing required fields in player object: ${missingFields.join(', ')}`);
          }
          
          const user = await User.findOne({ uuid: p.uuid }); 
    
          if (user) {
            user.lastGameId = gameUUID;
            await user.save();
          } else {
            throw new Error(`User with UUID ${p.uuid} not found`); 
          }
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
      }
    
      const nPlayers = players.length;
      res.json({ message: `Last game updated for ${nPlayers} users.` });
    },
    addUser: async (req, res) => {
        try {
            validateRequiredFields(req, ['username', 'password']);
    
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
            const id = uuid.v4();
            const newUser = new User({
                uuid: id,
                username: req.body.username,
                password: hashedPassword,
                nCorrectAnswers: 0,
                nWrongAnswers: 0,
                totalScore: 0,
                nWins: 0
            });
    
            await newUser.save();
            res.json(newUser);
        } catch (error) {
            res.status(400).json({ error: error.message }); 
        }
    },
    updateStatistics: async (req, res) => {
        const { players } = req.body;
      
        for (const p of players) {
          try {
            // Validate UUID first
            const isValid = isValidUuidV4(p.uuid);
            if (!isValid) {
                throw new Error(`Invalid UUID`);
            }
      
            // Validate required player data
            const requiredFields = ['nCorrectAnswers', 'nWrongAnswers', 'totalScore'];
            const missingFields = requiredFields.filter(field => !p.hasOwnProperty(field));
            if (missingFields.length > 0) {
              throw new Error(`Missing required fields in player object: ${missingFields.join(', ')}`);
            }
      
            const user = await User.findOne({ uuid: p.uuid });
            if (user) {
              // Update user statistics
              user.nCorrectAnswers += p.nCorrectAnswers;
              user.nWrongAnswers += p.nWrongAnswers;
              user.totalScore += p.totalScore;
              if (p.isWinner) {
                user.nWins++;
              }
              await user.save();
            } else {
              console.error(`User with UUID ${p.uuid} not found.`);
            }
          } catch (error) {
            console.error(`Error updating statistics for user with UUID ${p.uuid}: ${error.message}`);
            return res.status(400).json({ error: error.message });
          }
        }
      
        const nPlayers = players.length;
        res.json({ "message": `Statistics updated for ${nPlayers} users.` });
      },
    getStatistics: async (req, res) => {
        const uuid = req.params.id;
        const user = await User.findOne({ uuid: uuid }).select('-password');
        res.json(user);
    },
    getUserByUsername: async (req, res) => {
        const username = req.params.username;
        const user = await User.findOne({ username: username }).select('-password');
        res.json(user);
    },
    addGroupToUser: async (req, res) => {
      const { groupUUID } = req.body;
      const { userUUID } = req.params;
      const user = await User.findOne({ uuid: userUUID });
      let previousGroup;
      if (user) {
        previousGroup = user.groupId;
        user.groupId = groupUUID;
        await user.save();
      } else {
        throw new Error(`User with UUID ${p.uuid} not found`); 
      }
      const response = {
        previousGroup: previousGroup,
      }
      res.json(response);
    },
    getUserById: async (req, res) => {
      console.log(req.params)
      const userId = req.params.id;
      console.log(userId)
      const user = await User.findOne({ uuid: userId });
      res.json(user);
    },
    getUsersByIds: async (req, res) => {
      const userIds = req.body.userIds;
      const users = [];
      for(const id of userIds){
        console.log(id)
        const user = await User.findOne({ uuid: id });
        users.push(user);
      }
      res.json(users);
    }
    
}

module.exports = UserController;