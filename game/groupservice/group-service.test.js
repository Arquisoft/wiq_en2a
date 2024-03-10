const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const Group = require('./group-model');

let mongoServer;
let app

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    app = require('../../users/userservice/user-service');
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    // Clear the Group collection before each test
    await Group.deleteMany({});
});

describe('Group Service', () =>{
    it('create group on POST /create', async ()=>{
        const newUser = {
            username: 'testuser',
            password: 'testpassword',
          };

        const newGroup = new Group({
            groupName: 'testGroup',
            admin: 'testuser',
            description: 'description',
            isPublic: true,
        });

        await request(app).post('/adduser').send(newUser);
        
        const response = await request(app).post('/create').send(newGroup);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('groupName','testGroup');
    })

    it('user joins preexisting public group on /join', async ()=>{
        const admin = {
            username: 'adminUser',
            password: 'adminPassword',
          };

        const newUser = {
            username: 'testuser',
            password: 'testpassword',
          };

        const newGroup = new Group({
            groupName: 'testGroup',
            admin: 'testuser',
            description: 'description',
            isPublic: true,
        });

        await request(app).post('/adduser').send(admin);
        await request(app).post('/adduser').send(newUser);
        await request(app).post('/create').send(newGroup);

        const params = {
            username: 'testuser',
            groupName: 'testGroup',
            joinCode: 'adkabdwqi'
        }
    
        const response =  await request(app).post('/join').send(params);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('groupName','testGroup');
    })

    it('user leaves preexisting public group on /leave', async ()=>{
        const admin = {
            username: 'adminUser',
            password: 'adminPassword',
          };

        const newUser = {
            username: 'testuser',
            password: 'testpassword',
          };

        const newGroup = new Group({
            groupName: 'testGroup',
            admin: 'testuser',
            description: 'description',
            isPublic: true,
        });

        await request(app).post('/adduser').send(admin);
        await request(app).post('/create').send(newGroup);
        await request(app).post('/join').send(newUser);

        const params = {
            username: 'testuser',
            groupName: 'testGroup',
            joinCode: 'adkabdwqi'
        }
    
        const response =  await request(app).post('/leave').send(params);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('groupName', null);
    })

})