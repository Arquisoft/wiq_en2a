const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
const parties = {}; 

// Generate a random code for the party
function generatePartyCode() {
  return Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Create a new party
function createParty() {
  const partyCode = generatePartyCode();
  parties[partyCode] = [];
  return partyCode;
}

// Join a party
function joinParty(partyCode, socket) {
  if (parties[partyCode]) {
    parties[partyCode].push(socket);
    return true;
  }
  return false;
}

io.on('connection', socket => {
  console.log('Client connected');

  // Create a new party
  socket.on('createParty', () => {
    const partyCode = createParty();
    socket.emit('partyCreated', partyCode);
  });

  // Join an existing party
  socket.on('joinParty', partyCode, username => {
    const userJoined = joinParty(partyCode, socket);
    if (userJoined) {
      socket.join(partyCode);
      socket.emit('joinedParty', username);
      console.log(`User ${username} joined party: ${partyCode}`);
    } else {
      socket.emit('partyNotFound');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    
    // Remove the socket from all parties
    for (const partyCode in parties) {
      const index = parties[partyCode].indexOf(socket);
      if (index !== -1) {
        parties[partyCode].splice(index, 1);
        console.log(`User left party: ${partyCode}`);
        break; // Assuming user can only be in one party at a time
      }
    }
  });
});

const PORT = process.env.PORT || 8006;
server.listen(PORT, () => {
  console.log(`Multiplayer Service listening at http://localhost:${PORT}`);
});
