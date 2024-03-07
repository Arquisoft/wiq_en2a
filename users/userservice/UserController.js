const User = require('./user-model')

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
    }
    
}

module.exports = UserController;