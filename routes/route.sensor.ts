const express = require('express')
const Sensor = require('../models/model.sensor.ts')
const router = express.Router();
const sensorController = require('../controller/controller.sensor.ts');

//router.get('/getSensor', sensorController.getSensors);

router.post('/createSensor', sensorController.createDataInflux);

module.exports = router;