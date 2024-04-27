const User = require('../../user-model');


async function createMultipleUsers(nUsers){
    let users = [];
    for (let index = 0; index < nUsers; index++) {
        const newUser = new User({
            username: `User ${index}`,
            uuid: 'valid-uuid',
            password: 'XXXXXXXX'
        });
        users.push(newUser);
        await newUser.save();
    }
    return users;

}

module.exports = createMultipleUsers