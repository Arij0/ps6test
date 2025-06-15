const { Question } = require('../../../models');

// Groupes de lettres similaires
const similarLetterGroups = [
  ['b', 'd'],
  ['p', 'q'],
  ['m', 'n'],
  ['v', 'w'],
  ['i', 'j', 'l'],
  ['a', 'e', 'o']
];

// Vérifie si un mot contient plus d'une lettre similaire du même groupe
function checkForSimilarLetters(word) {
  const lowerWord = word.toLowerCase();
  for (const group of similarLetterGroups) {
    const lettersInWord = group.filter(letter => lowerWord.includes(letter));
    if (lettersInWord.length > 1) {
      return true;
    }
  }
  return false;
}

// Critères de difficulté
const filterCriteria = {
  easy: {
    minWordLength: 3,
    maxWordLength: 5,
    wordLengthOptions: [3, 4, 5],
    includeSimilarLetters: false,
    maxPhoneticComplexity: 1
  },
  medium: {
    minWordLength: 4,
    maxWordLength: 7,
    wordLengthOptions: [4, 5, 6, 7],
    includeSimilarLetters: true,
    maxPhoneticComplexity: 2
  },
  hard: {
    minWordLength: 6,
    maxWordLength: 10,
    wordLengthOptions: [6, 7, 8, 9, 10],
    includeSimilarLetters: true,
    maxPhoneticComplexity: 3
  }
};

// Fonction de filtrage principale
function filterQuestions(questions, difficulty, specificWordLength = null) {
  if (!filterCriteria[difficulty]) {
    throw new Error(`Difficulté non supportée: ${difficulty}`);
  }

  const criteria = filterCriteria[difficulty];

  // Si wordLength spécifié, vérifier qu'il est dans les options autorisées
  if (specificWordLength !== null) {
    const wl = parseInt(specificWordLength);
    if (!criteria.wordLengthOptions.includes(wl)) {
      throw new Error(
        `Longueur ${wl} non autorisée pour ${difficulty}. Options: ${criteria.wordLengthOptions.join(', ')}`
      );
    }
  }

  return questions.filter(question => {
    const wl = question.wordLength;
    const lengthValid = specificWordLength
      ? wl === parseInt(specificWordLength)
      : wl >= criteria.minWordLength && wl <= criteria.maxWordLength;

    const similarLettersValid = criteria.includeSimilarLetters || !question.hasSimilarLetters;
    const phoneticComplexityValid = question.phoneticComplexity <= criteria.maxPhoneticComplexity;

    return lengthValid && similarLettersValid && phoneticComplexityValid;
  });
}

// Récupère les questions filtrées pour un quiz donné
async function getFilteredQuizQuestions(quizId, difficulty = 'medium', wordLength = null) {
  try {
    const allQuestions = Question.get().filter(q => q.quizId === quizId);
    return filterQuestions(allQuestions, difficulty, wordLength);
  } catch (error) {
    console.error('Erreur lors du filtrage des questions:', error);
    throw error;
  }
}

module.exports = {
  getFilteredQuizQuestions,
  filterQuestions,
  checkForSimilarLetters
};
