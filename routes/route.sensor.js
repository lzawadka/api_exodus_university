const express = require('express')
const router = express.Router();
const { auth } = require('../middleware/auth')
const sensorController = require('../controller/controller.sensor');

router.get('/getUserWatchData', auth, sensorController.GetUserWatchData);
router.post('/getAllUserRoomWatchData', auth, sensorController.GetAllUserRoomWatchData);
router.get('/getAllRoomData', auth, sensorController.GetAllRoomData);
router.post('/getRoomData', auth, sensorController.GetOneRoomData);

module.exports = router;