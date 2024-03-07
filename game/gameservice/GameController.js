let Game = require('./game-model');
const { createGame } = require('./queries/CreateGame');
const mongoose = require('mongoose');

let GameController = {
    /* HACER EN USER - GET LAST GAME BY USER
    findByUsername: async (req, res) => {
        let game = await User.find({username: req.params.username}).populate("lastGame")
        let response = await Game.findById(game[0].lastGame.id).populate("questions").populate("players")
        res.json(response);
    },*/
    create: async (req, res) => {
        const { questions, players } = req.body;
        console.log(questions, players)
        const game = await createGame(questions, players);
        res.json(game);
    },
    delete: async (req, res) => {
        await Game.findOneAndDelete({uuid: req.params.id});
        res.json({message: "Game deleted"});
    },
    getById: async (req, res) => {
        let game = await Game.find({uuid: req.params.id})
        res.json(game);
    }
}

module.exports = GameController;