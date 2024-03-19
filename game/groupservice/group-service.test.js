const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const app = require('./group-service'); // Replace 'your-app-file' with the filename where your app is defined
const Group = require('./group-model');
const uuid = require('uuid');

let mongoServer;

describe('Group Service API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    });

  afterAll(async () => {
    app.close();
    await mongoServer.stop();
    });

  it('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to group service module');
  });

  it('POST /joinGroup should join a user to a group with valid data', async () => {
    const uuidGroup = uuid.v4();
    const admin = uuid.v4();
    const group = new Group({
      groupName: 'Test Group',
      members: [admin],
      isPublic: true,
      admin: admin,
      uuid: uuidGroup,
      joinCode: '123456',
      description: 'Test group',
      creationDate: Date(),
      maxNumUsers: 10,
    });
    await group.save();

    const newUserUUID = uuid.v4();
    const joinData = {
      uuid: newUserUUID,
      groupName: 'Test Group',
    };

    const res = await request(app)
      .post('/joinGroup')
      .send(joinData)
      .expect(200);

    await Group.findOneAndDelete({uuid: uuidGroup});
    expect(res.body.members).toContain(newUserUUID);
  });

  it('POST /joinGroup should return an error if the user is already in the group', async () => {
    const uuidGroup = uuid.v4();
    const admin = uuid.v4();
    const testUser = uuid.v4();
    const group = new Group({
      groupName: 'Test Group2',
      members: [admin, testUser],
      isPublic: true,
      admin: admin,
      uuid: uuidGroup,
      joinCode: '123456',
      description: 'Test group2',
      creationDate: Date(),
      maxNumUsers: 10,
    });
    await group.save();

    const joinData = {
      uuid: testUser,
      groupName: 'Test Group2',
    };

    const res = await request(app)
      .post('/joinGroup')
      .send(joinData)
      .expect(200);

    await Group.findOneAndDelete({uuid: uuidGroup});
    expect(res.body.message).toBe('User is already in this group');
  });

  it('POST /leaveGroup should remove a user from the group with valid data', async () => {
    const uuidGroup = uuid.v4();
    const admin = uuid.v4();
    const testUser = uuid.v4();
    const group = new Group({
      groupName: 'Test Group2',
      members: [admin, testUser],
      isPublic: true,
      admin: admin,
      uuid: uuidGroup,
      joinCode: '123456',
      description: 'Test group2',
      creationDate: Date(),
      maxNumUsers: 10,
    });
    await group.save();

    const leaveData = {
      expelledUUID: testUser,
      groupName: 'Test Group2',
      adminUUID: admin
    };

    const res = await request(app)
      .post('/leaveGroup')
      .send(leaveData)
      .expect(200);

    await Group.findOneAndDelete({uuid: uuidGroup});
    expect(res.body.members).not.toContain(testUser);
  });

  it('POST /leaveGroup should assign a new admin if the expelled user was the admin', async () => {
    const uuidGroup = uuid.v4();
    const admin = uuid.v4();
    const testUser = uuid.v4();
    const group = new Group({
      groupName: 'Test Group2',
      members: [admin, testUser],
      isPublic: true,
      admin: admin,
      uuid: uuidGroup,
      joinCode: '123456',
      description: 'Test group2',
      creationDate: Date(),
      maxNumUsers: 10,
    });
    await group.save();

    const leaveData = {
      expelledUUID: admin,
      groupName: 'Test Group2',
      adminUUID: admin
    };

    const res = await request(app)
      .post('/leaveGroup')
      .send(leaveData)
      .expect(200);

    await Group.findOneAndDelete({uuid: uuidGroup});
    expect(res.body.members).not.toContain(admin);
    expect(res.body.admin).toBe(testUser);
  });

  it('POST /createGroup should create a public group with valid data', async () => {
    const admin = uuid.v4();
    const groupData = {
      groupName: 'Public Test Group',
      creatorUUID: admin,
      description: 'This is a public test group',
      isPublic: true
    };

    const res = await request(app)
      .post('/createGroup')
      .send(groupData)
      .expect(200);

    await Group.findOneAndDelete({uuid: res.body.uuid}); // Delete the group after testing
    expect(res.body.groupName).toBe(groupData.groupName);
    expect(res.body.admin).toBe(groupData.creatorUUID);
    expect(res.body.members).toContain(groupData.creatorUUID);
    expect(res.body.isPublic).toBe(true);
    
  });
});