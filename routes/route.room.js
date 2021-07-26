const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const roomController = require("../controller/controller.room");

router.get("/getRooms", auth, roomController.getAllRooms);
router.get("/getRoomDetails/:roomId", auth, roomController.getRoomDetails);
router.get("/updateRoomLocked/:roomId", auth, roomController.updateRoomLocked);
router.post("/updateRoomCapacity", auth, roomController.updateRoomCapacity);

module.exports = router;
