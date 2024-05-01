const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Group = require('./group-model');

let mongoServer;
let app;

describe('Group Service API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./group-service'); 
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

  it('should create a group when all required fields are provided public group', async () => {
      // Prepare request body with all required fields
      const requestBody = {
          groupName: 'Test Group1',
          creatorUUID: 'creator_id1',
          description: 'Test description',
          isPublic: true
      };

      const response = await request(app).post('/createGroup').send(requestBody);
      expect(response.status).toBe(200);

      // Expect response body to contain the created group
      expect(response.body).toHaveProperty('groupName', requestBody.groupName);
      expect(response.body).toHaveProperty('admin', requestBody.creatorUUID);
      expect(response.body).toHaveProperty('description', requestBody.description);
      expect(response.body).toHaveProperty('isPublic', requestBody.isPublic);
      expect(response.body).toHaveProperty('uuid');
  });

  it('should create a group when all required fields are provided private group', async () => {
    // Prepare request body with all required fields
    const requestBody = {
        groupName: 'Test Group2',
        creatorUUID: 'creator_id2',
        description: 'Test description',
        isPublic: false
    };

    const response = await request(app).post('/createGroup').send(requestBody);
    expect(response.status).toBe(200);

    // Expect response body to contain the created group
    expect(response.body).toHaveProperty('groupName', requestBody.groupName);
    expect(response.body).toHaveProperty('admin', requestBody.creatorUUID);
    expect(response.body).toHaveProperty('description', requestBody.description);
    expect(response.body).toHaveProperty('isPublic', requestBody.isPublic);
    expect(response.body).toHaveProperty('uuid');
    expect(response.body).toHaveProperty('joinCode');
});

  it('should return status 500 when one or more required fields are missing', async () => {
      const requestBody = {
          groupName: 'Test Group',
          creatorUUID: 'creator_id',
      };

      const response = await request(app).post('/createGroup').send(requestBody);
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error', expect.stringContaining('Missing required field'));
  });

  it('should successfully add user to the group', async () => {
    const group = await Group.create({
        uuid: 'successfully_added_group_uuid',
        groupName: 'Succesfully added Test Group',
        admin: 'admin_id',
        members: ['admin_id'],
        maxNumUsers: 5,
        isPublic: true,
    });

    const requestBody = {
        uuid: 'user_to_join_uuid',
        groupName: 'Succesfully added Test Group',
    };

    const response = await request(app).post('/joingroup').send(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('members');
    expect(response.body.members).toContain(requestBody.uuid);
});

it('should return message when user is already in the group', async () => {
    const group = await Group.create({
        uuid: 'user_already_in_group_uuid',
        groupName: 'User already in group Test Group',
        members: ['userInGroup_id', 'admin_id'],
        admin: 'admin_id',
        maxNumUsers: 5,
        isPublic: true
    });

    const requestBody = {
        uuid: 'userInGroup_id',
        groupName: 'User already in group Test Group'
    };

    const response = await request(app).post('/joingroup').send(requestBody);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User is already in this group' });
});

it('should return message when group is full', async () => {
  const group = await Group.create({
      uuid: 'full_group_uuid',
      groupName: 'Full group Test Group',
      members: Array(30).fill("member_uuid"),
      admin: 'admin_id',
      maxNumUsers: 30,
      isPublic: true,
  });

  const requestBody = {
      uuid: 'userToJoinFullGroup_id',
      groupName: 'Full group Test Group'
  };

  const response = await request(app).post('/joingroup').send(requestBody);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'This group is full' });
});

it('should return message when join code is incorrect for a private group', async () => {
  const group = await Group.create({
      uuid: 'incorrect_join_code_group_uuid',
      groupName: 'Test Group Incorrect Join Code',
      members: ['admin_id'],
      maxNumUsers: 5,
      admin: 'admin_id',
      isPublic: false,
      joinCode: 'correct_join_code'
  });

  const requestBody = {
      uuid: 'user_id',
      groupName: 'Test Group Incorrect Join Code',
      joinCode: 'incorrect_join_code'
  };

  const response = await request(app).post('/joingroup').send(requestBody);

  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'Invalid join code' });
});


})