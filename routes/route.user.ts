const express = require('express');
const router = express.Router();
const User = require('../models/model.user.ts')
const userController = require('../controller/controller.user')

router.get('/getUser', userController.getOne);

router.post('/createUser', userController.addOne);

module.exports = router