const express = require('express');
const router = express.Router({ mergeParams: true });

const { Quiz, Question } = require('../../../models');
const {
  getFilteredQuizQuestions,
  filterQuestions,
  checkForSimilarLetters
} = require('./manager');
const { manageAllErrors } = require('../../../utils/routes/error-management');


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
// POST /quizzes/:quizId/questions/batch
router.post('/batch', async (req, res) => {
  try {
    const quizId = Number(req.params.quizId);
    const questionsToAdd = req.body;

    if (!Array.isArray(questionsToAdd)) {
      return res.status(400).json({ error: 'Le corps de la requête doit être un tableau de questions.' });
    }

    const newQuestions = questionsToAdd.map(q => {
      return Question.create({
        ...q,
        quizId,
        hasSimilarLetters: checkForSimilarLetters(q.word)
      });
    });

    res.status(201).json({
      message: `${newQuestions.length} questions ajoutées avec succès`,
      questions: newQuestions
    });
  } catch (e) {
    manageAllErrors(res, e);
  }
});


module.exports = router;
