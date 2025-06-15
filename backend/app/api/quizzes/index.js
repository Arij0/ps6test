// backend/app/api/quizzes/index.js

const express = require('express');
const router = express.Router({ mergeParams: true });

// Chemin vers les modèles : depuis 'api/quizzes', on remonte 2 niveaux (api, app) puis on descend vers 'models'
const { Quiz } = require('../../models');
// Chemin vers error-management : depuis 'api/quizzes', on remonte 2 niveaux, puis on descend vers 'utils/routes'
const { manageAllErrors } = require('../../utils/routes/error-management');

// Chemin vers le routeur des questions (dans le même dossier 'quizzes')
const questionsRouter = require('./questions');

// Monter le routeur des questions
router.use('/:quizId/questions', questionsRouter);

/* GET /api/quizzes/ - Renvoie tous les quiz */
router.get('/', (req, res) => {
  console.log('GET /api/quizzes called');
  try {
    res.status(200).json(Quiz.get());
  } catch (e) {
    manageAllErrors(res, e);
  }
});

/* GET /api/quizzes/:quizId – Récupère un quiz précis */
router.get('/:quizId', (req, res) => {
  try {
    const quizId = parseInt(req.params.quizId, 10);
    const quiz = Quiz.get().find(q => q.id === quizId);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    res.status(200).json(quiz);
  } catch (e) {
    manageAllErrors(res, e);
  }
});

/* POST /api/quizzes/ - Crée un nouveau quiz */
router.post('/', (req, res) => {
  try {
    const quiz = req.body;
    const createdQuiz = Quiz.create(quiz);
    res.status(201).json(createdQuiz);
  } catch (e) {
    manageAllErrors(res, e);
  }
});

module.exports = router;