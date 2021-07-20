const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth')
const authController = require('../controller/controller.auth');

router.post('/register', authController.RegisterUser);
router.post('/login', authController.LoginUser);

router.get('/getDetails', auth, authController.GetUserDetails);
router.get('/logout', auth, authController.LogoutUser);

router.put('/updateUser', auth, authController.UpdateUser);

module.exports = router