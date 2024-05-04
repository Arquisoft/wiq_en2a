const assert = require('chai').assert;
const sinon = require('sinon');
const request = require('supertest');
const app = require('../qg-service'); // Ajusta la ruta según la estructura de tu proyecto
const QGController = require('../QGController');

describe('qg-service', function () {
  describe('GET /', function () {
    it('should respond with JSON message', function (done) {
      const expectedResponse = { "hi": "question generator" };
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          assert.deepEqual(res.body, expectedResponse);
          done();
        });
    });
  });

  describe('GET /game/:lang', function () {
    it('should call QGController.getQuestions with the correct language', function (done) {
      const lang = 'english';
      const req = { params: { lang } };
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      const fakeQuestions = [{ question: 'What is the capital of Spain?' }];
      sinon.stub(QGController, 'getQuestions').resolves(fakeQuestions);

      request(app)
        .get(`/game/${lang}`)
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          sinon.assert.calledOnceWithExactly(QGController.getQuestions, req, res);
          sinon.restore(); // Restaurar el controlador QGController después de la prueba
          done();
        });
    });
  });

  describe('POST /getQuestionsByIds', function () {
    it('should call QGController.getQuestionsByIds with the correct IDs', function (done) {
      const ids = [1, 2, 3];
      const req = { body: { ids } };
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      const fakeQuestions = [{ id: 1, question: 'Question 1' }];
      sinon.stub(QGController, 'getQuestionsByIds').resolves(fakeQuestions);

      request(app)
        .post('/getQuestionsByIds')
        .send({ ids })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          sinon.assert.calledOnceWithExactly(QGController.getQuestionsByIds, req, res);
          sinon.restore(); // Restaurar el controlador QGController después de la prueba
          done();
        });
    });
  });
});