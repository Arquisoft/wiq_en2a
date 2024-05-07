const { MongoMemoryServer } = require('mongodb-memory-server');



async function startServer() {
    console.log('Starting MongoDB memory server...');
    const mongoserver = await MongoMemoryServer.create();
    const mongoUri = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    require("../../users/userservice/user-service");
    require("../../users/authservice/auth-service");
    require("../../gatewayservice/gateway-service");
    require("../../game/gameservice/gameservice");
    require("../../game/groupservice/group-service");
    require("../../game/qgservice/qg-service");
    require("../../multiplayerservice/server")
  }

  startServer();
