const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Group = require('./group-model');
const { getGroupByName } = require('./GroupController')

let mongoServer;
let app;

describe('Group Service API Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGODB_URI = mongoUri;
    app = require('./group-service'); 
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    await Group.deleteMany({});
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
    await Group.create({
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
  await Group.create({
      uuid: 'full_group_uuid',
      groupName: 'Full group Test Group',
      members: Array(30).fill("member_uuid"),
      admin: 'admin_id2',
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
  await Group.create({
      uuid: 'incorrect_join_code_group_uuid',
      groupName: 'Test Group Incorrect Join Code',
      members: ['admin_id3'],
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
it('should return status 500 and error message when an error occurs', async () => {
  const mockError = new Error('Internal server error');
  jest.spyOn(Group, 'findOne').mockRejectedValue(mockError);
  const requestBody = {
      uuid: 'user_id',
      groupName: 'Test Group Failure'
  };
  const response = await request(app).post('/joingroup').send(requestBody);

  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: 'Internal server error' });
});

it('should successfully remove user from the group and remove the group when nobody is left', async () => {
  await Group.create({
      uuid: 'successfully_remove_member_group_and_remove_group_uuid',
      groupName: 'Succesfully remove member, and group Test Group',
      members: ['admin_id'],
      admin: 'admin_id',
      isPublic: true,
      maxNumUsers: 5
  });

  const requestBody = {
      expelledUUID: 'admin_id',
      groupName: 'Succesfully remove member, and group Test Group',
      adminUUID: 'admin_id'
  };

  const response = await request(app).post('/leaveGroup').send(requestBody);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('message');
  expect(response.body.message).toEqual('Group deleted');
});

it('should successfully remove user from the group and remove the group when nobody is left', async () => {
  const group = await Group.create({
      uuid: 'successfully_remove_member_group_and_remove_group_uuid',
      groupName: 'Succesfully remove member, and change admin group Test Group',
      members: ['admin_id','user_id'],
      admin: 'admin_id',
      isPublic: true,
      maxNumUsers: 5
  });

  const requestBody = {
      expelledUUID: 'admin_id',
      groupName: 'Succesfully remove member, and change admin group Test Group',
      adminUUID: 'admin_id'
  };

  const response = await request(app).post('/leaveGroup').send(requestBody);
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('members');
  expect(response.body.members).not.toContain(requestBody.expelledUUID);
  expect(response.body.admin).toBe('user_id');
});

it('should return message when user is unable to perform the operation leaveGroup', async () => {
  const group = await Group.create({
      uuid: 'group_uuid',
      groupName: 'Test Group',
      members: ['user_id'],
      admin: 'different_admin_id',
      isPublic: true,
      maxNumUsers: 5
  });
  const requestBody = {
      expelledUUID: 'user_id',
      groupName: 'Test Group',
      adminUUID: 'admin_id'
  };

  const response = await request(app).post('/leavegroup').send(requestBody);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ message: 'User is unable to perform this operation' });
});

it('should return status 500 and error message when an error occurs', async () => {
  const mockError = new Error('Internal server error');
  jest.spyOn(Group, 'findOne').mockRejectedValue(mockError);

  const requestBody = {
      expelledUUID: 'user_id',
      groupName: 'Test Group',
      adminUUID: 'admin_id'
  };

  const response = await request(app).post('/leavegroup').send(requestBody);
  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: 'Internal server error' });
});

it('should return the group when it exists', async () => {
  const group = {
      uuid: 'group_uuid',
      groupName: 'Test Group',
      members: ['user_id'],
      admin: 'different_admin_id',
      isPublic: true,
      maxNumUsers: 5
  };

  const savedGroup = await Group.create(group);
  const expectedResponse = {
    _id: savedGroup._id.toString(),
    __v: savedGroup.__v,
    uuid: savedGroup.uuid,
    groupName: savedGroup.groupName,
    members: savedGroup.members,
    admin: savedGroup.admin,
    isPublic: savedGroup.isPublic,
    maxNumUsers: savedGroup.maxNumUsers,
    creationDate: savedGroup.creationDate.toISOString(),
  }; 

  const response = await request(app).get(`/getGroup/${group.uuid}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual(expectedResponse);
});

it('should return status 404 and error message when group is not found', async () => {
  const response = await request(app).get('/getGroup/non_existent_uuid');
  expect(response.status).toBe(404);
  expect(response.body).toEqual({ error: 'Group not found' });
});

it('should return all groups', async () => {
  // Create some groups in the database
  const groups = [
      {
        uuid: 'group_uuid1',
        groupName: 'Test Group1',
        members: ['user_id1'],
        admin: 'admin_id1',
        isPublic: true,
        maxNumUsers: 5
      },
      { 
        uuid: 'group_uuid2',
        groupName: 'Test Group2',
        members: ['user_id2'],
        admin: 'admin_id2',
        isPublic: true,
        maxNumUsers: 5
      },
      {
        uuid: 'group_uuid3',
        groupName: 'Test Group3',
        members: ['user_id3'],
        admin: 'admin_id3',
        isPublic: true,
        maxNumUsers: 5
      }
  ];
  await Group.create(groups);

  const response = await request(app).get('/getGroups');
  expect(response.status).toBe(200);
  expect(response.body).toBeInstanceOf(Array);
  expect(response.body.length).toBe(3);

  // Assert that the names of the groups in the response match the expected names
  expect(response.body.map(group => group.groupName)).toEqual(
    expect.arrayContaining(groups.map(group => group.groupName))
  );
});

it('should return status 500 and error message when an error occurs', async () => {
  const mockError = new Error('Internal server error');
  jest.spyOn(Group, 'find').mockRejectedValue(mockError);
  const response = await request(app).get('/getGroups');
  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: 'Internal server error' });
});

it('should return status 500 and error message when an error occurs', async () => {
  // Mock the behavior of the findOne function to throw an error
  const mockError = new Error('Internal server error');
  jest.spyOn(Group, 'findOne').mockRejectedValue(mockError);

  const response = await request(app).get('/getGroup/group_uuid');
  expect(response.status).toBe(500);
  expect(response.body).toEqual({ error: 'Internal server error' });
});

it('should throw an error with the message "This group does not exist"', async () => {
  jest.spyOn(Group, 'findOne').mockResolvedValue(null);

  await expect(getGroupByName('NonExistentGroup')).rejects.toThrow('This group does not exist');
});

})