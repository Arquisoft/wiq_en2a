const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: Date,
    groupName: String 
});

const User = mongoose.model('User', userSchema);

module.exports = User