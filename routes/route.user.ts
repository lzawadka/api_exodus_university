const express = require('express');
const router = express.Router();
const User = require('../models/model.user')
const userController = require('../controller/controller.user.ts')
const { auth } = require('../middleware/auth')
const authController = require('../controller/controller.auth.ts');

router.post('/api/users/register', authController.RegisterUser);
router.post('/api/users/login', authController.LoginUser);
router.get('/api/users/auth', auth, authController.getUserDetails);
router.get('/api/users/logout', auth, authController.LogoutUser);

// router.get('/getUser', userController.getOne);

// router.post('/createUser', userController.addOne);

module.exports = router