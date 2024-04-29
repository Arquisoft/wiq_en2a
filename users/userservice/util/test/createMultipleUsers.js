const User = require('../../user-model');


async function createMultipleUsers(nUsers){
    let users = [];
    for (let index = 0; index < nUsers; index++) {
        const newUser = new User({
            username: `User ${index}`,
            uuid: '550e8400-e29b-41d4-a716-446655440000',
            password: 'XXXXXXXX'
        });
        users.push(newUser);
        await newUser.save();
    }
    return users;

}

module.exports = createMultipleUsers