let Game = require('./game-model');
let { userSchema } = require('../../users/userservice/user-model');
const {question4AnswersSchema} = require("../qgservice/Question4Answers");
const { createGame } = require('./gameLogic');
const mongoose = require('mongoose');

const User = mongoose.model('User', userSchema);
const Question4Answers = mongoose.model('Question4Answers', question4AnswersSchema);

let GameController = {
    findByUsername: async (req, res) => {
        let game = await User.find({username: req.params.username}).populate("lastGame")
        let response = await Game.findById(game[0].lastGame.id).populate("questions").populate("players")
        res.json(response);
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