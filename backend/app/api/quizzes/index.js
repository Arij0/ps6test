const express = require('express');
const router = express.Router({ mergeParams: true });  // ← mergeParams VERY important
const { Question } = require('../../models');
const { getFilteredQuestions } = require('./manager');
const { manageAllErrors } = require('../../utils/routes/error-management');
const { Quiz } = require('../../models'); 
const questionsRouter = require('./questions');  // sans destructuration
router.use('/:quizId/questions', questionsRouter);


/* GET /api/quizzes/:quizId/questions */
router.get('/', (req, res) => {
  try {
    res.status(200).json(Quiz.get());           // renvoie tous les quiz
  } catch (e) {
    manageAllErrors(res, e);
  }
});


/* GET /api/quizzes/:quizId – un quiz précis */
router.get('/:quizId', (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    const quiz   = Quiz.get().find(q => q.id === quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (e) {
    manageAllErrors(res, e);
  }
});
router.post('/', (req, res) => {
  try {
    const quiz = req.body;
    const createdQuiz = Quiz.create(quiz);
    res.status(201).json(createdQuiz);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});


/* POST /api/quizzes/:quizId/questions/batch  (plusieurs) 
router.post('/batch', (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    const created = req.body.map(q =>
      Question.create({ ...q, quizId, isCustom: true })
    );
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});*/

/* DELETE /api/quizzes/:quizId/questions/:questionId */
router.delete('/:questionId', (req, res) => {
  try {
    Question.delete(req.params.questionId);
    res.status(204).end();
  } catch (e) {
    manageAllErrors(res, e);
  }
});
router.get('/', (req, res) => {
  console.log('GET /api/quizzes called');
  res.status(200).json(Quiz.get());
});
module.exports = router
