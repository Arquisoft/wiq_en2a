const mongoose = require('mongoose');

// TODO: HACER AQUI LA ENTIDAD GRUPO

const groupSchema = new mongoose.Schema({
    // ...
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group