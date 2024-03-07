const User = require('./user-model')
const validateRequiredFields = require('./util/ValidateAddUser');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

let UserController = {
    updateLastGame: async (req, res) => {
        const { gameUUID, players } = req.body;

        for (const p of players) {
            try {
                const user = await User.findOne({ uuid: p.uuid });
    
                if (user) {
                    user.lastGameId = gameUUID;
                    await user.save();
                } else {
                    console.error(`User with UUID ${p.uuid} not found.`);
                }
            } catch (error) {
                console.error(`Error updating last game for user with UUID ${p.uuid}: ${error.message}`);
            }
        }
    
        const nPlayers = players.length;
        res.json({ "message": `Last game updated for ${nPlayers} users.` });
    },
    addUser: async (req, res) => {
        try {
            validateRequiredFields(req, ['username', 'password']);
    
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
            const id = uuid.v4();
            console.log(id);
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
        console.log(players);
        for (const p of players) {
            try {
                const user = await User.findOne({ uuid: p.uuid });
                console.log(user)
                console.log(p)
                if (user) {
                    user.nCorrectAnswers = user.nCorrectAnswers + p.nCorrectAnswers;
                    user.nWrongAnswers = user.nWrongAnswers + p.nWrongAnswers;
                    user.totalScore = user.totalScore + p.totalScore;
                    p.isWinner ? user.nWins++ : null;
                    await user.save();
                } else {
                    console.error(`User with UUID ${p.uuid} not found.`);
                }
            } catch (error) {
                console.error(`Error updating statistics for user with UUID ${p.uuid}: ${error.message}`);
            }
        }
        const nPlayers = players.length;
        res.json({ "message": `Statistics updated for ${nPlayers} users.` });
    },
    getStatistics: async (req, res) => {
        const uuid = req.params.id;
        const user = await User.findOne({ uuid: uuid }).select('-password');
        res.json(user);
    }
    
}

module.exports = UserController;