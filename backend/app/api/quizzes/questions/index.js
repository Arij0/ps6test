const express = require('express');
const router = express.Router({ mergeParams: true });

const { Quiz, Question } = require('../../../models');
const {
  getFilteredQuizQuestions,
  filterQuestions,
  checkForSimilarLetters
} = require('./manager');
const { manageAllErrors } = require('../../../utils/routes/error-management');

// GET /quizzes/:quizId/questions?difficulty=easy&wordLength=4
router.get('/', async (req, res) => {
  try {
    const quizId = Number(req.params.quizId);
    const { difficulty = 'medium', wordLength } = req.query;

    const validDifficulties = ['easy', 'medium', 'hard'];
    if (difficulty && !validDifficulties.includes(difficulty)) {
      return res.status(400).json({
        error: 'Difficulté invalide',
        validOptions: validDifficulties
      });
    }

    // Si pas de difficulté spécifiée, retourner toutes les questions du quiz
    if (!req.query.difficulty) {
      const questions = Question.get().filter(q => q.quizId === quizId);
      return res.json(questions);
    }

    const questions = await getFilteredQuizQuestions(quizId, difficulty, wordLength);

    res.json({
      success: true,
      difficulty,
      wordLength: wordLength ? Number(wordLength) : null,
      totalQuestions: questions.length,
      questions
    });
   
  } catch (e) {
    manageAllErrors(res, e);
  }
});

module.exports = router;