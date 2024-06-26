let Game = require('./game-model');
const { createGame } = require('./queries/CreateGame');

let GameController = {
    /* HACER EN USER - GET LAST GAME BY USER
    findByUsername: async (req, res) => {
        let game = await User.find({username: req.params.username}).populate("lastGame")
        let response = await Game.findById(game[0].lastGame.id).populate("questions").populate("players")
        res.json(response);
    },*/
    create: async (req, res) => {
        try{
            const { questions, players } = req.body;
            const game = await createGame(questions, players);
            res.json(game);
        } catch(error){
            res.status(500).json({ message: error.message });
        }
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