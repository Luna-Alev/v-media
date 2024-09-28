const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const userActionController = require('../controllers/userActionController');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user/:username', userController.getUser);
router.get('/verify-email', userController.verifyEmail);
router.post('/request-reset-password', userController.requestResetPassword);
router.post('/reset-password', userController.resetPassword);

router.post('/follow', userActionController.follow);
router.post('/like', userActionController.like);

router.post('/new_post', postController.newPost);
router.get('/posts', postController.getPosts);

module.exports = router;