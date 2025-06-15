const { Router } = require('express');

const router = Router();

const QuizzesRouter = require('./quizzes');
const UsersRouter   = require('./users');



router.get('/status', (req, res) => res.status(200).json('ok'));

router.use('/quizzes', QuizzesRouter);   // inclut /:quizId/questions via le sous-routeur
router.use('/users',   UsersRouter);

module.exports = router;
