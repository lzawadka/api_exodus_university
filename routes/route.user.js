const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth')
const authController = require('../controller/controller.auth');

router.post('/register', authController.RegisterUser);
router.post('/login', authController.LoginUser);
router.get('/getDetails', auth, authController.getUserDetails);
router.get('/logout', auth, authController.LogoutUser);

// router.get('/getUser', userController.getOne);

// router.post('/createUser', userController.addOne);

module.exports = router