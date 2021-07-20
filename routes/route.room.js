const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const roomController = require("../controller/controller.room");

router.get("/getRooms", auth, roomController.getAllRooms);
router.get("/getRoomDetails", auth, roomController.getRoomDetails);
router.get("/updateRoomLocked", auth, roomController.updateRoomLocked);
router.get("/updateRoomCapacity", auth, roomController.updateRoomCapacity);

module.exports = router;
