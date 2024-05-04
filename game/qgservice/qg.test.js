const request = require('supertest');
const app = require('./qg-service'); // Adjust the path based on your project structure
const QGController = require('./QGController');

describe('qg-service', function () {
  describe('GET /', function () {
    it('should respond with JSON message', function (done) {
      const expectedResponse = { "hi": "question generator" };
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          if (JSON.stringify(res.body) !== JSON.stringify(expectedResponse)) {
            return done(new Error('Unexpected response'));
          }
          done();
        });
    });
  });
/*
  describe('GET /game/:lang', function () {
    it('should call QGController.getQuestions with the correct language', function (done) {
      const lang = 'english';
      const fakeQuestions = [{ question: 'What is the capital of Spain?' }];
      const QGControllerStub = {
        getQuestions: (req, res) => {
          res.json(fakeQuestions);
        }
      };
      const getQuestionsSpy = jest.spyOn(QGControllerStub, 'getQuestions');

      request(app)
        .get(`/game/${lang}`)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(getQuestionsSpy).toHaveBeenCalledWith(expect.objectContaining({ params: { lang } }), expect.any(Object));
          getQuestionsSpy.mockRestore(); // Restore the spy after the test
          done();
        }).timeout(5000);
    }).timeout(5000);
  });

  describe('POST /getQuestionsByIds', function () {
    it('should call QGController.getQuestionsByIds with the correct IDs', function (done) {
      const ids = [1, 2, 3];
      const fakeQuestions = [{ id: 1, question: 'Question 1' }];
      const QGControllerStub = {
        getQuestionsByIds: (req, res) => {
          res.json(fakeQuestions);
        }
      };
      const getQuestionsByIdsSpy = jest.spyOn(QGControllerStub, 'getQuestionsByIds');

      request(app)
        .post('/getQuestionsByIds')
        .send({ ids })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(getQuestionsByIdsSpy).toHaveBeenCalledWith(expect.objectContaining({ body: { ids } }), expect.any(Object));
          getQuestionsByIdsSpy.mockRestore(); // Restore the spy after the test
          done();
        }).timeout(5000);
    }).timeout(5000);
  });*/
});