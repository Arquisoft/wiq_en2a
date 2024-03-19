const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
    },
    groupName: {
        type: String,
        required: true,
        unique: true,
    },
    admin: {
        type: String,
        required: true,
    },
    members:[{
        type: String,
        required: true,
    }],
    maxNumUsers: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false, 
    },
    isPublic: {
        type: Boolean,
        required: true,
    },
    joinCode: {
        type: String,
        required: false,
    },
    creationDate: {
        type: Date,
        default: Date.now,
    }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;