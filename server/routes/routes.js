const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const userActionController = require('../controllers/userActionController');

const verifyToken = require('../utils/verifyToken');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email', userController.verifyEmail);
router.post('/request-reset-password', userController.requestResetPassword);
router.post('/reset-password', userController.resetPassword);

router.get('/user/:username', userController.getUser);

router.post('/follow', userActionController.follow);
router.post('/like', verifyToken, userActionController.like);

router.post('/new_post', verifyToken, postController.newPost);
router.get('/post', postController.getPosts);
router.get('/post/:user', postController.getPostsByUser);

module.exports = router;