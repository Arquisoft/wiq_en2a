function generateJoinCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let joinCode = '';
    for (let i = 0; i < 4; i++) {
      joinCode += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return joinCode;
}

module.exports = generateJoinCode;