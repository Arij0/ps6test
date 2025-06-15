const { Quiz } = require('../../models')
const { filterQuestionsFromQuiz } = require('./questions/manager')
const { filterAnswersFromQuestion } = require('./questions/manager')

/**
 * Construit un quiz complet (avec ses questions et leurs réponses)
 */
const buildQuiz = (quizId) => {
  const quiz = Quiz.getById(quizId)
  const questions = filterQuestionsFromQuiz(quiz.id)

  const questionsWithAnswers = questions.map((question) => {
    const answers = filterAnswersFromQuestion(question.id)
    return { ...question, answers }
  })

  return { ...quiz, questions: questionsWithAnswers }
}

/**
 * Construit la liste complète des quizzes avec leurs questions et réponses
 */
const buildQuizzes = () => {
  const quizzes = Quiz.get()
  return quizzes.map((quiz) => buildQuiz(quiz.id))
}

module.exports = {
  buildQuiz,
  buildQuizzes
}