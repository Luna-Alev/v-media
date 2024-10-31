const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const userActionController = require('../controllers/userActionController');
const chatController = require('../controllers/chatController');

const verifyToken = require('../utils/verifyToken');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/verify-email', userController.verifyEmail);
router.post('/request-reset-password', userController.requestResetPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/update-password', verifyToken, userController.updatePassword);

router.get('/auth-profile', verifyToken, userController.authProfile);
router.get('/user/:username', userController.getUser);

router.post('/follow', userActionController.follow);
router.post('/like', verifyToken, userActionController.like);

router.post('/new_post', verifyToken, postController.newPost);
router.get('/post', postController.getPosts);
router.get('/post/:user', postController.getPostsByUser);

router.get('/chat/:recipient', verifyToken, chatController.getChat);

module.exports = router;