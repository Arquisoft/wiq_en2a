let Game = require('./game-model');
let User = require('../../users/userservice/user-model');
const { createGame } = require('./gameLogic');


let GameController = {
    findByUsername: async (req, res) => {
        let game = await User.find({user: req.params.username}).populate("lastgame");
        res.json(game);
    },
    create: async (req, res) => {
        const { questions, users } = req.body;
        const game = await createGame(questions, users);
        res.json(game);
    },
    delete: async (req, res) => {
        await Game.findByIdAndDelete(req.params.id);
        res.json({message: "Game deleted"});
    }
}

module.exports = GameController;