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

const lobby = {};

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

const updateLobbyUsers = (lobbyCode) => {
  io.to(lobbyCode).emit('lobbyUsers', Object.values(lobby[lobbyCode]));
};

io.on('connection', socket => {
  console.log('Client connected');

  // Create a new party
  socket.on('createParty', (username) => {
    const partyCode = createParty();
    lobby[partyCode] = { [socket.id]: username };
    socket.join(partyCode);
    socket.emit('partyCreated', partyCode);
    updateLobbyUsers(partyCode);
  });

  // Join an existing party
  socket.on('joinParty', (partyCode, username) => {
    if (lobby[partyCode]) {
      if (Object.keys(lobby[partyCode]).length >= 4) {
        socket.emit('partyFull');
      } else {
        lobby[partyCode][socket.id] = username;
        socket.join(partyCode);
        socket.emit('joinedParty', username);
        updateLobbyUsers(partyCode);
        console.log(`User ${username} joined party: ${partyCode}`);
      }
    } else {
      socket.emit('partyNotFound');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Remove the user from the lobby when they disconnect
    for (const partyCode in lobby) {
      if (lobby[partyCode][socket.id]) {
        delete lobby[partyCode][socket.id];
        updateLobbyUsers(partyCode);
      }
    }
  });
});

const PORT = process.env.PORT || 8006;
server.listen(PORT, () => {
  console.log(`Multiplayer Service listening at http://localhost:${PORT}`);
});
