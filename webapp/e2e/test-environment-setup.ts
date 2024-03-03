import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoserver: MongoMemoryServer | undefined;

async function startServer(): Promise<void> {
    console.log('Starting MongoDB memory server...');
    mongoserver = await MongoMemoryServer.create();
    const mongoUri: string = mongoserver.getUri();
    process.env.MONGODB_URI = mongoUri;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let userservice: any | undefined = await import("../../users/userservice/user-service");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let authservice: any | undefined = await import("../../users/authservice/auth-service");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let gatewayservice: any | undefined = await import("../../gatewayservice/gateway-service");
}

startServer();
